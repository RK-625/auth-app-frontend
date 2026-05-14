import { describe, expect, it } from "vitest"
import { maskEmail } from "@/lib/privacy"

describe("maskEmail", () => {
  it("masks a one-character local part", () => {
    expect(maskEmail("a@gmail.com")).toBe("a***@gmail.com")
  })

  it("masks a two-character local part", () => {
    expect(maskEmail("ab@gmail.com")).toBe("a***@gmail.com")
  })

  it("masks a normal email and preserves first/last local chars", () => {
    expect(maskEmail("john@gmail.com")).toBe("j***n@gmail.com")
  })

  it("returns input when email is malformed", () => {
    expect(maskEmail("not-an-email")).toBe("not-an-email")
  })
})
