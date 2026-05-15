import type { AxiosError } from "axios"
import { toast } from "sonner"

type ApiErrorResponse = {
  status?: number
  error?: string
  message?: string
  path?: string
  timestamp?: string
}

type ToastHandledError = {
  __toastHandled?: boolean
}

const TOAST_DEDUPE_MS = 2500
const recentToastKeys = new Map<string, number>()

function shouldSkipToast(key: string) {
  const now = Date.now()
  const lastShownAt = recentToastKeys.get(key)

  if (lastShownAt !== undefined && now - lastShownAt < TOAST_DEDUPE_MS) {
    return true
  }

  recentToastKeys.set(key, now)
  return false
}

export function __resetToastDedupeForTests() {
  recentToastKeys.clear()
}

export function toastApiError(rawError: unknown) {
  const error = rawError as AxiosError<ApiErrorResponse> & ToastHandledError

  if (error.__toastHandled) {
    return
  }

  error.__toastHandled = true

  if (error.response) {
    const statusCode = error.response.status
    const backendMessage = error.response.data?.message
    const key = `${statusCode}:${backendMessage ?? error.response.data?.error ?? "http-error"}`

    if (shouldSkipToast(key)) {
      return
    }

    if (statusCode >= 500) {
      toast.error("Server Error", {
        id: "api-server-error",
        description: "Something went wrong. Please try again later.",
      })
    } else if (statusCode >= 400) {
      toast.error("Request Failed", {
        description: backendMessage || "The request could not be processed. Please check your input.",
      })
    } else {
      toast.error("Error", {
        description: "Something went wrong. Please try again.",
      })
    }
  } else {
    if (shouldSkipToast("network-error")) {
      return
    }

    toast.error("Network Error", {
      id: "api-network-error",
      description: "Could not connect to the server. Please check your connection.",
    })
  }
}
