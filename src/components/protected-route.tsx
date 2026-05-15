import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "@/components/auth-context"
import { AuthLoadingScreen } from "@/components/auth-loading-screen"

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoaded } = useAuth()
  const location = useLocation()

  // Wait until auth state is resolved to prevent flashing the login screen
  if (!isLoaded) {
    return <AuthLoadingScreen />
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <>{children}</>
}
