import { useMemo, useRef, useState } from "react"
import { cn } from "@/lib/utils"

const OTP_LENGTH = 6

interface OtpInputProps {
  onComplete: (otp: string) => void
  disabled?: boolean
  error?: boolean
  onChange?: (otp: string) => void
}

export function OtpInput({
  onComplete,
  disabled = false,
  error = false,
  onChange,
}: OtpInputProps) {
  const [digits, setDigits] = useState<string[]>(Array.from({ length: OTP_LENGTH }, () => ""))
  const refs = useRef<Array<HTMLInputElement | null>>([])

  const otpValue = useMemo(() => digits.join(""), [digits])

  const commit = (nextDigits: string[]) => {
    setDigits(nextDigits)
    const nextValue = nextDigits.join("")
    onChange?.(nextValue)
    if (nextDigits.every((digit) => digit.length === 1)) {
      onComplete(nextValue)
    }
  }

  const focusAt = (index: number) => {
    refs.current[index]?.focus()
    refs.current[index]?.select()
  }

  const handleDigitChange = (index: number, rawValue: string) => {
    const value = rawValue.replace(/\D/g, "").slice(-1)
    const nextDigits = [...digits]
    nextDigits[index] = value
    commit(nextDigits)

    if (value && index < OTP_LENGTH - 1) {
      focusAt(index + 1)
    }
  }

  const handleKeyDown = (index: number, event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Backspace" && !digits[index] && index > 0) {
      event.preventDefault()
      focusAt(index - 1)
    }
  }

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault()
    const pastedDigits = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, OTP_LENGTH)
      .split("")

    if (pastedDigits.length === 0) {
      return
    }

    const nextDigits = Array.from({ length: OTP_LENGTH }, (_, i) => pastedDigits[i] ?? "")
    commit(nextDigits)
    focusAt(Math.min(pastedDigits.length, OTP_LENGTH) - 1)
  }

  return (
    <div className="flex items-center justify-center gap-2">
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(node) => {
            refs.current[index] = node
          }}
          type="text"
          inputMode="numeric"
          autoComplete={index === 0 ? "one-time-code" : "off"}
          pattern="[0-9]*"
          maxLength={1}
          value={digit}
          disabled={disabled}
          onChange={(event) => handleDigitChange(index, event.target.value)}
          onKeyDown={(event) => handleKeyDown(index, event)}
          onPaste={handlePaste}
          className={cn(
            "h-14 w-11 rounded-xl border bg-input/50 text-center text-lg font-mono font-semibold transition-colors outline-none",
            "focus:border-primary/50 focus:ring-4 focus:ring-primary/10",
            disabled && "cursor-not-allowed opacity-60",
            error
              ? "border-destructive/70 focus:border-destructive focus:ring-destructive/20"
              : "border-border"
          )}
          aria-label={`OTP digit ${index + 1}`}
          aria-invalid={error ? "true" : undefined}
        />
      ))}
      <span className="sr-only">{otpValue}</span>
    </div>
  )
}
