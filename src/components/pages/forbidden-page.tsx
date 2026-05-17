import { Link } from "react-router-dom"
import { ShieldX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function ForbiddenPage() {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-3xl items-center justify-center px-6">
      <Card variant="glass" className="flex w-full flex-col items-center gap-4 p-8 text-center">
        <ShieldX className="size-12 text-destructive" />
        <h1 className="text-3xl font-bold tracking-tight">403</h1>
        <p className="text-sm text-muted-foreground">
          You do not have permission to access this page.
        </p>
        <Button asChild>
          <Link to="/dashboard">Go to dashboard</Link>
        </Button>
      </Card>
    </div>
  )
}
