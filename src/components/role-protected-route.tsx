import type { ReactNode } from "react"
import { Navigate } from "react-router-dom"
import { useAuth } from "@/components/auth-context"
import { AuthLoadingScreen } from "@/components/auth-loading-screen"

export function RoleProtectedRoute({
  requiredRole,
  children,
}: {
  requiredRole: string
  children: ReactNode
}) {
  const { user, isLoaded } = useAuth()

  if (!isLoaded) {
    return <AuthLoadingScreen />
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  const hasRole = user.roles.some((role) => role.name === requiredRole)
  if (!hasRole) {
    return <Navigate to="/403" replace />
  }

  return <>{children}</>
}
