import { Navigate } from "react-router-dom"
import { useAuth } from "@/components/auth-provider"
import { motion } from "framer-motion"

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()

  // Wait until auth state is resolved to prevent flashing the login screen
  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background z-50">
        <div className="relative">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="size-12 rounded-full border-2 border-primary/20 border-t-primary shadow-[0_0_20px_rgba(236,72,153,0.2)]"
          />
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="size-2 bg-primary rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}
