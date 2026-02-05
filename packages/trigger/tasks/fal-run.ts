/**
 * [INPUT]: FalRunPayload - 包含 endpointId, input, config, metadata
 * [OUTPUT]: FalRunResult - 包含 success, result/error, queueLogs, metadata
 * [POS]: 位于 /packages/trigger/tasks 的通用 fal.ai 任务，支持调用任意 fal.ai 端点
 *
 * [PROTOCOL]:
 * 1. 一旦本文件逻辑变更，必须同步更新此 Header
 * 2. 更新后必须上浮检查 /packages/trigger/.folder.md 的描述是否依然准确
 */

import type { QueueStatus } from "@fal-ai/client";
import { fal } from "@fal-ai/client";
import type { FalModelId } from "@repo/fal/types";
import { logger, runs, task, wait } from "@trigger.dev/sdk/v3";
import type { FalRunPayload, FalRunResult } from "../types/fal";

export const falRunTask = task({
  id: "fal-run",
  maxDuration: 1800, // 30 minutes for long-running models like video generation
  run: async (payload: FalRunPayload): Promise<FalRunResult> => {
    const { endpointId, input, config, metadata } = payload;
    const queueLogs: QueueStatus[] = [];
    const pollIntervalSeconds = (config?.pollInterval ?? 2000) / 1000;

    logger.info("Starting fal.ai task", { endpointId, metadata });

    try {
      // 使用 queue API 代替 subscribe，更稳定
      const submitted = await fal.subscribe(endpointId, { input });

      logger.info("Fal task submitted", {
        endpointId,
        requestId: submitted.requestId,
      });

      // 轮询状态直到完成
      let status = await fal.queue.status(endpointId, {
        requestId: submitted.requestId,
        logs: config?.logs ?? true,
      });

      while (status.status !== "COMPLETED") {
        queueLogs.push(status);

        if (status.status === "IN_QUEUE") {
          logger.info("Fal task in queue", {
            endpointId,
            position: status.queue_position,
          });
        } else if (status.status === "IN_PROGRESS") {
          logger.info("Fal task in progress", {
            endpointId,
            logs: status.logs?.slice(-1),
          });
        }

        // 使用 Trigger.dev 的 wait 进行 checkpoint
        await wait.for({ seconds: pollIntervalSeconds });

        status = await fal.queue.status(endpointId, {
          requestId: submitted.requestId,
          logs: config?.logs ?? true,
        });
      }

      // 记录最终完成状态
      queueLogs.push(status);

      // 获取结果
      const result = await fal.queue.result(endpointId, {
        requestId: submitted.requestId,
      });

      logger.info("Fal task finished successfully", {
        endpointId,
        requestId: result.requestId,
      });

      return {
        success: true,
        result,
        queueLogs,
        metadata,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);

      logger.error("Fal task failed", {
        endpointId,
        error: errorMessage,
        metadata,
      });

      return {
        success: false,
        error: errorMessage,
        queueLogs,
        metadata,
      };
    }
  },
});

/**
 * 创建类型安全的 fal 任务触发器
 *
 * @example
 * ```typescript
 * import { createTypedFalTrigger } from "@repo/trigger";
 * import type { NanoBananaInput, NanoBananaOutput } from "@fal-ai/client/endpoints";
 *
 * const triggerNanoBanana = createTypedFalTrigger<
 *   "fal-ai/nano-banana",
 *   NanoBananaInput,
 *   NanoBananaOutput
 * >("fal-ai/nano-banana");
 *
 * const handle = await triggerNanoBanana({
 *   input: { prompt: "A sunset" },
 * });
 * ```
 */
export function createTypedFalTrigger<
  TEndpointId extends FalModelId,
  TInput extends Record<string, unknown>,
  TOutput,
>(endpointId: TEndpointId) {
  return async (
    options: Omit<FalRunPayload<TInput>, "endpointId">
  ): Promise<{
    id: string;
    wait: () => Promise<FalRunResult<TOutput>>;
  }> => {
    const handle = await falRunTask.trigger({
      endpointId,
      input: options.input,
      config: options.config,
      metadata: options.metadata,
    });

    return {
      id: handle.id,
      wait: async () => {
        const result = await runs.poll(handle.id);
        return result.output as FalRunResult<TOutput>;
      },
    };
  };
}
