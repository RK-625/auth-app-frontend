import { lazy, Suspense } from "react"
import { Routes, Route, useLocation } from "react-router-dom"
import { AnimatePresence, motion, type HTMLMotionProps } from "framer-motion"
import { cn } from "@/lib/utils"
import { AuthProvider } from "@/components/auth-provider"
import { Toaster } from "@/components/ui/sonner"
import { ThemeProvider } from "@/components/theme-provider"
import { ModeToggle } from "@/components/mode-toggle"
import { ProtectedRoute } from "@/components/protected-route"
import { PublicRoute } from "@/components/public-route"
import { RoleProtectedRoute } from "@/components/role-protected-route"
import { ParticleBackground } from "@/components/particle-background"
import { AuthLoadingScreen } from "@/components/auth-loading-screen"

const HomePage = lazy(() => import("@/components/pages/home-page"))
const LoginForm = lazy(() => import("@/components/pages/login-form"))
const SignupForm = lazy(() =>
  import("@/components/pages/signup-form").then((module) => ({
    default: module.SignupForm,
  }))
)
const ForgetPage = lazy(() => import("@/components/pages/forget-page"))
const OAuth2RedirectPage = lazy(
  () => import("@/components/pages/oauth2-redirect-page")
)
const DashboardPage = lazy(() => import("@/components/pages/dashboard-page"))
const AdminUsersPage = lazy(() => import("@/components/pages/admin-users-page"))
const ForbiddenPage = lazy(() => import("@/components/pages/forbidden-page"))
const DesignSystemPage = lazy(() => import("@/components/pages/design-system-page"))

const pageTransition: HTMLMotionProps<"div"> = {
  initial: { opacity: 0, scale: 0.98, filter: "blur(8px)" },
  animate: { opacity: 1, scale: 1, filter: "blur(0px)" },
  exit: { opacity: 0, scale: 1.02, filter: "blur(8px)" },
  transition: { duration: 0.38, ease: [0.4, 0, 0.2, 1] },
}

function App() {
  const location = useLocation()
  const isDashboard = location.pathname.startsWith("/dashboard")

  return (
    <ThemeProvider defaultTheme="dark" storageKey="auth-ui-theme">
      <AuthProvider>
        <div className="relative min-h-screen overflow-hidden">
          {!isDashboard && <ParticleBackground />}
          
          {/* Global Theme Toggle - Hidden on Dashboard to avoid duplication with Header UI if desired, or kept for consistency */}
          <AnimatePresence>
            {!isDashboard && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.38, ease: [0.4, 0, 0.2, 1] }}
                className="absolute top-4 right-4 z-50"
              >
                <ModeToggle />
              </motion.div>
            )}
          </AnimatePresence>

          <main className={cn(
            "relative z-10 flex min-h-screen w-full",
            !isDashboard && "items-center justify-center p-4 md:p-8"
          )}>
            <AnimatePresence mode="wait">
              <motion.div 
                key={location.pathname} 
                {...pageTransition} 
                className={cn("w-full", isDashboard && "h-screen")}
              >
                <Suspense fallback={<AuthLoadingScreen message="Loading page..." />}>
                  <Routes location={location}>
                    <Route path="/" element={<HomePage />} />
                    <Route 
                      path="/login" 
                      element={
                        <PublicRoute>
                          <LoginForm />
                        </PublicRoute>
                      } 
                    />
                    <Route 
                      path="/signup" 
                      element={
                        <PublicRoute>
                          <SignupForm />
                        </PublicRoute>
                      } 
                    />
                    <Route 
                      path="/forget" 
                      element={
                        <PublicRoute>
                          <ForgetPage />
                        </PublicRoute>
                      } 
                    />
                    <Route 
                      path="/forgot-password" 
                      element={
                        <PublicRoute>
                          <ForgetPage />
                        </PublicRoute>
                      } 
                    />
                    <Route
                      path="/oauth2/redirect/"
                      element={<OAuth2RedirectPage />}
                    />
                    <Route 
                      path="/dashboard" 
                      element={
                        <ProtectedRoute>
                          <DashboardPage />
                        </ProtectedRoute>
                      } 
                    />
                    <Route
                      path="/admin/users"
                      element={
                        <ProtectedRoute>
                          <RoleProtectedRoute requiredRole="ROLE_ADMIN">
                            <AdminUsersPage />
                          </RoleProtectedRoute>
                        </ProtectedRoute>
                      }
                    />
                    {import.meta.env.MODE === "development" && (
                      <Route
                        path="/design-system"
                        element={
                          <ProtectedRoute>
                            <DesignSystemPage />
                          </ProtectedRoute>
                        }
                      />
                    )}
                    <Route
                      path="/403"
                      element={
                        <ProtectedRoute>
                          <ForbiddenPage />
                        </ProtectedRoute>
                      }
                    />
                  </Routes>
                </Suspense>
              </motion.div>
            </AnimatePresence>
          </main>

          <Toaster
            position="bottom-right"
            richColors
            closeButton
          />
        </div>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
