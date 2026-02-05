"use client";

import { Button } from "@repo/design-system/components/ui/button";
import { cn } from "@repo/design-system/lib/utils";
import {
  ChevronRight,
  Minus,
  Pencil,
  Plus,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { useState } from "react";

const ModelSelector = () => (
  <button
    className={cn(
      "flex items-center gap-2 rounded-xl px-3 py-2",
      "bg-primary/10 text-primary",
      "font-medium text-sm",
      "transition hover:bg-primary/20 active:opacity-60"
    )}
    type="button"
  >
    <Sparkles className="size-4" />
    <span>Nano Banana</span>
    <ChevronRight className="size-4" />
  </button>
);

const CountSelector = ({
  count,
  onCountChange,
}: {
  count: number;
  onCountChange: (count: number) => void;
}) => (
  <div className="flex items-center gap-1 rounded-xl bg-secondary px-1 py-1">
    <button
      className="rounded-lg p-1.5 text-muted-foreground transition hover:bg-background hover:text-foreground"
      onClick={() => onCountChange(Math.max(1, count - 1))}
      type="button"
    >
      <Minus className="size-4" />
    </button>
    <span className="min-w-8 text-center font-medium text-sm">{count}/4</span>
    <button
      className="rounded-lg p-1.5 text-muted-foreground transition hover:bg-background hover:text-foreground"
      onClick={() => onCountChange(Math.min(4, count + 1))}
      type="button"
    >
      <Plus className="size-4" />
    </button>
  </div>
);

const ToggleButton = ({
  icon: Icon,
  label,
  isActive,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  isActive: boolean;
  onClick: () => void;
}) => (
  <button
    className={cn(
      "flex items-center gap-2 rounded-xl px-3 py-2",
      "font-medium text-sm",
      "transition active:opacity-60",
      isActive
        ? "bg-foreground text-background"
        : "bg-secondary text-muted-foreground hover:text-foreground"
    )}
    onClick={onClick}
    type="button"
  >
    <Icon className="size-4" />
    <span>{label}</span>
  </button>
);

export const GenerationForm = () => {
  const [prompt, setPrompt] = useState("");
  const [count, setCount] = useState(1);
  const [autoMode, setAutoMode] = useState(true);
  const [drawMode, setDrawMode] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log({ prompt, count, autoMode, drawMode });
  };

  return (
    <div className="sticky bottom-0 w-full p-4">
      <form
        className={cn(
          "mx-auto max-w-4xl",
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
            <ModelSelector />
            <CountSelector count={count} onCountChange={setCount} />
            <ToggleButton
              icon={RefreshCw}
              isActive={autoMode}
              label="Auto"
              onClick={() => setAutoMode(!autoMode)}
            />
            <ToggleButton
              icon={Pencil}
              isActive={drawMode}
              label="Draw"
              onClick={() => setDrawMode(!drawMode)}
            />
          </div>
        </div>

        <Button className="h-[80%] gap-2 px-6" type="submit">
          Generate
          <span className="flex items-center gap-0.5 text-xs opacity-80">
            <Plus className="size-3" />1
          </span>
        </Button>
      </form>
    </div>
  );
};
