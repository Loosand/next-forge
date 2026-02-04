"use client";

import { forwardRef, type ComponentPropsWithoutRef } from "react";
import { Button } from "./button";
import { cn } from "@repo/design-system/lib/utils";
import { SparkleIcon } from "../icons/sparkle-icon";

/**
 * [INPUT]: (SparkleButtonProps) - Button props with optional iconPosition control
 * [OUTPUT]: (JSX.Element) - A brand button with sparkle icon and radial gradient effect
 * [POS]: 位于 design-system/components/ui，作为品牌特色的 CTA 按钮组件
 *
 * [PROTOCOL]:
 * 1. 一旦本文件逻辑变更，必须同步更新此 Header
 * 2. 更新后必须检查 design-system 的导出是否正确
 */
export interface SparkleButtonProps
  extends Omit<ComponentPropsWithoutRef<typeof Button>, "variant" | "size"> {
  /** Icon position: start or end (default: end) */
  iconPosition?: "start" | "end";
  /** Hide the sparkle icon */
  hideIcon?: boolean;
}

/**
 * SparkleButton - 品牌特色按钮，带有星光图标和径向渐变效果
 *
 * @example
 * ```tsx
 * <SparkleButton>Explore all tools</SparkleButton>
 * <SparkleButton iconPosition="start">Get Started</SparkleButton>
 * ```
 */
const SparkleButton = forwardRef<HTMLButtonElement, SparkleButtonProps>(
  ({ className, children, iconPosition = "end", hideIcon = false, ...props }, ref) => {
    const icon = !hideIcon && <SparkleIcon />;

    return (
      <Button
        ref={ref}
        className={cn(
          // Base styles
          "h-14 px-6 gap-2 rounded-xl border-none",
          "text-base font-semibold",
          // Colors
          "bg-primary text-primary-foreground",
          // Radial gradient effect
          "bg-[radial-gradient(ellipse_at_center,var(--color-primary-foreground)_0%,transparent_40%)]",
          "bg-blend-soft-light",
          // Inner shadow for 3D depth
          "shadow-[inset_0px_-3px_rgba(0,0,0,0.43)]",
          // Hover & active states
          "hover:opacity-80 active:opacity-60",
          "transition-opacity",
          // Disabled state
          "disabled:bg-muted disabled:text-muted-foreground disabled:shadow-none",
          className
        )}
        {...props}
      >
        {iconPosition === "start" && icon}
        {children}
        {iconPosition === "end" && icon}
      </Button>
    );
  }
);

SparkleButton.displayName = "SparkleButton";

export { SparkleButton, SparkleIcon };
