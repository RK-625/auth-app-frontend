import { useMemo, useState } from "react"
import { AlertTriangle } from "lucide-react"
import { toast } from "sonner"
import api from "@/lib/api"
import { useAuth } from "@/components/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toastApiError } from "@/lib/toast-api-error"

export function AccountDeletionSection() {
  const { user, logout } = useAuth()
  const [modalOpen, setModalOpen] = useState(false)
  const [confirmEmail, setConfirmEmail] = useState("")
  const [loading, setLoading] = useState(false)

  const expectedEmail = user?.email ?? ""
  const canDelete = useMemo(
    () => confirmEmail.trim().toLowerCase() === expectedEmail.toLowerCase(),
    [confirmEmail, expectedEmail]
  )

  const onDeleteAccount = async () => {
    if (!canDelete || loading) {
      return
    }

    setLoading(true)
    try {
      await api.delete("/user/me")
      toast.success("Account deleted successfully.")
      await logout("/login")
    } catch (error) {
      toastApiError(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="mt-4 rounded-xl border border-destructive/30 bg-destructive/5 p-5">
        <div className="mb-3 flex items-center gap-2 text-destructive">
          <AlertTriangle className="size-4" />
          <h3 className="text-sm font-black uppercase tracking-wider">Danger Zone</h3>
        </div>
        <p className="mb-4 text-sm text-muted-foreground">
          Deleting your account is permanent and cannot be undone.
        </p>
        <Button variant="destructive" onClick={() => setModalOpen(true)}>
          Delete Account
        </Button>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl">
            <h4 className="text-lg font-black tracking-tight">Confirm Account Deletion</h4>
            <p className="mt-2 text-sm text-muted-foreground">
              Type your email to confirm deletion:{" "}
              <span className="font-semibold text-foreground">{expectedEmail}</span>
            </p>
            <Input
              value={confirmEmail}
              onChange={(event) => setConfirmEmail(event.target.value)}
              placeholder="Enter your email"
              className="minimal-input mt-4 h-11"
              autoComplete="email"
              disabled={loading}
            />
            <div className="mt-5 flex items-center justify-end gap-2">
              <Button
                variant="outline"
                disabled={loading}
                onClick={() => {
                  setModalOpen(false)
                  setConfirmEmail("")
                }}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                loading={loading}
                loadingLabel="Deleting..."
                disabled={!canDelete || loading}
                onClick={onDeleteAccount}
              >
                Confirm Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
