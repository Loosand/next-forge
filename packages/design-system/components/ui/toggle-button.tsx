"use client";

import { cn } from "../../lib/utils";

export function ToggleButton({
  icon: Icon,
  label,
  isActive,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
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
}
