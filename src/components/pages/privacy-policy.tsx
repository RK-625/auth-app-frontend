import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export function PrivacyPolicy() {
  return (
    <div className="flex flex-col gap-6">
      <Card variant="glass">
        <CardContent className="p-8 md:p-12">
          <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">
              Privacy Policy
            </h1>
            <p className="text-muted-foreground">
              Last updated: {new Date().toLocaleDateString()}
            </p>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold">1. Data Collection</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                We collect essential information like your email address and
                password hash to provide authentication services. We do not sell
                your personal data to third parties.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold">2. Cookies</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                We use secure cookies to maintain your login session and enhance
                security. These are required for the core functionality of our
                service.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold">3. Data Security</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                All data is encrypted in transit and at rest using
                industry-standard protocols. Your security is our top priority.
              </p>
            </section>

            <div className="pt-6">
              <Button asChild variant="outline">
                <Link to="/">Back to Home</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
