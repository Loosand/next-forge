/** biome-ignore-all lint/suspicious/noArrayIndexKey: <> */
"use client";

import { cn } from "@repo/design-system/lib/utils";
import type { falRunTask } from "@repo/trigger";
import { useRealtimeRun } from "@trigger.dev/react-hooks";
import { Loader2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import useSWR from "swr";
import { IMAGE_MODELS } from "../_constants/models";
import {
  generateImage,
  type getGenerationHistory,
  getTaskWithAssets,
} from "../actions";
import { AssetDetailDialog } from "./asset-detail-dialog";
import { EmptyState } from "./empty-state";
import { GenerationForm, type GenerationParams } from "./generation-form";
import type { AssetWithMeta } from "./types";

type HistoryItem = Awaited<ReturnType<typeof getGenerationHistory>>[number];
type TaskWithAssets = NonNullable<
  Awaited<ReturnType<typeof getTaskWithAssets>>
>;

const tokenFetcher = (url: string) =>
  fetch(url, { method: "POST" }).then((res) => res.json());

function getModelName(modelId: string | null): string {
  if (!modelId) return "Unknown";
  return IMAGE_MODELS.find((m) => m.id === modelId)?.name ?? modelId;
}

/** 把 "4:3" 解析成 [4, 3]，解析失败回退 [1, 1] */
function parseRatio(ratio: string): [number, number] {
  const parts = ratio.split(":").map(Number);
  if (parts.length === 2 && parts[0] > 0 && parts[1] > 0) {
    return [parts[0], parts[1]];
  }
  return [1, 1];
}

type Phase = "idle" | "submitting" | "generating";

function SkeletonCard({ ratio }: { ratio: string }) {
  const [w, h] = parseRatio(ratio);

  return (
    <div
      className={cn(
        "mb-3 break-inside-avoid overflow-hidden rounded-xl border bg-muted"
      )}
      style={{ aspectRatio: `${w} / ${h}` }}
    >
      <div className="flex h-full w-full items-center justify-center">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
      </div>
    </div>
  );
}

function AssetCard({
  asset,
  onClick,
}: {
  asset: AssetWithMeta;
  onClick: () => void;
}) {
  return (
    <button
      className="mb-3 block w-full break-inside-avoid overflow-hidden rounded-xl border text-left transition hover:ring-2 hover:ring-primary/50"
      onClick={onClick}
      type="button"
    >
      {asset.mediaType === "image" && (
        <img
          alt="Generated"
          className="h-auto w-full object-cover"
          src={asset.url}
        />
      )}
      {asset.mediaType === "video" && (
        <video className="h-auto w-full" muted src={asset.url} />
      )}
    </button>
  );
}

const masonryClass = "columns-2 gap-3 sm:columns-3 md:columns-4";

export function ImageGenerator({ history }: { history: HistoryItem[] }) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [runId, setRunId] = useState<string | null>(null);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pendingCount, setPendingCount] = useState(0);
  const [pendingRatio, setPendingRatio] = useState("1:1");
  const [lastParams, setLastParams] = useState<GenerationParams | null>(null);

  const [completedAssets, setCompletedAssets] = useState<AssetWithMeta[]>([]);
  const [selectedAsset, setSelectedAsset] = useState<AssetWithMeta | null>(
    null
  );

  const doneRef = useRef(false);

  const { data: tokenData } = useSWR<{ token: string; error?: string }>(
    "/api/trigger/token",
    tokenFetcher,
    { revalidateOnFocus: false, revalidateOnReconnect: false }
  );

  const accessToken = tokenData?.token;

  const { run } = useRealtimeRun<typeof falRunTask>(runId ?? undefined, {
    accessToken: accessToken ?? "",
    enabled: !!accessToken && !!runId,
  });

  const { data: taskData } = useSWR<TaskWithAssets | null>(
    taskId && run?.finishedAt ? `task-${taskId}` : null,
    () => getTaskWithAssets(taskId!)
  );

  useEffect(() => {
    if (taskData && phase === "generating" && !doneRef.current) {
      doneRef.current = true;

      if (taskData.status === "completed" && taskData.assets.length > 0) {
        setCompletedAssets((prev) => [
          ...taskData.assets.map((a) => ({
            id: a.id,
            mediaType: a.mediaType,
            url: a.url,
            prompt: lastParams?.input?.prompt ?? null,
            model: lastParams ? getModelName(lastParams.modelId) : null,
            createdAt: new Date().toISOString(),
          })),
          ...prev,
        ]);
      } else if (taskData.status === "failed") {
        setError(
          (taskData.response as { error?: string })?.error ??
            "Generation failed"
        );
      }

      setPhase("idle");
    }
  }, [taskData, phase, lastParams]);

  const handleSubmit = useCallback(
    async (params: GenerationParams) => {
      if (!accessToken) return;

      doneRef.current = false;
      setPhase("submitting");
      setError(null);
      setRunId(null);
      setTaskId(null);
      setPendingCount(params.input.count ?? 1);
      setPendingRatio(params.input.aspectRatio);
      setLastParams(params);

      try {
        const result = await generateImage({
          endpointId: params.modelId,
          input: params.input,
        });
        setRunId(result.runId);
        setTaskId(result.taskId);
        setPhase("generating");
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
        setPhase("idle");
      }
    },
    [accessToken]
  );

  const showEmpty =
    phase === "idle" && completedAssets.length === 0 && history.length === 0;

  // Dedup: exclude history assets already in completedAssets
  const completedIds = new Set(completedAssets.map((a) => a.id));
  const historyAssets: AssetWithMeta[] = history.flatMap((item) =>
    item.assets
      .filter((a) => !completedIds.has(a.id))
      .map((a) => ({
        id: a.id,
        mediaType: a.mediaType,
        url: a.url,
        prompt: item.prompt,
        model: getModelName(item.model),
        createdAt: item.createdAt,
      }))
  );

  const hasContent =
    phase === "generating" ||
    completedAssets.length > 0 ||
    historyAssets.length > 0;

  return (
    <>
      {/* Content area */}
      <div className="flex-1 overflow-y-auto p-4">
        {showEmpty && <EmptyState />}

        {/* Error */}
        {error && (
          <div className="mx-auto mb-4 max-w-4xl rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-2 text-destructive text-sm">
            {error}
          </div>
        )}

        {/* Unified masonry grid */}
        {hasContent && (
          <div className={masonryClass}>
            {/* Skeletons for current generation */}
            {phase === "generating" &&
              Array.from({ length: pendingCount }, (_, i) => (
                <SkeletonCard key={`skeleton-${i}`} ratio={pendingRatio} />
              ))}

            {/* Accumulated completed results */}
            {completedAssets.map((a) => (
              <AssetCard
                asset={a}
                key={a.id}
                onClick={() => setSelectedAsset(a)}
              />
            ))}

            {/* History */}
            {historyAssets.map((a) => (
              <AssetCard
                asset={a}
                key={a.id}
                onClick={() => setSelectedAsset(a)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Form */}
      <GenerationForm
        isSubmitting={phase === "submitting"}
        onSubmit={handleSubmit}
      />

      {/* Detail dialog */}
      {selectedAsset && (
        <AssetDetailDialog
          asset={selectedAsset}
          onOpenChange={(open) => {
            if (!open) setSelectedAsset(null);
          }}
          open={!!selectedAsset}
        />
      )}
    </>
  );
}
