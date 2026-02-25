"use client";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@repo/design-system/components/ui/popover";
import { cn } from "@repo/design-system/lib/utils";
import { Check } from "lucide-react";
import { useState } from "react";
import type { SelectParam } from "../_constants/models";

export function ExtraParamControl({
  param,
  value,
  onChange,
}: {
  param: SelectParam;
  value: string;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const selected = param.options.find((o) => o.value === value);

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger>
        <button
          className={cn(
            "flex items-center gap-2 rounded-xl px-3 py-2",
            "bg-secondary text-foreground",
            "font-medium text-sm",
            "transition hover:bg-secondary/80 active:opacity-60"
          )}
          type="button"
        >
          <span>{param.label}:</span>
          <span>{selected?.label ?? value}</span>
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-48 p-1" sideOffset={8}>
        <p className="px-2 py-1.5 font-medium text-muted-foreground text-xs">
          {param.label}
        </p>
        {param.options.map((option) => (
          <button
            key={option.value}
            className={cn(
              "flex w-full items-center gap-2 rounded-lg px-2 py-1.5",
              "text-sm transition",
              value === option.value
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
            )}
            onClick={() => {
              onChange(option.value);
              setOpen(false);
            }}
            type="button"
          >
            <span className="flex-1 text-left">{option.label}</span>
            {value === option.value && <Check className="size-4 shrink-0" />}
          </button>
        ))}
      </PopoverContent>
    </Popover>
  );
}
