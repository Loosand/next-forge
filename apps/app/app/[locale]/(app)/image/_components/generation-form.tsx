"use client";

import { Button } from "@repo/design-system/components/ui/button";
import { CountSelector } from "@repo/design-system/components/ui/count-selector";
import { cn } from "@repo/design-system/lib/utils";
import type { FalModelId } from "@repo/fal/types";
import { Loader2, Plus } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { DEFAULT_MODEL_ID, IMAGE_MODELS } from "../_constants/models";
import { ExtraParamControl } from "./extra-param-control";
import { ModelSelector } from "./model-selector";
import { SizeSelector } from "./size-selector";

export type GenerationParams = {
  modelId: FalModelId;
  input: {
    prompt: string;
    aspectRatio: string; // 统一的比例字符串，如 "1:1"、"4:3"
    count?: number;
    [key: string]: unknown;
  };
};

function getModelParams(modelId: FalModelId) {
  return IMAGE_MODELS.find((m) => m.id === modelId)?.params;
}

function getDefaultExtras(
  extras?: { field: string; default: string }[]
): Record<string, string> {
  if (!extras) return {};
  const result: Record<string, string> = {};
  for (const e of extras) {
    result[e.field] = e.default;
  }
  return result;
}

export const GenerationForm = ({
  isSubmitting,
  onSubmit,
}: {
  isSubmitting: boolean;
  onSubmit: (params: GenerationParams) => void;
}) => {
  const [prompt, setPrompt] = useState("");
  const [modelId, setModelId] = useState(DEFAULT_MODEL_ID);

  const params = useMemo(() => getModelParams(modelId), [modelId]);

  const [aspectRatio, setAspectRatio] = useState(params?.size.default ?? "1:1");
  const [count, setCount] = useState(1);
  const [extras, setExtras] = useState<Record<string, string>>(
    getDefaultExtras(params?.extras)
  );

  // 切换模型时重置所有参数到新模型的默认值
  const handleModelChange = useCallback((newModelId: FalModelId) => {
    setModelId(newModelId);
    const newParams = getModelParams(newModelId);
    if (newParams) {
      setAspectRatio(newParams.size.default);
      setCount(1);
      setExtras(getDefaultExtras(newParams.extras));
    }
  }, []);

  const handleExtraChange = useCallback((field: string, value: string) => {
    setExtras((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isSubmitting) return;
    onSubmit({
      modelId,
      input: {
        prompt: prompt.trim(),
        aspectRatio,
        ...(params?.count ? { count } : {}),
        ...extras,
      },
    });
  };

  return (
    <div className="fixed inset-x-0 bottom-4 mx-auto w-full max-w-4xl">
      <form
        className={cn(
          "rounded-2xl border border-border/50 bg-card p-3",
          "shadow-background/50 shadow-lg",
          "flex h-full items-center justify-between"
        )}
        onSubmit={handleSubmit}
      >
        <div className="">
          {/* Input row */}
          <div className="flex items-center gap-2">
            <button
              className={cn(
                "shrink-0 rounded-xl p-2.5",
                "border border-border/50 bg-secondary",
                "text-muted-foreground",
                "transition hover:bg-muted hover:text-foreground"
              )}
              type="button"
            >
              <Plus className="size-5" />
            </button>

            <input
              className={cn(
                "flex-1 bg-transparent px-2 py-2",
                "text-foreground placeholder:text-muted-foreground",
                "outline-none"
              )}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the scene you imagine"
              type="text"
              value={prompt}
            />
          </div>

          {/* Options row */}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <ModelSelector onChange={handleModelChange} value={modelId} />
            {params && (
              <SizeSelector
                onChange={setAspectRatio}
                scheme={params.size}
                value={aspectRatio}
              />
            )}
            {params?.count && (
              <CountSelector
                count={count}
                max={params.count.max}
                onCountChange={setCount}
              />
            )}
            {params?.extras?.map((extra) => (
              <ExtraParamControl
                key={extra.field}
                onChange={(v) => handleExtraChange(extra.field, v)}
                param={extra}
                value={extras[extra.field] ?? extra.default}
              />
            ))}
          </div>
        </div>

        <Button
          className="h-20 w-30 cursor-pointer gap-2 font-semibold"
          disabled={isSubmitting || !prompt.trim()}
          type="submit"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Generate
            </>
          ) : (
            <>
              Generate
              <span className="flex items-center gap-0.5 opacity-80">
                {params?.count ? count : 1}
              </span>
            </>
          )}
        </Button>
      </form>
    </div>
  );
};
