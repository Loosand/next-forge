"use client";

import { Check } from "lucide-react";
import { useState } from "react";
import { cn } from "../../lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

export type AspectRatioValue = "1:1" | "4:3" | "3:4" | "16:9" | "9:16";

const RATIOS: { value: AspectRatioValue; icon: React.ReactNode }[] = [
  {
    value: "1:1",
    icon: (
      <svg viewBox="0 0 16 16" fill="none" className="size-5">
        <path
          d="M10.5 3C11.8807 3 13 4.11929 13 5.5V10.5C13 11.8807 11.8807 13 10.5 13H5.5C4.11929 13 3 11.8807 3 10.5V5.5C3 4.11929 4.11929 3 5.5 3H10.5ZM5.5 4C4.67157 4 4 4.67157 4 5.5V10.5C4 11.3284 4.67157 12 5.5 12H10.5C11.3284 12 12 11.3284 12 10.5V5.5C12 4.67157 11.3284 4 10.5 4H5.5Z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    value: "4:3",
    icon: (
      <svg viewBox="0 0 16 16" fill="none" className="size-5">
        <path
          d="M12.5 3C13.8807 3 15 4.11929 15 5.5V11.5C15 12.8807 13.8807 14 12.5 14H3.5C2.11929 14 1 12.8807 1 11.5V5.5C1 4.11929 2.11929 3 3.5 3H12.5ZM3.5 4C2.67157 4 2 4.67157 2 5.5V11.5C2 12.3284 2.67157 13 3.5 13H12.5C13.3284 13 14 12.3284 14 11.5V5.5C14 4.67157 13.3284 4 12.5 4H3.5Z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    value: "3:4",
    icon: (
      <svg viewBox="0 0 16 16" fill="none" className="size-5">
        <path
          d="M13 12.5C13 13.8807 11.8807 15 10.5 15L4.5 15C3.11929 15 2 13.8807 2 12.5L2 3.5C2 2.11929 3.11929 1 4.5 1L10.5 1C11.8807 1 13 2.11929 13 3.5L13 12.5ZM12 3.5C12 2.67157 11.3284 2 10.5 2L4.5 2C3.67157 2 3 2.67157 3 3.5L3 12.5C3 13.3284 3.67157 14 4.5 14L10.5 14C11.3284 14 12 13.3284 12 12.5L12 3.5Z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    value: "16:9",
    icon: (
      <svg viewBox="0 0 16 16" fill="none" className="size-5">
        <path
          d="M13.833 3.5C14.8454 3.5 15.6658 4.32064 15.666 5.33301V10.667C15.6658 11.6794 14.8454 12.5 13.833 12.5H3.16602C2.1539 12.4996 1.33318 11.6791 1.33301 10.667V5.33301C1.33318 4.32085 2.1539 3.50035 3.16602 3.5H13.833ZM3.16602 4.5C2.70619 4.50035 2.33318 4.87314 2.33301 5.33301V10.667C2.33318 11.1269 2.70619 11.4996 3.16602 11.5H13.833C14.2931 11.5 14.6658 11.1271 14.666 10.667V5.33301C14.6658 4.87292 14.2931 4.5 13.833 4.5H3.16602Z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    value: "9:16",
    icon: (
      <svg viewBox="0 0 16 16" fill="none" className="size-5">
        <path
          d="M13 12.5C13 13.8807 11.8807 15 10.5 15L4.5 15C3.11929 15 2 13.8807 2 12.5L2 3.5C2 2.11929 3.11929 1 4.5 1L10.5 1C11.8807 1 13 2.11929 13 3.5L13 12.5ZM12 3.5C12 2.67157 11.3284 2 10.5 2L4.5 2C3.67157 2 3 2.67157 3 3.5L3 12.5C3 13.3284 3.67157 14 4.5 14L10.5 14C11.3284 14 12 13.3284 12 12.5L12 3.5Z"
          fill="currentColor"
        />
      </svg>
    ),
  },
];

function RatioItem({
  ratio,
  isSelected,
  onSelect,
}: {
  ratio: (typeof RATIOS)[number];
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      className={cn(
        "flex w-full items-center gap-2 rounded-lg px-2 py-1.5",
        "text-sm transition",
        isSelected
          ? "bg-accent text-accent-foreground"
          : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
      )}
      onClick={onSelect}
      type="button"
    >
      <span className="flex size-8 shrink-0 items-center justify-center rounded-md">
        {ratio.icon}
      </span>
      <span className="flex-1 text-left">{ratio.value}</span>
      {isSelected && <Check className="size-4 shrink-0" />}
    </button>
  );
}

export function AspectRatioSelector({
  value,
  onChange,
}: {
  value: AspectRatioValue;
  onChange: (ratio: AspectRatioValue) => void;
}) {
  const [open, setOpen] = useState(false);
  const selected = RATIOS.find((r) => r.value === value);

  return (
    <Popover onOpenChange={setOpen} open={open}>
      <PopoverTrigger >
        <button
          className={cn(
            "flex items-center gap-2 rounded-xl px-3 py-2",
            "bg-secondary text-foreground",
            "font-medium text-sm",
            "transition hover:bg-secondary/80 active:opacity-60"
          )}
          type="button"
        >
          {selected?.icon}
          <span>{value}</span>
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-48 p-1" sideOffset={8}>
        <p className="px-2 py-1.5 font-medium text-muted-foreground text-xs">
          Aspect ratio
        </p>
        {RATIOS.map((ratio) => (
          <RatioItem
            isSelected={value === ratio.value}
            key={ratio.value}
            onSelect={() => {
              onChange(ratio.value);
              setOpen(false);
            }}
            ratio={ratio}
          />
        ))}
      </PopoverContent>
    </Popover>
  );
}
