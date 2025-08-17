import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Proposal Not Found</h1>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            The proposal you're looking for doesn't exist or you don't have access to it.
          </p>
          <Link href="/">
            <Button className="bg-accent text-accent-foreground hover:bg-accent/90">Back to My DAOs</Button>
          </Link>
        </div>
      </main>
    </div>
  )
}
