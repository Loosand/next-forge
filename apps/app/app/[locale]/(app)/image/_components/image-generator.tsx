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

const ASPECT_RATIO_TO_SIZE: Record<string, string> = {
  "1:1": "square_hd",
  "4:3": "landscape_4_3",
  "3:4": "portrait_4_3",
  "16:9": "landscape_16_9",
  "9:16": "portrait_16_9",
};

const tokenFetcher = (url: string) =>
  fetch(url, { method: "POST" }).then((res) => res.json());

function getModelName(modelId: string | null): string {
  if (!modelId) return "Unknown";
  return IMAGE_MODELS.find((m) => m.id === modelId)?.name ?? modelId;
}

type Phase = "idle" | "submitting" | "generating" | "done";

function SkeletonCard({ ratio }: { ratio: string }) {
  const aspectClass: Record<string, string> = {
    "1:1": "aspect-square",
    "4:3": "aspect-[4/3]",
    "3:4": "aspect-[3/4]",
    "16:9": "aspect-video",
    "9:16": "aspect-[9/16]",
  };

  return (
    <div
      className={cn(
        "mb-3 break-inside-avoid overflow-hidden rounded-xl border bg-muted",
        aspectClass[ratio] ?? "aspect-square"
      )}
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
      setPhase("done");
    }
  }, [taskData, phase]);

  const handleSubmit = useCallback(
    async (params: GenerationParams) => {
      if (!accessToken) return;

      doneRef.current = false;
      setPhase("submitting");
      setError(null);
      setRunId(null);
      setTaskId(null);
      setPendingCount(params.count);
      setPendingRatio(params.aspectRatio);
      setLastParams(params);

      try {
        const result = await generateImage({
          endpointId: params.modelId,
          prompt: params.prompt,
          aspectRatio: ASPECT_RATIO_TO_SIZE[params.aspectRatio],
          numImages: params.count,
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

  const hasResults =
    phase === "done" &&
    taskData?.status === "completed" &&
    taskData.assets.length > 0;
  const hasFailed = phase === "done" && taskData?.status === "failed";
  const showHistory =
    (phase === "idle" || phase === "submitting") && history.length > 0;
  const showEmpty =
    (phase === "idle" || phase === "submitting") && history.length === 0;

  // Enrich current generation assets with metadata
  const currentAssets: AssetWithMeta[] = hasResults
    ? taskData.assets.map((a) => ({
        id: a.id,
        mediaType: a.mediaType,
        url: a.url,
        prompt: lastParams?.prompt ?? null,
        model: lastParams ? getModelName(lastParams.modelId) : null,
        createdAt: new Date().toISOString(),
      }))
    : [];

  // Enrich history assets with task-level metadata
  const historyAssets: AssetWithMeta[] = history.flatMap((item) =>
    item.assets.map((a) => ({
      id: a.id,
      mediaType: a.mediaType,
      url: a.url,
      prompt: item.prompt,
      model: getModelName(item.model),
      createdAt: item.createdAt,
    }))
  );

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

        {/* Failed */}
        {hasFailed && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-2 text-destructive text-sm">
            {(taskData.response as { error?: string })?.error ??
              "Generation failed"}
          </div>
        )}

        {/* Skeletons */}
        {phase === "generating" && (
          <div>
            <div className={masonryClass}>
              {Array.from({ length: pendingCount }, (_, i) => (
                <SkeletonCard key={i} ratio={pendingRatio} />
              ))}
            </div>
          </div>
        )}

        {/* Current generation results */}
        {hasResults && (
          <div className="mx-auto">
            <div className={masonryClass}>
              {currentAssets.map((a) => (
                <AssetCard
                  asset={a}
                  key={a.id}
                  onClick={() => setSelectedAsset(a)}
                />
              ))}
            </div>
          </div>
        )}

        {/* History */}
        {showHistory && (
          <div>
            <div className={masonryClass}>
              {historyAssets.map((a) => (
                <AssetCard
                  asset={a}
                  key={a.id}
                  onClick={() => setSelectedAsset(a)}
                />
              ))}
            </div>
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
