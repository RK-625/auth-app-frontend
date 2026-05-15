type AuthLoadingScreenProps = {
  message?: string
}

export function AuthLoadingScreen({
  message = "Checking session...",
}: AuthLoadingScreenProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-50 flex items-center justify-center bg-background"
    >
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="size-12 animate-spin rounded-full border-2 border-primary/20 border-t-primary shadow-[0_0_20px_rgba(236,72,153,0.2)]" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="size-2 animate-pulse rounded-full bg-primary" />
          </div>
        </div>
        <p className="text-sm font-medium text-muted-foreground">{message}</p>
      </div>
    </div>
  )
}
