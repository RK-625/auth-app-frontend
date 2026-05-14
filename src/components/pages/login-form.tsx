import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { Eye, EyeOff, ArrowRight } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { loginSchema } from "@/lib/schemas"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { InteractiveLogo } from "@/components/ui/logo"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import api from "@/lib/api"
import { useAuth } from "@/components/auth-context"
import { toastApiError } from "@/lib/toast-api-error"
import { toast } from "sonner"
import loginImg from "@/assets/login_img.png"
import loginImgLight from "@/assets/login_img_light.jpeg"

type LoginFormValues = z.infer<typeof loginSchema>
type LoginState = {
  error?: string
  from?: { pathname?: string; search?: string; hash?: string }
}

export default function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const locationState = location.state as LoginState | null
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
  })

  const onSubmit = async (data: LoginFormValues) => {
    setLoading(true)
    try {
      const res = await api.post("/auth/login", {
        email: data.email,
        password: data.password,
      })
      const { accessToken, user } = res.data
      login(accessToken, user)
      toast.success("Identity verified")
      const fromPath = locationState?.from?.pathname
      const fromSearch = locationState?.from?.search ?? ""
      const fromHash = locationState?.from?.hash ?? ""
      const redirectTo =
        fromPath && fromPath !== "/login"
          ? `${fromPath}${fromSearch}${fromHash}`
          : "/dashboard"
      navigate(redirectTo, { replace: true })
    } catch (error) {
      toastApiError(error)
    } finally {
      setLoading(false)
    }
  }

  const handleSocialLogin = (provider: string) => {
    window.location.href = `/oauth2/authorization/${provider}`
  }

  return (
    <div className={cn("mx-auto w-full max-w-[1000px]", className)} {...props}>
      <div className="overflow-hidden rounded-3xl glass-card md:grid md:grid-cols-2 md:min-h-[600px]">
        {/* Left panel — visual */}
        <div className="relative hidden md:block border-r border-border bg-zinc-100 dark:bg-zinc-950">
          <img
            src={loginImg}
            alt=""
            className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500 opacity-0 dark:opacity-80"
          />
          <img
            src={loginImgLight}
            alt=""
            className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500 opacity-80 dark:opacity-0"
          />
          {/* Synthetic Indigo gradients for depth */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
          <div className="absolute inset-0 bg-primary/10 mix-blend-overlay" />

          <div className="relative z-10 flex h-full flex-col justify-between p-10">
            <div className="flex w-full items-center justify-between">
              <InteractiveLogo />
              <Link
                to="/"
                className="inline-flex items-center gap-1.5 rounded-full bg-zinc-900/10 dark:bg-white/10 px-4 py-2 text-xs font-medium text-zinc-900/90 dark:text-white/90 backdrop-blur-md transition-colors hover:bg-zinc-900/20 dark:hover:bg-white/20 border border-zinc-900/10 dark:border-white/10"
              >
                Back to website
                <ArrowRight className="size-3.5" />
              </Link>
            </div>

            <div className="flex flex-col gap-2">
              <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white leading-tight">
                Capturing Moments,
                <br />
                Creating Memories
              </h2>
            </div>
          </div>
        </div>

        {/* Right panel — form */}
        <div className="flex flex-col justify-center p-8 sm:p-12 md:p-14 bg-card/30">
          {/* Mobile back button */}
          <div className="mb-8 flex items-center justify-between md:hidden">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Back to website
              <ArrowRight className="size-3.5" />
            </Link>
          </div>

          <form
            className="flex flex-col gap-8"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <div className="flex flex-col gap-3">
              <h1 className="text-4xl font-black tracking-tighter">Log in</h1>
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="text-primary font-semibold hover:underline underline-offset-4"
                >
                  Create an account
                </Link>
              </p>
              {typeof locationState?.error === "string" && (
                <p className="text-sm text-destructive">{locationState.error}</p>
              )}
            </div>

            <FieldGroup className="gap-6">
              <Field>
                <FieldLabel
                  htmlFor="login-email"
                  className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground/80"
                >
                  Email
                </FieldLabel>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="Enter your email"
                  {...form.register("email")}
                  autoComplete="email"
                  className="minimal-input h-12"
                />
                <FieldError errors={[form.formState.errors.email]} />
              </Field>

              <Field>
                <div className="flex items-center justify-between">
                  <FieldLabel
                    htmlFor="login-password"
                    className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground/80"
                  >
                    Password
                  </FieldLabel>
                </div>
                <div className="relative">
                  <Input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    {...form.register("password")}
                    autoComplete="current-password"
                    className="pr-10 minimal-input h-12"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground/50 transition-colors hover:text-foreground"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
                <FieldError errors={[form.formState.errors.password]} />
                <div className="flex justify-end mt-2">
                  <Link
                    to="/forgot-password"
                    className="text-[11px] font-semibold text-primary transition-colors hover:underline underline-offset-4"
                  >
                    Forgot password?
                  </Link>
                </div>
              </Field>

              <motion.div whileTap={{ scale: 0.98 }} className="w-full mt-2">
                <Button
                  type="submit"
                  disabled={!form.formState.isValid || loading}
                  loading={loading}
                  loadingLabel="Logging in..."
                  size="lg"
                  className="w-full font-bold h-12 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 hover:animate-glow transition-all duration-300 shadow-lg shadow-primary/20"
                >
                  Log in
                </Button>
              </motion.div>

              <FieldSeparator className="my-2 text-[10px] font-medium uppercase tracking-[0.15em] text-muted-foreground/60">
                or log in with
              </FieldSeparator>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => handleSocialLogin("google")}
                  className="h-11 bg-transparent hover:bg-muted/50"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className="mr-2 size-4"
                  >
                    <path
                      d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                      fill="currentColor"
                    />
                  </svg>
                  Google
                </Button>
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => handleSocialLogin("github")}
                  className="h-11 bg-transparent hover:bg-muted/50"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    className="mr-2 size-4"
                  >
                    <path
                      d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8"
                      fill="currentColor"
                    />
                  </svg>
                  GitHub
                </Button>
              </div>
            </FieldGroup>
          </form>
        </div>
      </div>
    </div>
  )
}
