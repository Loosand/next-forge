"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@repo/design-system/components/ui/dialog";
import { useState } from "react";
import type { AssetItem } from "./page";

export function AssetGrid({ assets }: { assets: AssetItem[] }) {
  const [selected, setSelected] = useState<AssetItem | null>(null);

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {assets.map((a) => (
          <button
            className="cursor-pointer space-y-2 rounded-lg border p-3 text-left transition-colors hover:bg-muted/30"
            key={a.id}
            onClick={() => setSelected(a)}
            type="button"
          >
            {a.mediaType === "image" && (
              <img alt={a.id} className="w-full rounded-md" src={a.url} />
            )}
            {a.mediaType === "video" && (
              <video className="w-full rounded-md" muted src={a.url} />
            )}
            {a.mediaType === "audio" && (
              <audio className="w-full" controls muted src={a.url} />
            )}
            <div className="space-y-1 text-xs">
              <span className="rounded bg-muted px-1.5 py-0.5 font-medium">
                {a.mediaType}
              </span>
              {a.width && a.height && (
                <p className="text-muted-foreground">
                  {a.width}x{a.height}
                </p>
              )}
              <p className="text-muted-foreground">{a.createdAt}</p>
            </div>
          </button>
        ))}
      </div>

      <Dialog onOpenChange={() => setSelected(null)} open={!!selected}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Asset Detail</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-4">
              {selected.mediaType === "image" && (
                <img
                  alt={selected.id}
                  className="w-full rounded-md"
                  src={selected.url}
                />
              )}
              {selected.mediaType === "video" && (
                <video
                  className="w-full rounded-md"
                  controls
                  muted
                  src={selected.url}
                />
              )}
              {selected.mediaType === "audio" && (
                <audio className="w-full" controls muted src={selected.url} />
              )}

              <div className="grid grid-cols-[100px_1fr] gap-x-4 gap-y-2 text-sm">
                {selected.prompt && (
                  <>
                    <span className="text-muted-foreground">Prompt</span>
                    <span>{selected.prompt}</span>
                  </>
                )}
                {selected.model && (
                  <>
                    <span className="text-muted-foreground">Model</span>
                    <span className="font-mono text-xs">{selected.model}</span>
                  </>
                )}
                {selected.width && selected.height && (
                  <>
                    <span className="text-muted-foreground">Size</span>
                    <span>
                      {selected.width}x{selected.height}
                    </span>
                  </>
                )}
                {selected.duration && (
                  <>
                    <span className="text-muted-foreground">Duration</span>
                    <span>{selected.duration}s</span>
                  </>
                )}
                <span className="text-muted-foreground">Created</span>
                <span>{selected.createdAt}</span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
