import { renderToStaticMarkup } from "react-dom/server"
import { describe, expect, it } from "vitest"
import { AuthLoadingScreen } from "@/components/auth-loading-screen"

describe("AuthLoadingScreen", () => {
  it("renders visible foreground loading content", () => {
    const markup = renderToStaticMarkup(
      <AuthLoadingScreen message="Checking session..." />
    )

    expect(markup).toContain("Checking session...")
    expect(markup).toContain("role=\"status\"")
    expect(markup).toContain("aria-live=\"polite\"")
  })
})
