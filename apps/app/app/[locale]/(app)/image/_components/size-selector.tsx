"use client";

import { RatioIcon } from "@repo/design-system/components/icons";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@repo/design-system/components/ui/popover";
import { cn } from "@repo/design-system/lib/utils";
import { Check } from "lucide-react";
import { useState } from "react";
import type { SizeScheme } from "../_constants/models";

export function SizeSelector({
  scheme,
  value,
  onChange,
}: {
  scheme: SizeScheme;
  value: string;
  onChange: (value: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ratios = Object.keys(scheme.ratioMap);

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
          <RatioIcon ratio={value} />
          <span>{value}</span>
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-48 p-1" sideOffset={8}>
        <p className="px-2 py-1.5 font-medium text-muted-foreground text-xs">
          Aspect ratio
        </p>
        {ratios.map((ratio) => (
          <button
            className={cn(
              "flex w-full items-center gap-2 rounded-lg px-2 py-1.5",
              "text-sm transition",
              value === ratio
                ? "bg-accent text-accent-foreground"
                : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
            )}
            key={ratio}
            onClick={() => {
              onChange(ratio);
              setOpen(false);
            }}
            type="button"
          >
            <span className="flex size-8 shrink-0 items-center justify-center rounded-md">
              <RatioIcon ratio={ratio} />
            </span>
            <span className="flex-1 text-left">{ratio}</span>
            {value === ratio && <Check className="size-4 shrink-0" />}
          </button>
        ))}
      </PopoverContent>
    </Popover>
  );
}
