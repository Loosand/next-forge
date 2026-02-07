"use client";

import { Minus, Plus } from "lucide-react";

export function CountSelector({
  count,
  max = 4,
  onCountChange,
}: {
  count: number;
  max?: number;
  onCountChange: (count: number) => void;
}) {
  return (
    <div className="flex items-center gap-1 rounded-xl bg-secondary px-1 py-1">
      <button
        className="rounded-lg p-1.5 text-muted-foreground transition hover:bg-background hover:text-foreground"
        onClick={() => onCountChange(Math.max(1, count - 1))}
        type="button"
      >
        <Minus className="size-4" />
      </button>
      <span className="min-w-8 text-center font-medium text-sm">
        {count}/{max}
      </span>
      <button
        className="rounded-lg p-1.5 text-muted-foreground transition hover:bg-background hover:text-foreground"
        onClick={() => onCountChange(Math.min(max, count + 1))}
        type="button"
      >
        <Plus className="size-4" />
      </button>
    </div>
  );
}
