"use client";

import { Button } from "@repo/design-system/components/ui/button";
import { Input } from "@repo/design-system/components/ui/input";
import type { helloWorldTask } from "@repo/trigger";
import { useRealtimeTaskTrigger } from "@trigger.dev/react-hooks";
import { useState } from "react";
import useSWR from "swr";

const fetcher = (url: string) =>
  fetch(url, { method: "POST" }).then((res) => res.json());

export function TriggerForm() {
  const [name, setName] = useState("");

  // 使用 SWR 获取 access token
  const {
    data: tokenData,
    error: tokenError,
    isLoading: tokenLoading,
  } = useSWR<{ token: string; error?: string }>("/api/trigger/token", fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  const accessToken = tokenData?.token;

  const { submit, run, error, isLoading } = useRealtimeTaskTrigger<
    typeof helloWorldTask
  >("hello-world", {
    accessToken: accessToken ?? "",
    enabled: !!accessToken,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessToken) return;

    await submit({ name: name || "World" });
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

  return (
    <div className="w-full max-w-md space-y-4">
      <form className="flex gap-2" onSubmit={handleSubmit}>
        <Input
          disabled={isLoading}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter a name..."
          type="text"
          value={name}
        />
        <Button disabled={isLoading} type="submit">
          {isLoading ? "Running..." : "Trigger Task"}
        </Button>
      </form>

      {error && (
        <div className="rounded-lg bg-red-100 p-4 text-red-800 dark:bg-red-900 dark:text-red-100">
          <p className="font-medium">Error</p>
          <p className="text-sm">{error.message}</p>
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
              <span className="font-mono">{run.id}</span>
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
            <div className="rounded-md bg-green-50 p-3 dark:bg-green-950">
              <p className="font-medium text-green-800 text-sm dark:text-green-200">
                Output
              </p>
              <p className="mt-1 font-mono text-green-700 text-sm dark:text-green-300">
                {JSON.stringify(run.output, null, 2)}
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
