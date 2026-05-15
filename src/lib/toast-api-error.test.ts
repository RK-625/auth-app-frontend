import { beforeEach, describe, expect, it, vi } from "vitest"
import type { AxiosError } from "axios"
import { __resetToastDedupeForTests, toastApiError } from "@/lib/toast-api-error"
import { toast } from "sonner"

vi.mock("sonner", () => ({
  toast: {
    error: vi.fn(),
  },
}))

const toastError = vi.mocked(toast.error)

function axiosError(status?: number, message?: string): AxiosError {
  return {
    name: "AxiosError",
    message: message ?? "Request failed",
    isAxiosError: true,
    toJSON: () => ({}),
    response: status
      ? {
          status,
          data: { message },
          statusText: "",
          headers: {},
          config: { headers: {} },
        }
      : undefined,
  } as AxiosError
}

describe("toastApiError", () => {
  beforeEach(() => {
    vi.clearAllMocks()
    __resetToastDedupeForTests()
  })

  it("does not toast the same error object twice", () => {
    const error = axiosError(500)

    toastApiError(error)
    toastApiError(error)

    expect(toastError).toHaveBeenCalledTimes(1)
  })

  it("deduplicates identical server errors in a burst", () => {
    toastApiError(axiosError(500))
    toastApiError(axiosError(500))
    toastApiError(axiosError(500))

    expect(toastError).toHaveBeenCalledTimes(1)
  })

  it("deduplicates identical network errors in a burst", () => {
    toastApiError(axiosError())
    toastApiError(axiosError())

    expect(toastError).toHaveBeenCalledTimes(1)
  })
})
