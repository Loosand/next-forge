"use server";

import { auth } from "@repo/auth/server";
import { database, eq, task } from "@repo/database";
import type { FalModelId } from "@repo/fal/types";
import { buildUrl } from "@repo/storage";
import { falRunTask } from "@repo/trigger";
import { headers } from "next/headers";
import { env } from "@/env";
import { IMAGE_MODELS } from "./_constants/models";

const R2_PUBLIC_URL = env.NEXT_PUBLIC_CLOUDFLARE_R2_URL ?? "";

export async function generateImage(params: {
  endpointId: FalModelId;
  input: {
    prompt: string;
    aspectRatio: string; // 统一比例字符串，如 "1:1"
    count?: number;
    [key: string]: unknown;
  };
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Not logged in");
  }

  if (!params.input.prompt.trim()) {
    throw new Error("Prompt is required");
  }

  const userId = session.user.id;

  // 所有 API 字段名都来自模型定义，action 层零硬编码
  const modelDef = IMAGE_MODELS.find((m) => m.id === params.endpointId);
  const mp = modelDef?.params;

  // 从 input 中拆出已知字段，剩余的直接透传给 API
  const { prompt, aspectRatio, count, ...rest } = params.input;

  const input: Record<string, unknown> = {};

  // prompt
  input[mp?.prompt.field ?? "prompt"] = prompt;

  // size: 用 ratioMap 把统一比例翻译成 API 实际需要的值
  if (mp) {
    const apiValue = mp.size.ratioMap[aspectRatio];
    input[mp.size.field] = apiValue ?? aspectRatio;
  }

  // count
  if (mp?.count && count) {
    input[mp.count.field] = count;
  }

  // 其余参数（如 resolution 等）直接透传
  for (const [key, value] of Object.entries(rest)) {
    input[key] = value;
  }

  const [taskRecord] = await database
    .insert(task)
    .values({
      userId,
      model: params.endpointId,
      status: "pending",
      payload: { endpointId: params.endpointId, input },
    })
    .returning({ id: task.id });

  const taskId = taskRecord.id;

  const handle = await falRunTask.trigger({
    endpointId: params.endpointId,
    input,
    taskId,
    userId,
    metadata: {
      source: "image-generation",
      timestamp: new Date().toISOString(),
    },
  });

  await database
    .update(task)
    .set({ triggerRunId: handle.id })
    .where(eq(task.id, taskId));

  return { runId: handle.id, taskId };
}

export async function getGenerationHistory() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) return [];

  const tasks = await database.query.task.findMany({
    where: eq(task.userId, session.user.id),
    orderBy: (t, { desc }) => desc(t.createdAt),
    with: { assets: true },
    limit: 50,
  });

  return tasks
    .filter((t) => t.status === "completed" && t.assets.length > 0)
    .map((t) => {
      const payload = t.payload as Record<string, unknown> | null;
      const input = payload?.input as Record<string, unknown> | null;
      return {
        id: t.id,
        model: t.model,
        prompt: (input?.prompt as string) ?? null,
        status: t.status,
        createdAt: t.createdAt.toISOString(),
        assets: t.assets.map((a) => ({
          id: a.id,
          mediaType: a.mediaType,
          url: buildUrl(a.storageKey, R2_PUBLIC_URL),
        })),
      };
    });
}

export async function getTaskWithAssets(taskId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Not logged in");
  }

  const taskRecord = await database.query.task.findFirst({
    where: eq(task.id, taskId),
    with: { assets: true },
  });

  if (!taskRecord || taskRecord.userId !== session.user.id) {
    return null;
  }

  return {
    id: taskRecord.id,
    status: taskRecord.status,
    response: taskRecord.response,
    assets: taskRecord.assets.map((a) => ({
      id: a.id,
      mediaType: a.mediaType,
      storageKey: a.storageKey,
      url: buildUrl(a.storageKey, R2_PUBLIC_URL),
    })),
  };
}
