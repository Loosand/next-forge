/**
 * [INPUT]: FalRunPayload - 包含 endpointId, input, config, metadata, taskId?, userId?
 * [OUTPUT]: FalRunResult - 包含 success, result/error, media, queueLogs, metadata
 * [POS]: 位于 /packages/trigger/tasks 的通用 fal.ai 任务，支持调用任意 fal.ai 端点。
 *        当提供 taskId/userId 时，完成后上传媒体至 R2 并更新 DB task/asset 记录。
 *
 * [PROTOCOL]:
 * 1. 一旦本文件逻辑变更，必须同步更新此 Header
 * 2. 更新后必须上浮检查 /packages/trigger/.folder.md 的描述是否依然准确
 */

import type { QueueStatus } from "@fal-ai/client";
import { fal } from "@fal-ai/client";
import { asset, database, eq, task as taskTable } from "@repo/database";
import { buildKey, fetchAndUpload } from "@repo/storage";
import { logger, task, wait } from "@trigger.dev/sdk/v3";
import type { ExtractedMedia, FalRunPayload, FalRunResult } from "../types/fal";

const CONTENT_TYPE_EXT: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
  "video/mp4": "mp4",
  "video/webm": "webm",
  "audio/mpeg": "mp3",
  "audio/wav": "wav",
  "audio/ogg": "ogg",
};

/** 从 ExtractedMedia 的 contentType 推断文件扩展名 */
function extensionFromMedia(item: ExtractedMedia): string {
  if (item.contentType && CONTENT_TYPE_EXT[item.contentType]) {
    return CONTENT_TYPE_EXT[item.contentType];
  }
  // fallback by media type
  const defaults: Record<string, string> = {
    image: "png",
    video: "mp4",
    audio: "mp3",
  };
  return defaults[item.type] ?? "bin";
}

/**
 * 运行时从 fal 输出中提取标准化媒体列表
 *
 * 覆盖三种 fal 输出模式：
 * - Image: { images: Array<{ url, content_type?, width?, height?, file_size? }> }
 * - Video: { video: { url, content_type?, duration?, file_size? } }
 * - Audio: { audio: { url, content_type?, duration?, file_size? } }
 */
function extractMedia(data: unknown): ExtractedMedia[] {
  if (!data || typeof data !== "object") return [];

  const d = data as Record<string, unknown>;
  const media: ExtractedMedia[] = [];

  // Image: { images: Array<ImageFile> }
  if ("images" in d && Array.isArray(d.images)) {
    for (const img of d.images) {
      if (img && typeof img === "object" && "url" in img) {
        const i = img as Record<string, unknown>;
        media.push({
          type: "image",
          url: i.url as string,
          contentType: i.content_type as string | undefined,
          width: i.width as number | undefined,
          height: i.height as number | undefined,
          fileSize: i.file_size as number | undefined,
        });
      }
    }
  }

  // Video: { video: File }
  if (
    "video" in d &&
    d.video &&
    typeof d.video === "object" &&
    "url" in d.video
  ) {
    const v = d.video as Record<string, unknown>;
    media.push({
      type: "video",
      url: v.url as string,
      contentType: v.content_type as string | undefined,
      duration: v.duration as number | undefined,
      fileSize: v.file_size as number | undefined,
    });
  }

  // Audio: { audio: File }
  if (
    "audio" in d &&
    d.audio &&
    typeof d.audio === "object" &&
    "url" in d.audio
  ) {
    const a = d.audio as Record<string, unknown>;
    media.push({
      type: "audio",
      url: a.url as string,
      contentType: a.content_type as string | undefined,
      duration: a.duration as number | undefined,
      fileSize: a.file_size as number | undefined,
    });
  }

  return media;
}

/** 带重试的异步调用，处理 Bun fetch socket 瞬态错误 */
async function withRetry<T>(
  fn: () => Promise<T>,
  label: string,
  maxRetries = 3
): Promise<T> {
  for (let attempt = 0; ; attempt++) {
    try {
      return await fn();
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      const isTransient =
        msg.includes("socket") ||
        msg.includes("ECONNRESET") ||
        msg.includes("fetch failed");
      if (!isTransient || attempt >= maxRetries) throw err;
      logger.warn(
        `${label}: transient error, retry ${attempt + 1}/${maxRetries}`,
        {
          error: msg,
        }
      );
      await new Promise((r) => setTimeout(r, 1000 * (attempt + 1)));
    }
  }
}

export const falRunTask = task({
  id: "fal-run",
  maxDuration: 1800, // 30 minutes for long-running models like video generation
  run: async (payload: FalRunPayload): Promise<FalRunResult> => {
    const { endpointId, input, config, metadata, taskId, userId } = payload;
    const queueLogs: QueueStatus[] = [];
    const pollIntervalSeconds = (config?.pollInterval ?? 2000) / 1000;

    logger.info("Starting fal.ai task", { endpointId, taskId, metadata });

    // ========== Phase 1: fal 执行 ==========
    // submit 只提交，不等结果（避免 subscribe 的长连接 socket 问题）
    const { request_id: requestId } = await withRetry(
      () => fal.queue.submit(endpointId, { input }),
      "fal.queue.submit"
    );

    logger.info("Fal task submitted", { endpointId, requestId });

    // 手动 poll，配合 wait.for() 做 Trigger.dev checkpoint
    let status = await withRetry(
      () =>
        fal.queue.status(endpointId, {
          requestId,
          logs: config?.logs ?? true,
        }),
      "fal.queue.status"
    );

    while (status.status !== "COMPLETED") {
      queueLogs.push(status);
      await wait.for({ seconds: pollIntervalSeconds });

      status = await withRetry(
        () =>
          fal.queue.status(endpointId, {
            requestId,
            logs: config?.logs ?? true,
          }),
        "fal.queue.status"
      );
    }

    queueLogs.push(status);

    const result = await withRetry(
      () => fal.queue.result(endpointId, { requestId }),
      "fal.queue.result"
    );

    const media = extractMedia(result.data);

    logger.info("Fal task finished successfully", {
      endpointId,
      requestId: result.requestId,
      mediaCount: media.length,
    });

    // ========== Phase 2: 持久化（非致命，不重跑 fal） ==========
    try {
      if (taskId && userId && media.length > 0) {
        const assetRecords: (typeof asset.$inferInsert)[] = [];

        for (const item of media) {
          try {
            const storageKey = buildKey({
              folder: "generations",
              userId,
              prefix: item.type,
              extension: extensionFromMedia(item),
            });
            await fetchAndUpload({
              sourceUrl: item.url,
              destinationKey: storageKey,
            });
            assetRecords.push({
              taskId,
              userId,
              mediaType: item.type,
              storageKey,
              metadata: {
                width: item.width,
                height: item.height,
                duration: item.duration,
                fileSize: item.fileSize,
                contentType: item.contentType,
              },
            });
          } catch (uploadErr) {
            logger.error("Failed to upload media to R2", {
              url: item.url,
              error:
                uploadErr instanceof Error
                  ? uploadErr.message
                  : String(uploadErr),
            });
          }
        }

        if (assetRecords.length > 0) {
          await database.insert(asset).values(assetRecords);
          logger.info("Assets inserted", { count: assetRecords.length });
        }
      }

      if (taskId) {
        await database
          .update(taskTable)
          .set({
            status: "completed",
            response: {
              requestId: result.requestId,
              mediaCount: media.length,
            },
          })
          .where(eq(taskTable.id, taskId));
        logger.info("Task updated to completed", { taskId });
      }
    } catch (persistErr) {
      logger.error("Persistence failed", {
        taskId,
        error:
          persistErr instanceof Error ? persistErr.message : String(persistErr),
      });

      // 尝试标记 task 为 failed（best-effort）
      if (taskId) {
        try {
          await database
            .update(taskTable)
            .set({
              status: "failed",
              response: {
                error:
                  persistErr instanceof Error
                    ? persistErr.message
                    : String(persistErr),
              },
            })
            .where(eq(taskTable.id, taskId));
        } catch {
          // DB 本身不可用，无能为力
        }
      }
    }

    return {
      success: true,
      result,
      media,
      queueLogs,
      metadata,
    };
  },
});
