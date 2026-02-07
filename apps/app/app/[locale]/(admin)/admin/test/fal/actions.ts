"use server";

import { auth } from "@repo/auth/server";
import { database, eq, task } from "@repo/database";
import type { FalEndpointTypeMap, FalModelId } from "@repo/fal/types";
import { buildUrl } from "@repo/storage";
import { falRunTask } from "@repo/trigger";
import { headers } from "next/headers";

const R2_PUBLIC_URL = process.env.NEXT_PUBLIC_CLOUDFLARE_R2_URL ?? "";

export async function triggerFalModelAction<T extends FalModelId>(
  endpointId: T,
  input: FalEndpointTypeMap[T]["input"]
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Not logged in");
  }

  const userId = session.user.id;

  // 创建 task 记录
  const [taskRecord] = await database
    .insert(task)
    .values({
      userId,
      model: endpointId,
      status: "pending",
      payload: { endpointId, input },
    })
    .returning({ id: task.id });

  const taskId = taskRecord.id;

  // 触发 Trigger.dev 任务
  const handle = await falRunTask.trigger({
    endpointId,
    input,
    taskId,
    userId,
    metadata: {
      source: "fal-test-page",
      timestamp: new Date().toISOString(),
    },
  });

  // 写回 triggerRunId
  await database
    .update(task)
    .set({ triggerRunId: handle.id })
    .where(eq(task.id, taskId));

  return { runId: handle.id, taskId };
}

export type TaskWithAssets = {
  id: string;
  status: string;
  triggerRunId: string | null;
  response: unknown;
  createdAt: Date;
  updatedAt: Date;
  assets: {
    id: string;
    mediaType: string;
    storageKey: string;
    url: string;
    metadata: unknown;
    createdAt: Date;
  }[];
};

export async function getTaskWithAssets(
  taskId: string
): Promise<TaskWithAssets | null> {
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
    triggerRunId: taskRecord.triggerRunId,
    response: taskRecord.response,
    createdAt: taskRecord.createdAt,
    updatedAt: taskRecord.updatedAt,
    assets: taskRecord.assets.map((a) => ({
      id: a.id,
      mediaType: a.mediaType,
      storageKey: a.storageKey,
      url: buildUrl(a.storageKey, R2_PUBLIC_URL),
      metadata: a.metadata,
      createdAt: a.createdAt,
    })),
  };
}
