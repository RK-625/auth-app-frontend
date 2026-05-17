import { useState } from "react"
import type { AxiosError } from "axios"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"
import api from "@/lib/api"
import { useAuth } from "@/components/auth-context"
import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { changePasswordSchema } from "@/lib/schemas"
import { toastApiError } from "@/lib/toast-api-error"

type ChangePasswordValues = z.infer<typeof changePasswordSchema>

export function PasswordChangeSection() {
  const { logout } = useAuth()
  const [loading, setLoading] = useState(false)

  const form = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    },
    mode: "onBlur",
  })

  const onSubmit = async (data: ChangePasswordValues) => {
    setLoading(true)
    try {
      await api.put("/user/password", {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      })

      toast.success("Password changed. Please sign in again.")
      await logout("/login")
    } catch (error) {
      const axiosError = error as AxiosError
      if (axiosError.response?.status === 401) {
        toast.error("Request Failed", {
          description: "Current password is incorrect",
        })
        ;(axiosError as AxiosError & { __toastHandled?: boolean }).__toastHandled = true
      }
      toastApiError(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-xl border border-border/40 bg-card/10 p-5">
      <div className="mb-4">
        <h3 className="text-sm font-black uppercase tracking-wider text-muted-foreground">
          Change Password
        </h3>
      </div>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup className="gap-4">
          <Field>
            <FieldLabel htmlFor="current-password">Current Password</FieldLabel>
            <Input
              id="current-password"
              type="password"
              autoComplete="current-password"
              className="h-11"
              {...form.register("currentPassword")}
            />
            <FieldError errors={[form.formState.errors.currentPassword]} />
          </Field>
          <Field>
            <FieldLabel htmlFor="new-password">New Password</FieldLabel>
            <Input
              id="new-password"
              type="password"
              autoComplete="new-password"
              className="h-11"
              {...form.register("newPassword")}
            />
            <FieldError errors={[form.formState.errors.newPassword]} />
          </Field>
          <Field>
            <FieldLabel htmlFor="confirm-new-password">Confirm New Password</FieldLabel>
            <Input
              id="confirm-new-password"
              type="password"
              autoComplete="new-password"
              className="h-11"
              {...form.register("confirmNewPassword")}
            />
            <FieldError errors={[form.formState.errors.confirmNewPassword]} />
          </Field>
          <Button
            type="submit"
            loading={loading}
            loadingLabel="Updating..."
            disabled={!form.formState.isValid || loading}
            className="w-full sm:w-auto"
          >
            Update Password
          </Button>
        </FieldGroup>
      </form>
    </div>
  )
}
