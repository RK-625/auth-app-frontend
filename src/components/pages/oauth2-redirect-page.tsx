import { useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import api from "@/lib/api"
import { useAuth } from "@/components/auth-context"
import { AuthLoadingScreen } from "@/components/auth-loading-screen"

type ApiErrorData = {
  message?: string
}

function extractApiMessage(error: unknown) {
  const maybeError = error as { response?: { data?: ApiErrorData } }
  return maybeError.response?.data?.message || "OAuth2 sign-in failed. Please try again."
}

export default function OAuth2RedirectPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()

  useEffect(() => {
    let isMounted = true

    const completeOAuthLogin = async () => {
      const searchParams = new URLSearchParams(location.search)
      const errorParam = searchParams.get("error")

      if (errorParam === "disabled") {
        navigate("/login", {
          replace: true,
          state: { error: "Your account has been disabled. Please contact support." },
        })
        return
      }

      if (errorParam === "oauth2_failure") {
        navigate("/login", {
          replace: true,
          state: { error: "OAuth2 login failed. Please try again." },
        })
        return
      }

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
  }, [login, navigate, location.search])

  return <AuthLoadingScreen message="Completing sign in..." />
}
