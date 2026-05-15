import { useState } from "react"
import { Monitor, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"

type SessionView = {
  jti: string
  userAgent: string
  createdAt: string
  current: boolean
}

const asDateLabel = (value: string) => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return "Unknown"
  }
  return date.toLocaleString()
}

const getCurrentSession = (): SessionView => ({
  jti: "current",
  userAgent: typeof navigator === "undefined" ? "Current browser" : navigator.userAgent,
  createdAt: new Date().toISOString(),
  current: true,
})

export function SessionManagementSection() {
  const [sessions] = useState<SessionView[]>(() => [getCurrentSession()])

  return (
    <div className="mt-4 rounded-xl border border-border/40 bg-card/10 p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-black uppercase tracking-wider text-muted-foreground">
            Active Sessions
          </h3>
          <p className="text-xs text-muted-foreground">
            Session history is staged until backend tracking is enabled.
          </p>
        </div>
        <Button
          variant="outline"
          disabled
          title="Session revocation requires backend session persistence."
        >
          Sign out everywhere
        </Button>
      </div>

      <p className="mb-3 text-sm text-muted-foreground">Only your current session is active.</p>
      <div className="space-y-3">
        {sessions.map((session) => (
          <div
            key={session.jti}
            className="flex flex-col gap-3 rounded-lg border border-border/50 bg-card/20 p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <Monitor className="size-4 text-muted-foreground" />
                <span className="truncate text-sm font-semibold">{session.userAgent}</span>
                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold uppercase text-emerald-500">
                  <ShieldCheck className="size-3" />
                  Current session
                </span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                Started: {asDateLabel(session.createdAt)}
              </p>
            </div>
            <Button
              variant="outline"
              disabled
              title="Current session sign-out is handled by Log out."
              className="w-full sm:w-auto"
            >
              Current only
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
