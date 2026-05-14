import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Eye, EyeOff, ArrowRight, Check } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import api from "@/lib/api"
import { toast } from "sonner"
import { AnimatePresence, motion } from "framer-motion"
import forgotImg from "@/assets/forgot_img.png"
import forgotImgLight from "@/assets/forgot_img_light.png"
import { forgetSchema } from "@/lib/schemas"

import { InteractiveLogo } from "@/components/ui/logo"

const stepTransition = {
  initial: { opacity: 0, x: 16 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -16 },
  transition: { duration: 0.2, ease: [0.25, 1, 0.5, 1] },
}

export default function ForgetPage({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const navigate = useNavigate()
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [loading, setLoading] = useState(false)

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [resetToken, setResetToken] = useState("")
  const [cooldown, setCooldown] = useState(0)

  const form = useForm<z.infer<typeof forgetSchema>>({
    resolver: zodResolver(forgetSchema),
    defaultValues: {
      email: "",
      otp: "",
      password: "",
      confirmPassword: "",
    },
    mode: "onChange",
  })

  const { email, otp, password, confirmPassword } = form.watch()

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (cooldown > 0) {
      timer = setInterval(() => setCooldown((c) => c - 1), 1000)
    }
    return () => clearInterval(timer)
  }, [cooldown])

  const handleStep1 = async (e: React.FormEvent) => {
    e.preventDefault()
    const isValid = await form.trigger("email")
    if (!isValid) return

    setLoading(true)
    try {
      await api.post("/auth/forget/email", { email })
      toast.success("Reset code sent")
      setStep(2)
      setCooldown(60)
    } catch {
      // Handled globally
    } finally {
      setLoading(false)
    }
  }

  const handleResendOtp = async () => {
    setLoading(true)
    try {
      await api.post("/auth/forget/email", { email })
      toast.success("Code resent")
      setCooldown(60)
    } catch {
      // Handled globally
    } finally {
      setLoading(false)
    }
  }

  const handleStep2 = async (e: React.FormEvent) => {
    e.preventDefault()
    const isValid = await form.trigger("otp")
    if (!isValid) return

    setLoading(true)
    try {
      const res = await api.post("/auth/forget/otp", { email, otp })
      if (res.data && res.data.token) {
        setResetToken(res.data.token)
        toast.success("Code verified")
        setStep(3)
      }
    } catch {
      // Handled globally
    } finally {
      setLoading(false)
    }
  }

  const handleStep3 = async (e: React.FormEvent) => {
    e.preventDefault()
    const isValid = await form.trigger(["password", "confirmPassword"])
    if (!isValid) return

    setLoading(true)
    try {
      await api.post("/auth/forget/reset", {
        email,
        otp,
        resetToken,
        password,
      })
      toast.success("Password updated")
      navigate("/login")
    } catch {
      // Handled globally
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={cn("mx-auto w-full max-w-[1000px]", className)} {...props}>
      <div className="overflow-hidden rounded-3xl glass-card md:grid md:grid-cols-2 md:min-h-[600px]">

        {/* Left panel — visual */}
        <div className="relative hidden md:block border-r border-border bg-zinc-100 dark:bg-zinc-950">
          <img
            src={forgotImg}
            alt=""
            className="absolute inset-0 h-full w-full object-cover transition-opacity duration-500 opacity-0 dark:opacity-80"
          />
          <img
            src={forgotImgLight}
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
                Secure Account<br />
                Recovery
              </h2>
            </div>
          </div>
        </div>

        {/* Right panel — form */}
        <div className="flex flex-col justify-center p-8 sm:p-12 md:p-14 bg-card/30">
          <div className="mb-8 flex items-center justify-between md:hidden">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Back to website
              <ArrowRight className="size-3.5" />
            </Link>
          </div>

          <div className="mb-8 flex items-center justify-between">
             <div className="flex items-center gap-1.5">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center gap-1.5">
                  <div className="flex items-center gap-1.5">
                    <div
                      className={cn(
                        "flex size-6 items-center justify-center rounded-full text-[10px] font-bold transition-all duration-200",
                        step > s
                          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                          : step === s
                            ? "bg-foreground text-background"
                            : "bg-muted text-muted-foreground"
                      )}
                    >
                      {step > s ? <Check className="size-3" /> : s}
                    </div>
                  </div>
                  {s < 3 && (
                    <div
                      className={cn(
                        "h-px w-4 transition-colors duration-200",
                        step > s ? "bg-primary" : "bg-muted"
                      )}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.form
                key="step1"
                {...stepTransition}
                className="flex flex-col gap-8"
                onSubmit={handleStep1}
              >
                <div className="flex flex-col gap-3">
                  <h1 className="text-4xl font-black tracking-tighter">Reset password</h1>
                  <p className="text-sm text-muted-foreground">
                    Remember your password?{" "}
                    <Link to="/login" className="text-primary font-semibold hover:underline underline-offset-4">
                      Log in
                    </Link>
                  </p>
                </div>
                <FieldGroup className="gap-6">
                  <Field>
                    <FieldLabel htmlFor="forget-email" className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground/80">
                      Email address
                    </FieldLabel>
                    <Input
                      id="forget-email"
                      type="email"
                      placeholder="Enter your email"
                      {...form.register("email")}
                      required
                      autoComplete="email"
                      autoFocus
                      className="minimal-input h-12"
                    />
                    <FieldError errors={[form.formState.errors.email]} />
                  </Field>
                  <motion.div whileTap={{ scale: 0.98 }} className="w-full mt-2">
                    <Button
                      type="submit"
                      disabled={!email || !!form.formState.errors.email || loading}
                      size="lg"
                      className="w-full font-bold h-12 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 hover:animate-glow transition-all duration-300 shadow-lg shadow-primary/20"
                    >
                      {loading ? "Sending..." : "Send reset code"}
                    </Button>
                  </motion.div>
                </FieldGroup>
              </motion.form>
            )}

            {step === 2 && (
              <motion.form
                key="step2"
                {...stepTransition}
                className="flex flex-col gap-8"
                onSubmit={handleStep2}
              >
                <div className="flex flex-col gap-3">
                  <h1 className="text-4xl font-black tracking-tighter">Check your email</h1>
                  <p className="text-sm text-muted-foreground">
                    Code sent to <span className="font-bold text-primary">{email}</span>
                  </p>
                </div>
                <FieldGroup className="gap-6">
                  <Field>
                    <FieldLabel htmlFor="forget-otp" className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground/80">
                      Reset code
                    </FieldLabel>
                    <Input
                      id="forget-otp"
                      type="text"
                      placeholder="000000"
                      className="text-center text-lg font-mono tracking-[0.3em] minimal-input h-14"
                      {...form.register("otp", {
                        onChange: (e) => {
                          e.target.value = e.target.value.replace(/\D/g, "").slice(0, 6)
                        },
                      })}
                      required
                      maxLength={6}
                      autoFocus
                      autoComplete="one-time-code"
                    />
                    <FieldError errors={[form.formState.errors.otp]} />
                  </Field>
                  <motion.div whileTap={{ scale: 0.98 }} className="w-full mt-2">
                    <Button
                      type="submit"
                      disabled={otp.length !== 6 || !!form.formState.errors.otp || loading}
                      size="lg"
                      className="w-full font-bold h-12 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 hover:animate-glow transition-all duration-300 shadow-lg shadow-primary/20"
                    >
                      {loading ? "Verifying..." : "Verify code"}
                    </Button>
                  </motion.div>
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={cooldown > 0 || loading}
                    className="text-center text-xs font-bold text-muted-foreground transition-colors hover:text-primary disabled:opacity-40"
                  >
                    {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend code"}
                  </button>
                </FieldGroup>
              </motion.form>
            )}

            {step === 3 && (
              <motion.form
                key="step3"
                {...stepTransition}
                className="flex flex-col gap-8"
                onSubmit={handleStep3}
              >
                <div className="flex flex-col gap-3">
                  <h1 className="text-4xl font-black tracking-tighter">New password</h1>
                  <p className="text-sm text-muted-foreground">
                    Choose a strong new password
                  </p>
                </div>
                <FieldGroup className="gap-6">
                  <Field>
                    <FieldLabel htmlFor="forget-password" className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground/80">
                      Password
                    </FieldLabel>
                    <div className="relative">
                      <Input
                        id="forget-password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your new password"
                        {...form.register("password")}
                        required
                        autoComplete="new-password"
                        autoFocus
                        className="pr-10 minimal-input h-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground/50 transition-colors hover:text-foreground"
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                      </button>
                    </div>
                    <div className="min-h-[22px] pt-1.5">
                      {password && password.length > 0 && (
                        <p className={cn(
                          "text-[11px] font-bold transition-colors",
                          !form.formState.errors.password ? "text-emerald-500" : "text-muted-foreground/60"
                        )}>
                          {!form.formState.errors.password ? "✓ Strong enough" : password.length < 6 ? `${6 - password.length} more characters needed` : "Too long (max 15)"}
                        </p>
                      )}
                    </div>
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="forget-confirm" className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground/80">
                      Confirm password
                    </FieldLabel>
                    <div className="relative">
                      <Input
                        id="forget-confirm"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your new password"
                        {...form.register("confirmPassword")}
                        required
                        autoComplete="new-password"
                        className="pr-10 minimal-input h-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground/50 transition-colors hover:text-foreground"
                        aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                      >
                        {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                      </button>
                    </div>
                    <div className="min-h-[22px] pt-1.5">
                      <FieldError errors={[form.formState.errors.confirmPassword]} />
                    </div>
                  </Field>
                  <motion.div whileTap={{ scale: 0.98 }} className="w-full mt-2">
                    <Button
                      type="submit"
                      disabled={
                        !!form.formState.errors.password ||
                        !!form.formState.errors.confirmPassword ||
                        !password ||
                        !confirmPassword ||
                        loading
                      }
                      size="lg"
                      className="w-full font-bold h-12 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 hover:animate-glow transition-all duration-300 shadow-lg shadow-primary/20"
                    >
                      {loading ? "Updating..." : "Reset password"}
                    </Button>
                  </motion.div>
                </FieldGroup>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
