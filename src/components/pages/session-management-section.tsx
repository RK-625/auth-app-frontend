import { useEffect, useMemo, useState } from "react"
import { Monitor, ShieldCheck } from "lucide-react"
import { toast } from "sonner"
import api from "@/lib/api"
import { useAuth } from "@/components/auth-context"
import { Button } from "@/components/ui/button"
import { toastApiError } from "@/lib/toast-api-error"

type SessionDto = {
  jti?: string
  id?: string
  tokenId?: string
  userAgent?: string
  device?: string
  createdAt?: string
  issuedAt?: string
  current?: boolean
  isCurrent?: boolean
}

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

const normalizeSession = (raw: SessionDto, index: number): SessionView => ({
  jti: raw.jti || raw.id || raw.tokenId || `session-${index}`,
  userAgent: raw.userAgent || raw.device || "Unknown device",
  createdAt: raw.createdAt || raw.issuedAt || "",
  current: Boolean(raw.current ?? raw.isCurrent),
})

export function SessionManagementSection() {
  const { logout } = useAuth()
  const [sessions, setSessions] = useState<SessionView[]>([])
  const [loading, setLoading] = useState(true)
  const [revokingId, setRevokingId] = useState<string | null>(null)
  const [revokingAll, setRevokingAll] = useState(false)

  useEffect(() => {
    let mounted = true

    const loadSessions = async () => {
      try {
        const res = await api.get("/user/sessions")
        const rawSessions = Array.isArray(res.data) ? res.data : []
        const normalized = rawSessions.map((item: SessionDto, i: number) => normalizeSession(item, i))
        if (mounted) {
          setSessions(normalized)
        }
      } catch (error) {
        toastApiError(error)
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    loadSessions()
    return () => {
      mounted = false
    }
  }, [])

  const currentSessionCount = useMemo(
    () => sessions.filter((session) => session.current).length,
    [sessions]
  )

  const onRevokeSession = async (session: SessionView) => {
    if (session.current || revokingId || revokingAll) {
      return
    }

    const previous = sessions
    setRevokingId(session.jti)
    setSessions((prev) => prev.filter((item) => item.jti !== session.jti))
    try {
      await api.delete(`/user/sessions/${session.jti}`)
      toast.success("Session revoked")
    } catch (error) {
      setSessions(previous)
      toastApiError(error)
    } finally {
      setRevokingId(null)
    }
  }

  const onRevokeAllOther = async () => {
    if (revokingAll || revokingId) {
      return
    }

    setRevokingAll(true)
    try {
      await api.delete("/user/sessions")
      toast.success("Signed out of all other devices")
      await logout("/login")
    } catch (error) {
      toastApiError(error)
    } finally {
      setRevokingAll(false)
    }
  }

  return (
    <div className="mt-4 rounded-xl border border-border/40 bg-card/10 p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-black uppercase tracking-wider text-muted-foreground">
            Active Sessions
          </h3>
          <p className="text-xs text-muted-foreground">
            Review and revoke active device sessions.
          </p>
        </div>
        <Button
          variant="outline"
          loading={revokingAll}
          loadingLabel="Revoking..."
          disabled={loading || sessions.length === 0 || currentSessionCount === sessions.length || revokingAll}
          onClick={onRevokeAllOther}
        >
          Sign out everywhere
        </Button>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading sessions...</p>
      ) : sessions.length === 0 ? (
        <p className="text-sm text-muted-foreground">No active sessions found.</p>
      ) : sessions.length === currentSessionCount ? (
        <p className="text-sm text-muted-foreground">Only your current session is active.</p>
      ) : (
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
                  {session.current && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold uppercase text-emerald-500">
                      <ShieldCheck className="size-3" />
                      Current session
                    </span>
                  )}
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Started: {asDateLabel(session.createdAt)}
                </p>
              </div>
              <Button
                variant="outline"
                disabled={session.current || revokingAll || revokingId === session.jti}
                loading={revokingId === session.jti}
                loadingLabel="Revoking..."
                onClick={() => onRevokeSession(session)}
                className="w-full sm:w-auto"
              >
                Sign out
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
