import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { LoaderCircle } from "lucide-react"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent text-sm font-semibold whitespace-nowrap transition-all duration-[var(--duration-fast)] ease-[var(--ease-out-quart)] outline-none select-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow-[0_1px_3px_rgba(0,0,0,0.3),0_0_24px_oklch(80%_0.16_85/0.12)] hover:brightness-110 hover:shadow-[0_1px_4px_rgba(0,0,0,0.4),0_0_32px_oklch(80%_0.16_85/0.2)] active:scale-[0.97] active:brightness-95",
        outline:
          "border-border bg-card text-foreground hover:bg-secondary hover:border-border active:scale-[0.97]",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 active:scale-[0.97]",
        ghost:
          "hover:bg-secondary/60 hover:text-foreground active:scale-[0.97]",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 active:scale-[0.97]",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-5 gap-2",
        xs: "h-7 px-3 text-xs gap-1",
        sm: "h-8 px-4 text-xs gap-1.5",
        lg: "h-12 px-6 text-base gap-3",
        icon: "size-10",
        "icon-xs": "size-7",
        "icon-sm": "size-8",
        "icon-lg": "size-12",
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
  asChild = false,
  loading = false,
  loadingLabel = "Loading",
  children,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
    loading?: boolean
    loadingLabel?: string
  }) {
  const Comp = asChild ? Slot.Root : "button"
  const shouldDisable = props.disabled || loading

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      aria-busy={loading ? "true" : undefined}
      className={cn(buttonVariants({ variant, size, className }))}
      disabled={shouldDisable}
      {...props}
    >
      {loading ? (
        <>
          <LoaderCircle className="size-4 animate-spin" aria-hidden="true" />
          <span>{loadingLabel}</span>
        </>
      ) : (
        children
      )}
    </Comp>
  )
}

export { Button }
