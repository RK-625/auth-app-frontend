import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-11 w-full min-w-0 rounded-lg border-2 border-transparent bg-muted py-2 text-sm text-foreground transition-all duration-200 outline-none placeholder:text-muted-foreground focus-visible:border-primary focus-visible:bg-transparent disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-40 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20",
        "px-[var(--field-spine-indent)]",
        className
      )}
      {...props}
    />
  )
}

export { Input }
