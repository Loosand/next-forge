"use client";

import {
  AspectRatioSelector,
  type AspectRatioValue,
} from "@repo/design-system/components/ui/aspect-ratio-selector";
import { Button } from "@repo/design-system/components/ui/button";
import { CountSelector } from "@repo/design-system/components/ui/count-selector";
import { cn } from "@repo/design-system/lib/utils";
import type { FalModelId } from "@repo/fal/types";
import { Loader2, Plus } from "lucide-react";
import { useState } from "react";
import { DEFAULT_MODEL_ID } from "../_constants/models";
import { ModelSelector } from "./model-selector";

export type GenerationParams = {
  prompt: string;
  modelId: FalModelId;
  aspectRatio: string;
  count: number;
};

export const GenerationForm = ({
  isSubmitting,
  onSubmit,
}: {
  isSubmitting: boolean;
  onSubmit: (params: GenerationParams) => void;
}) => {
  const [prompt, setPrompt] = useState("");
  const [modelId, setModelId] = useState(DEFAULT_MODEL_ID);
  const [aspectRatio, setAspectRatio] = useState<AspectRatioValue>("1:1");
  const [count, setCount] = useState(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim() || isSubmitting) return;
    onSubmit({
      prompt: prompt.trim(),
      modelId,
      aspectRatio,
      count,
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
            <ModelSelector onChange={setModelId} value={modelId} />
            <AspectRatioSelector
              onChange={setAspectRatio}
              value={aspectRatio}
            />
            <CountSelector count={count} onCountChange={setCount} />
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
                {count}
              </span>
            </>
          )}
        </Button>
      </form>
    </div>
  );
};
