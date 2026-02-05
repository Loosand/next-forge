"use client";

import { Button } from "@repo/design-system/components/ui/button";
import { Input } from "@repo/design-system/components/ui/input";
import type { NanoBananaOutput } from "@repo/fal/types";
import type { FalRunResult, falRunTask } from "@repo/trigger";
import { useRealtimeRun } from "@trigger.dev/react-hooks";
import { useState } from "react";
import useSWR from "swr";
import { triggerNanoBananaAction } from "./actions";

// Type alias for the specific output type
type NanoBananaRunResult = FalRunResult<NanoBananaOutput>;

// Type guard for successful result
function isSuccessResult(
  output: NanoBananaRunResult | undefined
): output is Extract<NanoBananaRunResult, { success: true }> {
  return output?.success === true;
}

// Type guard for failed result
function isFailedResult(
  output: NanoBananaRunResult | undefined
): output is Extract<NanoBananaRunResult, { success: false }> {
  return output?.success === false;
}

const fetcher = (url: string) =>
  fetch(url, { method: "POST" }).then((res) => res.json());

export function FalForm() {
  const [prompt, setPrompt] = useState("A beautiful sunset over mountains");
  const [runId, setRunId] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    data: tokenData,
    error: tokenError,
    isLoading: tokenLoading,
  } = useSWR<{ token: string; error?: string }>("/api/trigger/token", fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  const accessToken = tokenData?.token;

  // 使用 useRealtimeRun 跟踪任务状态
  const { run, error } = useRealtimeRun<typeof falRunTask>(runId ?? undefined, {
    accessToken: accessToken ?? "",
    enabled: !!accessToken && !!runId,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // 调用 server action 触发任务
      const result = await triggerNanoBananaAction({
        prompt: prompt || "A beautiful sunset",
      });
      setRunId(result.runId);
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

  const isLoading = isSubmitting || (run && !run.finishedAt);

  return (
    <div className="w-full max-w-md space-y-4">
      <form className="flex gap-2" onSubmit={handleSubmit}>
        <Input
          disabled={isLoading}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter a prompt..."
          type="text"
          value={prompt}
        />
        <Button disabled={isLoading} type="submit">
          {isLoading ? "Generating..." : "Generate Image"}
        </Button>
      </form>

      {(error || submitError) && (
        <div className="rounded-lg bg-red-100 p-4 text-red-800 dark:bg-red-900 dark:text-red-100">
          <p className="font-medium">Error</p>
          <p className="text-sm">{error?.message || submitError}</p>
        </div>
      )}

      {run && (
        <div className="space-y-3 rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <span className="font-medium">Task Status</span>
            <StatusBadge status={run.status} />
          </div>

          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Run ID</span>
              <span className="font-mono text-xs">{run.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Created</span>
              <span>{new Date(run.createdAt).toLocaleTimeString()}</span>
            </div>
            {run.finishedAt && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Finished</span>
                <span>{new Date(run.finishedAt).toLocaleTimeString()}</span>
              </div>
            )}
          </div>

          {run.output && (
            <div className="space-y-2 rounded-md bg-green-50 p-3 dark:bg-green-950">
              <p className="font-medium text-green-800 text-sm dark:text-green-200">
                Output
              </p>
              {(() => {
                const output = run.output as NanoBananaRunResult;
                if (isSuccessResult(output) && output.result.data.images) {
                  return (
                    <div className="space-y-2">
                      {output.result.data.images.map((img, i) => (
                        <img
                          alt={`Generated ${i + 1}`}
                          className="max-w-full rounded-md"
                          key={img.url}
                          src={img.url}
                        />
                      ))}
                    </div>
                  );
                }
                if (isFailedResult(output)) {
                  return (
                    <p className="text-red-600 text-sm">
                      Error: {output.error}
                    </p>
                  );
                }
                return null;
              })()}
              <pre className="mt-2 overflow-auto font-mono text-green-700 text-xs dark:text-green-300">
                {JSON.stringify(run.output, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}

      <div className="rounded-md border border-gray-200 p-4 text-sm dark:border-gray-700">
        <h2 className="mb-2 font-medium">Test Details</h2>
        <ul className="space-y-1 text-muted-foreground">
          <li>Endpoint: fal-ai/nano-banana</li>
          <li>Model: Nano Banana (fast text-to-image)</li>
          <li>Using: triggerNanoBanana (typed trigger)</li>
        </ul>
      </div>
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
