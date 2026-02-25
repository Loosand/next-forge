"use client";

import { Button } from "@repo/design-system/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from "@repo/design-system/components/ui/dialog";
import { cn } from "@repo/design-system/lib/utils";
import {
  Check,
  Copy,
  Download,
  Info,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { useCallback, useState } from "react";
import type { AssetWithMeta } from "./types";

function SectionHeader({
  icon: Icon,
  label,
  action,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="size-4" />
        <span className="font-medium text-xs uppercase tracking-widest">
          {label}
        </span>
      </div>
      {action}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-t py-3">
      <span className="text-muted-foreground text-sm">{label}</span>
      <span className="font-medium text-sm">{value}</span>
    </div>
  );
}

export function AssetDetailDialog({
  asset,
  open,
  onOpenChange,
}: {
  asset: AssetWithMeta;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    if (!asset.prompt) return;
    navigator.clipboard.writeText(asset.prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [asset.prompt]);

  const handleDownload = useCallback(async () => {
    const response = await fetch(asset.url);
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `generation-${asset.id}.${asset.mediaType === "video" ? "mp4" : "png"}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [asset.id, asset.mediaType, asset.url]);

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent
        className={cn(
          // position & size (override DialogContent defaults)
          "inset-0 top-0 left-0 h-dvh max-w-none sm:max-w-none",
          "translate-x-0 translate-y-0",
          // reset decoration
          "rounded-none bg-transparent p-0 ring-0",
          // layout
          "grid grid-cols-1 gap-0 md:grid-cols-[1fr_23rem]",
          // animation
          "duration-150"
        )}
        showCloseButton={false}
      >
        <DialogTitle className="sr-only">Image Detail</DialogTitle>

        {/* Left: Media — backdrop closes dialog on click */}
        <div
          className="relative flex items-center justify-center overflow-hidden bg-black/60 p-6 md:p-10"
          onClick={(e) => {
            if (e.target === e.currentTarget) onOpenChange(false);
          }}
          onKeyDown={(e) => {
            if (e.key === "Escape") onOpenChange(false);
          }}
          role="button"
          tabIndex={0}
        >
          {asset.mediaType === "image" && (
            <img
              alt="Generated"
              className="max-h-full max-w-full rounded-xl object-contain"
              src={asset.url}
            />
          )}
          {asset.mediaType === "video" && (
            <video
              className="max-h-full max-w-full rounded-lg"
              controls
              muted
              src={asset.url}
            />
          )}
        </div>

        {/* Right: Sidebar */}
        <div className="relative flex flex-col overflow-y-auto border-l bg-background">
          {/* Close button */}
          <DialogClose
            render={
              <Button
                className="absolute top-4 right-4 z-10"
                size="icon-sm"
                variant="ghost"
              />
            }
          >
            <X className="size-4" />
            <span className="sr-only">Close</span>
          </DialogClose>

          <div className="flex flex-1 flex-col gap-6 p-6 pt-14">
            {/* Prompt */}
            {asset.prompt && (
              <div className="space-y-3">
                <SectionHeader
                  action={
                    <Button
                      className="h-7 gap-1.5 px-2.5 text-xs"
                      onClick={handleCopy}
                      variant="outline"
                    >
                      {copied ? (
                        <Check className="size-3" />
                      ) : (
                        <Copy className="size-3" />
                      )}
                      {copied ? "Copied" : "Copy"}
                    </Button>
                  }
                  icon={SlidersHorizontal}
                  label="Prompt"
                />
                <div className="rounded-lg bg-muted/50 p-3">
                  <p className="text-sm leading-relaxed">{asset.prompt}</p>
                </div>
              </div>
            )}

            {/* Information */}
            <div className="space-y-1">
              <SectionHeader icon={Info} label="Information" />
              <div>
                {asset.model && <InfoRow label="Model" value={asset.model} />}
                <InfoRow
                  label="Type"
                  value={asset.mediaType === "video" ? "Video" : "Image"}
                />
                {asset.createdAt && (
                  <InfoRow
                    label="Created"
                    value={new Date(asset.createdAt).toLocaleDateString(
                      undefined,
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      }
                    )}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="border-t p-6">
            <Button
              className="w-full gap-2"
              onClick={handleDownload}
              variant="outline"
            >
              <Download className="size-4" />
              Download
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
