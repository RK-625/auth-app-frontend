import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export function TermsOfService() {
  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardContent className="p-8 md:p-12">
          <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">
              Terms of Service
            </h1>
            <p className="text-muted-foreground">
              Last updated: {new Date().toLocaleDateString()}
            </p>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold">1. Acceptance of Terms</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                By accessing or using the services provided by{" "}
                {import.meta.env.VITE_ORG_NAME} Inc, you agree to be bound by
                these Terms of Service.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold">2. Use of Service</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                You agree to use our authentication services only for lawful
                purposes and in accordance with our security guidelines.
                Unauthorized access or disruption is strictly prohibited.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-semibold">3. Account Security</h2>
              <p className="text-sm leading-relaxed text-muted-foreground">
                You are responsible for maintaining the confidentiality of your
                account credentials and for all activities that occur under your
                account.
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
