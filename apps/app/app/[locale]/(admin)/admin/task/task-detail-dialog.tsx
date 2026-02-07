/** biome-ignore-all lint/a11y/useMediaCaption: <explanation> */
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@repo/design-system/components/ui/dialog";
import { useState } from "react";
import type { TaskItem } from "./page";

const statusStyle: Record<string, string> = {
  pending: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  completed:
    "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  failed: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
};

export function TaskTable({ tasks }: { tasks: TaskItem[] }) {
  const [selected, setSelected] = useState<TaskItem | null>(null);

  return (
    <>
      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-muted/50">
            <tr>
              <th className="px-4 py-3 font-medium">ID</th>
              <th className="px-4 py-3 font-medium">Model</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Assets</th>
              <th className="px-4 py-3 font-medium">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {tasks.map((t) => (
              <tr
                className="cursor-pointer hover:bg-muted/30"
                key={t.id}
                onClick={() => setSelected(t)}
              >
                <td className="px-4 py-3 font-mono text-blue-600 text-xs dark:text-blue-400">
                  {t.id.slice(0, 8)}
                </td>
                <td className="px-4 py-3 font-mono text-xs">
                  {t.model ?? "-"}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-1 font-medium text-xs ${statusStyle[t.status] ?? statusStyle.pending}`}
                  >
                    {t.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">{t.assetsCount}</td>
                <td className="px-4 py-3 text-muted-foreground text-xs">
                  {t.createdAt}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog onOpenChange={() => setSelected(null)} open={!!selected}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-5xl">
          <DialogHeader>
            <DialogTitle>Task Detail</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4">
              <div className="grid grid-cols-[120px_1fr] gap-x-4 gap-y-2 text-sm">
                <span className="text-muted-foreground">ID</span>
                <span className="font-mono text-xs">{selected.id}</span>

                <span className="text-muted-foreground">Status</span>
                <span>
                  <span
                    className={`rounded-full px-2 py-1 font-medium text-xs ${statusStyle[selected.status] ?? statusStyle.pending}`}
                  >
                    {selected.status}
                  </span>
                </span>

                <span className="text-muted-foreground">Model</span>
                <span className="font-mono text-xs">
                  {selected.model ?? "-"}
                </span>

                {selected.prompt && (
                  <>
                    <span className="text-muted-foreground">Prompt</span>
                    <span>{selected.prompt}</span>
                  </>
                )}

                <span className="text-muted-foreground">Trigger Run</span>
                <span className="font-mono text-xs">
                  {selected.triggerRunId ?? "-"}
                </span>

                <span className="text-muted-foreground">Created</span>
                <span>{selected.createdAt}</span>

                <span className="text-muted-foreground">Updated</span>
                <span>{selected.updatedAt}</span>
              </div>

              {/* Assets */}
              {selected.assets.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-semibold text-sm">
                    Assets ({selected.assets.length})
                  </h3>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {selected.assets.map((a) => (
                      <div
                        className="space-y-1 rounded-lg border p-2"
                        key={a.id}
                      >
                        {a.mediaType === "image" && (
                          <img
                            alt={a.id}
                            className="w-full rounded-md"
                            src={a.url}
                          />
                        )}
                        {a.mediaType === "video" && (
                          <video
                            className="w-full rounded-md"
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

              {/* Response */}
              {selected.response && (
                <div className="space-y-2">
                  <h3 className="font-semibold text-sm">Response</h3>
                  <pre className="max-h-60 overflow-auto rounded-lg bg-muted p-3 text-xs">
                    {selected.response}
                  </pre>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
