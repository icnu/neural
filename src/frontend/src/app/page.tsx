'use client'

import { Header } from "@/components/header"
import { DAOCard } from "@/components/dao-card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

const mockDAOs = [
  {
    id: "1",
    name: "DeFi Governance DAO",
    description:
      "A decentralized autonomous organization focused on governing DeFi protocols and making strategic decisions for the ecosystem.",
    logo: "/defi-dao-logo.png",
    memberCount: 1247,
    proposalCount: 23,
  },
  {
    id: "2",
    name: "Green Energy Collective",
    description:
      "Community-driven organization promoting sustainable energy solutions through blockchain governance and funding.",
    logo: "/green-energy-logo.png",
    memberCount: 892,
    proposalCount: 15,
  },
  {
    id: "3",
    name: "Creator Economy DAO",
    description:
      "Supporting digital creators with funding, resources, and governance tools for the new creator economy.",
    logo: "/creator-dao-logo.png",
    memberCount: 2156,
    proposalCount: 31,
  },
  {
    id: "4",
    name: "Research Collective",
    description:
      "Funding and coordinating blockchain research initiatives through decentralized governance mechanisms.",
    logo: "/research-dao-logo.png",
    memberCount: 567,
    proposalCount: 8,
  },
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">My DAOs</h1>
              <p className="text-muted-foreground mt-2">
                Manage and participate in your decentralized autonomous organizations
              </p>
            </div>
            <Link href="/create-dao">
              <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
                <Plus className="w-4 h-4 mr-2" />
                Create DAO
              </Button>
            </Link>
          </div>

          {mockDAOs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockDAOs.map((dao) => (
                <DAOCard key={dao.id} dao={dao} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">No DAOs Found</h3>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                You're not a member of any DAOs yet. Create your first DAO or join an existing one to get started.
              </p>
              <Link href="/create-dao">
                <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Your First DAO
                </Button>
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
