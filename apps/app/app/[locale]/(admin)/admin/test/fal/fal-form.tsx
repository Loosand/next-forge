/** biome-ignore-all lint/a11y/useMediaCaption: <explanation> */
"use client";

import { Button } from "@repo/design-system/components/ui/button";
import { Input } from "@repo/design-system/components/ui/input";
import type { falRunTask } from "@repo/trigger";
import { useRealtimeRun } from "@trigger.dev/react-hooks";
import { useState } from "react";
import useSWR from "swr";
import {
  getTaskWithAssets,
  type TaskWithAssets,
  triggerFalModelAction,
} from "./actions";

const tokenFetcher = (url: string) =>
  fetch(url, { method: "POST" }).then((res) => res.json());

export function FalForm() {
  const [prompt, setPrompt] = useState("A beautiful sunset over mountains");
  const [runId, setRunId] = useState<string | null>(null);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    data: tokenData,
    error: tokenError,
    isLoading: tokenLoading,
  } = useSWR<{ token: string; error?: string }>(
    "/api/trigger/token",
    tokenFetcher,
    { revalidateOnFocus: false, revalidateOnReconnect: false }
  );

  const accessToken = tokenData?.token;

  // Trigger.dev 实时跟踪
  const { run, error: runError } = useRealtimeRun<typeof falRunTask>(
    runId ?? undefined,
    {
      accessToken: accessToken ?? "",
      enabled: !!accessToken && !!runId,
    }
  );

  // run 完成后一次性拉取 DB task + assets
  const { data: taskData } = useSWR<TaskWithAssets | null>(
    taskId && run?.finishedAt ? `task-${taskId}` : null,
    () => getTaskWithAssets(taskId!)
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken) return;

    setIsSubmitting(true);
    setSubmitError(null);
    setRunId(null);
    setTaskId(null);

    try {
      const result = await triggerFalModelAction(
        "fal-ai/wan/v2.2-a14b/text-to-video",
        {
          prompt,
          num_frames: 17,
          frames_per_second: 4,
          resolution: "480p",
        }
      );
      setRunId(result.runId);
      setTaskId(result.taskId);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (tokenError || tokenData?.error) {
    return (
      <div className="w-full max-w-md rounded-lg bg-red-100 p-4 text-red-800 dark:bg-red-900 dark:text-red-100">
        <p className="font-medium">Failed to get access token</p>
        <p className="text-sm">{tokenError?.message || tokenData?.error}</p>
      </div>
    );
  }

  if (tokenLoading || !accessToken) {
    return (
      <div className="w-full max-w-md text-center text-muted-foreground">
        Loading...
      </div>
    );
  }

  const isRunning = isSubmitting || (run && !run.finishedAt);

  return (
    <div className="w-full max-w-md space-y-4">
      <form className="flex gap-2" onSubmit={handleSubmit}>
        <Input
          disabled={!!isRunning}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter a prompt..."
          type="text"
          value={prompt}
        />
        <Button disabled={!!isRunning} type="submit">
          {isRunning ? "Generating..." : "Generate Image"}
        </Button>
      </form>

      {(runError || submitError) && (
        <div className="rounded-lg bg-red-100 p-4 text-red-800 dark:bg-red-900 dark:text-red-100">
          <p className="font-medium">Error</p>
          <p className="text-sm">{runError?.message || submitError}</p>
        </div>
      )}

      {/* Trigger.dev 实时进度（队列中、执行中） */}
      {run && !taskData && (
        <div className="space-y-2 rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <span className="font-medium">Run Progress</span>
            <StatusBadge status={run.status} />
          </div>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Run ID</span>
              <span className="font-mono text-xs">{run.id}</span>
            </div>
          </div>
        </div>
      )}

      {/* DB Task 状态 + Assets */}
      {taskData && (
        <div className="space-y-3 rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <span className="font-medium">Task</span>
            <StatusBadge status={taskData.status} />
          </div>

          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Task ID</span>
              <span className="font-mono text-xs">{taskData.id}</span>
            </div>
            {taskData.triggerRunId && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Run ID</span>
                <span className="font-mono text-xs">
                  {taskData.triggerRunId}
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">Created</span>
              <span>{new Date(taskData.createdAt).toLocaleTimeString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Updated</span>
              <span>{new Date(taskData.updatedAt).toLocaleTimeString()}</span>
            </div>
          </div>

          {/* 完成：显示 assets */}
          {taskData.status === "completed" && taskData.assets.length > 0 && (
            <div className="space-y-2 rounded-md bg-green-50 p-3 dark:bg-green-950">
              <p className="font-medium text-green-800 text-sm dark:text-green-200">
                Assets ({taskData.assets.length})
              </p>
              <div className="space-y-2">
                {taskData.assets.map((a) => (
                  <div className="space-y-1" key={a.id}>
                    {a.mediaType === "image" && (
                      <img
                        alt={`Asset ${a.id}`}
                        className="max-w-full rounded-md"
                        src={a.url}
                      />
                    )}
                    {a.mediaType === "video" && (
                      <video
                        className="max-w-full rounded-md"
                        controls
                        src={a.url}
                      />
                    )}
                    {a.mediaType === "audio" && (
                      <audio className="w-full" controls src={a.url} />
                    )}
                    <p className="font-mono text-muted-foreground text-xs">
                      {a.storageKey}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {taskData.status === "completed" && taskData.assets.length === 0 && (
            <p className="text-muted-foreground text-sm">
              Task completed with no assets.
            </p>
          )}

          {/* 失败：显示错误 */}
          {taskData.status === "failed" && !!taskData.response && (
            <div className="rounded-md bg-red-50 p-3 dark:bg-red-950">
              <p className="font-medium text-red-800 text-sm dark:text-red-200">
                Failed
              </p>
              <p className="text-red-600 text-sm dark:text-red-400">
                {(taskData.response as { error?: string }).error ??
                  JSON.stringify(taskData.response)}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const statusConfig: Record<string, { bg: string; text: string }> = {
    PENDING: {
      bg: "bg-gray-100 dark:bg-gray-800",
      text: "text-gray-700 dark:text-gray-300",
    },
    QUEUED: {
      bg: "bg-yellow-100 dark:bg-yellow-900",
      text: "text-yellow-700 dark:text-yellow-300",
    },
    EXECUTING: {
      bg: "bg-blue-100 dark:bg-blue-900",
      text: "text-blue-700 dark:text-blue-300",
    },
    COMPLETED: {
      bg: "bg-green-100 dark:bg-green-900",
      text: "text-green-700 dark:text-green-300",
    },
    FAILED: {
      bg: "bg-red-100 dark:bg-red-900",
      text: "text-red-700 dark:text-red-300",
    },
    CANCELED: {
      bg: "bg-gray-100 dark:bg-gray-800",
      text: "text-gray-700 dark:text-gray-300",
    },
    pending: {
      bg: "bg-gray-100 dark:bg-gray-800",
      text: "text-gray-700 dark:text-gray-300",
    },
    completed: {
      bg: "bg-green-100 dark:bg-green-900",
      text: "text-green-700 dark:text-green-300",
    },
    failed: {
      bg: "bg-red-100 dark:bg-red-900",
      text: "text-red-700 dark:text-red-300",
    },
  };

  const config = statusConfig[status] ?? statusConfig.PENDING;

  return (
    <span
      className={`rounded-full px-2 py-1 font-medium text-xs ${config.bg} ${config.text}`}
    >
      {status}
    </span>
  );
}
