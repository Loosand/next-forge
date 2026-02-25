"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/design-system/components/ui/dropdown-menu";
import { cn } from "@repo/design-system/lib/utils";
import type { FalModelId } from "@repo/fal/types";
import { Check, ChevronDown, Crown, Sparkles } from "lucide-react";
import {
  ALL_MODELS,
  FEATURED_MODELS,
  IMAGE_MODELS,
  type ModelDef,
} from "../_constants/models";

function ModelItem({
  model,
  isSelected,
  onSelect,
}: {
  model: ModelDef;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <DropdownMenuItem
      className="flex items-center gap-3 px-2 py-2"
      onClick={onSelect}
    >
      <div
        className={cn(
          "flex size-8 shrink-0 items-center justify-center rounded-lg",
          isSelected
            ? "bg-primary/15 text-primary"
            : "bg-muted text-muted-foreground"
        )}
      >
        <Sparkles className="size-4" />
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center gap-1.5">
          <span className="truncate font-medium text-sm">{model.name}</span>
          {model.premium && (
            <Crown className="size-3.5 shrink-0 text-amber-500" />
          )}
        </div>
        <span className="truncate text-muted-foreground text-xs">
          {model.description}
        </span>
      </div>
      {isSelected && <Check className="size-4 shrink-0 text-primary" />}
    </DropdownMenuItem>
  );
}

export function ModelSelector({
  value,
  onChange,
}: {
  value: FalModelId;
  onChange: (modelId: FalModelId) => void;
}) {
  const selected = IMAGE_MODELS.find((m) => m.id === value);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
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
          <span>{selected?.name ?? "Select model"}</span>
          <ChevronDown className="size-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-80" sideOffset={8}>
        {FEATURED_MODELS.length > 0 && (
          <DropdownMenuGroup>
            <DropdownMenuLabel>Featured</DropdownMenuLabel>
            {FEATURED_MODELS.map((model) => (
              <ModelItem
                isSelected={value === model.id}
                key={model.id}
                model={model}
                onSelect={() => onChange(model.id)}
              />
            ))}
          </DropdownMenuGroup>
        )}
        {ALL_MODELS.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuLabel>All models</DropdownMenuLabel>
              {ALL_MODELS.map((model) => (
                <ModelItem
                  isSelected={value === model.id}
                  key={model.id}
                  model={model}
                  onSelect={() => onChange(model.id)}
                />
              ))}
            </DropdownMenuGroup>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
