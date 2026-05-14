import { Link } from "react-router-dom"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles, LogOut, LayoutDashboard } from "lucide-react"
import { useAuth } from "@/components/auth-provider"

export default function HomePage({ className, ...props }: React.ComponentProps<"div">) {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <div className={cn("mx-auto flex w-full max-w-5xl flex-col items-center gap-16 md:gap-24", className)} {...props}>
      {/* Hero */}
      <div className="flex flex-col items-center gap-8 pt-8 text-center md:pt-16">
        <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-medium text-muted-foreground">
          <Sparkles className="size-3 text-primary" />
          Hybrid Session Security
        </div>

        <div className="flex flex-col gap-5">
          <h1 className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl">
            {import.meta.env.VITE_ORG_NAME}
          </h1>
          <p className="mx-auto max-w-[50ch] text-base leading-relaxed text-muted-foreground sm:text-lg">
            Identity infrastructure that scales with your ambition.
            Zero-trust sessions, built for modern teams.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          {isAuthenticated ? (
            <>
              <Button asChild size="lg" className="gap-2 px-8">
                <Link to="/dashboard">
                  <LayoutDashboard className="size-4" />
                  Continue as {user?.name || "User"}
                  <ArrowRight className="size-4 transition-transform group-hover/button:translate-x-0.5" />
                </Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="gap-2"
                onClick={() => logout("/")}
              >
                <LogOut className="size-4" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button asChild size="lg" className="gap-2 px-8">
                <Link to="/login">
                  Get Started
                  <ArrowRight className="size-4 transition-transform group-hover/button:translate-x-0.5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/signup">Create Account</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
