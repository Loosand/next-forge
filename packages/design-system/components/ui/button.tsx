"use client"

import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@repo/design-system/lib/utils"

const buttonVariants = cva(
  cn(
    "inline-flex items-center justify-center",
    "shrink-0 whitespace-nowrap",
    "rounded-xl border bg-clip-padding",
    "text-sm font-semibold",
    "outline-none select-none",
    "transition-all",
    "disabled:pointer-events-none disabled:opacity-50",
    "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
    "aria-invalid:border-destructive aria-invalid:ring-destructive/20 aria-invalid:ring-[3px]",
    "dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
    "group/button"
  ),
  {
    variants: {
      variant: {
        default: cn(
          "bg-primary text-primary-foreground",
          "border-transparent",
          "hover:bg-primary/80"
        ),
        secondary: cn(
          "backdrop-blur-sm",
          "text-primary",
          "bg-primary/5 border-primary/10",
          "hover:bg-primary/10",
          "focus-visible:bg-primary/10",
          "active:bg-primary/15"
        ),
        outline: cn(
          "border-2 border-foreground/10 bg-transparent",
          "text-foreground",
          "hover:border-foreground",
          "active:opacity-60"
        ),
        ghost: cn(
          "border-transparent",
          "hover:bg-muted hover:text-foreground",
          "aria-expanded:bg-muted aria-expanded:text-foreground",
          "dark:hover:bg-muted/50"
        ),
        destructive: cn(
          "text-destructive",
          "bg-destructive/10 border-destructive/10",
          "hover:bg-destructive/20",
          "focus-visible:border-destructive/40 focus-visible:ring-destructive/20",
          "dark:bg-destructive/20 dark:hover:bg-destructive/30 dark:focus-visible:ring-destructive/40"
        ),
        link: cn(
          "border-transparent",
          "text-muted-foreground",
          "hover:text-primary",
          "active:opacity-60",
          "data-[active=true]:text-foreground"
        ),
      },
      size: {
        default: cn(
          "h-9 gap-1.5 px-2.5",
          "in-data-[slot=button-group]:rounded-md",
          "has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2"
        ),
        xs: cn(
          "h-6 gap-1 px-2 text-xs",
          "rounded-[min(var(--radius-md),8px)]",
          "in-data-[slot=button-group]:rounded-md",
          "has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5",
          "[&_svg:not([class*='size-'])]:size-3"
        ),
        sm: cn(
          "h-8 gap-1 px-2.5",
          "rounded-[min(var(--radius-md),10px)]",
          "in-data-[slot=button-group]:rounded-md",
          "has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5"
        ),
        lg: cn(
          "h-10 gap-1.5 px-2.5",
          "has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3"
        ),
        icon: "size-9",
        "icon-xs": cn(
          "size-6",
          "rounded-[min(var(--radius-md),8px)]",
          "in-data-[slot=button-group]:rounded-md",
          "[&_svg:not([class*='size-'])]:size-3"
        ),
        "icon-sm": cn(
          "size-8",
          "rounded-[min(var(--radius-md),10px)]",
          "in-data-[slot=button-group]:rounded-md"
        ),
        "icon-lg": "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
