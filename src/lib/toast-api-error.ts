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

export function toastApiError(rawError: unknown) {
  const error = rawError as AxiosError<ApiErrorResponse> & ToastHandledError

  if (error.__toastHandled) {
    return
  }

  if (error.response) {
    const statusCode = error.response.status
    const backendMessage = error.response.data?.message

    if (statusCode >= 500) {
      toast.error("Server Error", {
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
    toast.error("Network Error", {
      description: "Could not connect to the server. Please check your connection.",
    })
  }

  error.__toastHandled = true
}
