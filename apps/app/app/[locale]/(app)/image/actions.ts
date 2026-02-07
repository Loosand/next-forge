"use server";

import { auth } from "@repo/auth/server";
import { database, eq, task } from "@repo/database";
import type { FalModelId } from "@repo/fal/types";
import { buildUrl } from "@repo/storage";
import { falRunTask } from "@repo/trigger";
import { headers } from "next/headers";
import { env } from "@/env";

const R2_PUBLIC_URL = env.NEXT_PUBLIC_CLOUDFLARE_R2_URL ?? "";

export async function generateImage(params: {
  endpointId: FalModelId;
  prompt: string;
  aspectRatio?: string;
  numImages?: number;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Not logged in");
  }

  if (!params.prompt.trim()) {
    throw new Error("Prompt is required");
  }

  const userId = session.user.id;

  const input = {
    prompt: params.prompt,
    image_size: params.aspectRatio,
    num_images: params.numImages ?? 1,
  };

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
