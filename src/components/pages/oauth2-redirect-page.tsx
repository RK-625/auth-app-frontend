import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import api from "@/lib/api"
import { useAuth } from "@/components/auth-context"

type ApiErrorData = {
  message?: string
}

function extractApiMessage(error: unknown) {
  const maybeError = error as { response?: { data?: ApiErrorData } }
  return maybeError.response?.data?.message || "OAuth2 sign-in failed. Please try again."
}

export default function OAuth2RedirectPage() {
  const navigate = useNavigate()
  const { login } = useAuth()

  useEffect(() => {
    let isMounted = true

    const completeOAuthLogin = async () => {
      const hasSessionHint = document.cookie.includes("logged_in=true")
      if (!hasSessionHint) {
        navigate("/login", {
          replace: true,
          state: { error: "OAuth2 session was not established. Please sign in again." },
        })
        return
      }

      try {
        const res = await api.post("/auth/refresh")
        const { accessToken, user } = res.data || {}

        if (!accessToken || !user) {
          throw new Error("Invalid OAuth2 refresh response")
        }

        if (isMounted) {
          login(accessToken, user)
          navigate("/dashboard", { replace: true })
        }
      } catch (error) {
        const message = extractApiMessage(error)
        if (isMounted) {
          navigate("/login", {
            replace: true,
            state: { error: message },
          })
        }
      }
    }

    completeOAuthLogin()
    return () => {
      isMounted = false
    }
  }, [login, navigate])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="relative">
        <div className="size-12 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
        <p className="mt-4 text-center text-sm text-muted-foreground">
          Completing sign in...
        </p>
      </div>
    </div>
  )
}
