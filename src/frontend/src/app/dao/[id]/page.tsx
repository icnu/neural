"use client";

import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, FileText, Plus, ArrowLeft, Clock, CheckCircle, XCircle } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

// Mock data for demonstration
const mockDAOs = {
  "1": {
    id: "1",
    name: "DeFi Governance DAO",
    description:
      "A decentralized autonomous organization focused on governing DeFi protocols and making strategic decisions for the ecosystem. We aim to create a more transparent and community-driven approach to DeFi governance.",
    logo: "/defi-dao-logo.png",
    memberCount: 1247,
    proposalCount: 23,
    votingPower: "1,250 DEFI",
    multisigAddress: "0x742d35Cc6634C0532925a3b8D4C9db96590c6C8b",
  },
  "2": {
    id: "2",
    name: "Green Energy Collective",
    description:
      "Community-driven organization promoting sustainable energy solutions through blockchain governance and funding.",
    logo: "/green-energy-logo.png",
    memberCount: 892,
    proposalCount: 15,
    votingPower: "850 GREEN",
    multisigAddress: "0x8ba1f109551bD432803012645Hac136c9c1588c9",
  },
}

const mockProposals = [
  {
    id: "1",
    title: "Increase Staking Rewards by 2%",
    description: "Proposal to increase the annual staking rewards from 8% to 10% to attract more liquidity providers.",
    status: "active" as const,
    votesFor: 1250,
    votesAgainst: 340,
    totalVotes: 1590,
    endDate: "2024-01-15",
    proposer: {
      address: "0x1234...5678",
      avatar: "/diverse-user-avatars.png",
    },
  },
  {
    id: "2",
    title: "Treasury Diversification Strategy",
    description: "Allocate 30% of treasury funds to blue-chip cryptocurrencies to reduce risk and improve stability.",
    status: "passed" as const,
    votesFor: 2100,
    votesAgainst: 450,
    totalVotes: 2550,
    endDate: "2024-01-10",
    proposer: {
      address: "0xabcd...efgh",
      avatar: "/diverse-user-avatar-set-2.png",
    },
  },
  {
    id: "3",
    title: "New Partnership with Layer 2 Protocol",
    description: "Establish strategic partnership with Arbitrum to reduce transaction costs for DAO operations.",
    status: "rejected" as const,
    votesFor: 800,
    votesAgainst: 1200,
    totalVotes: 2000,
    endDate: "2024-01-05",
    proposer: {
      address: "0x9876...5432",
      avatar: "/diverse-user-avatars-3.png",
    },
  },
]

function ProposalCard({ proposal }: { proposal: (typeof mockProposals)[0] }) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <Clock className="w-4 h-4" />
      case "passed":
        return <CheckCircle className="w-4 h-4" />
      case "rejected":
        return <XCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-blue-100 text-blue-800"
      case "passed":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const votePercentage = proposal.totalVotes > 0 ? (proposal.votesFor / proposal.totalVotes) * 100 : 0

  return (
    <Link href={`/proposal/${proposal.id}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <CardTitle className="text-lg">{proposal.title}</CardTitle>
              <div className="flex items-center space-x-2">
                <Badge className={getStatusColor(proposal.status)}>
                  {getStatusIcon(proposal.status)}
                  <span className="ml-1 capitalize">{proposal.status}</span>
                </Badge>
                <span className="text-sm text-muted-foreground">Ends {proposal.endDate}</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <CardDescription className="line-clamp-2">{proposal.description}</CardDescription>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Voting Progress</span>
              <span className="font-medium">{votePercentage.toFixed(1)}% For</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div className="bg-accent h-2 rounded-full transition-all" style={{ width: `${votePercentage}%` }} />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{proposal.votesFor.toLocaleString()} For</span>
              <span>{proposal.votesAgainst.toLocaleString()} Against</span>
            </div>
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <Avatar className="w-6 h-6">
              <AvatarImage src={proposal.proposer.avatar || "/placeholder.svg"} />
              <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <span className="text-sm text-muted-foreground">by {proposal.proposer.address}</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

export default function DAODetailPage({ params }: { params: { id: string } }) {
  const dao = mockDAOs[params.id as keyof typeof mockDAOs]

  if (!dao) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Back Navigation */}
          <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to My DAOs
          </Link>

          {/* DAO Header */}
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
                  <img
                    src={dao.logo || "/placeholder.svg"}
                    alt={`${dao.name} logo`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = `/placeholder.svg?height=64&width=64&query=${encodeURIComponent(dao.name + " logo")}`
                    }}
                  />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-card-foreground">{dao.name}</h1>
                </div>
              </div>
              <Link href={`/dao/${dao.id}/create-proposal`}>
                <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
                  <Plus className="w-4 h-4 mr-2" />
                  New Proposal
                </Button>
              </Link>
            </div>

            <p className="text-muted-foreground mb-6">{dao.description}</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="flex items-center space-x-3">
                <Users className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-lg font-semibold text-card-foreground">{dao.memberCount.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Members</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <FileText className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-lg font-semibold text-card-foreground">{dao.proposalCount}</p>
                  <p className="text-sm text-muted-foreground">Proposals</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 bg-accent rounded-full flex items-center justify-center">
                  <span className="text-xs text-accent-foreground font-bold">VP</span>
                </div>
                <div>
                  <p className="text-lg font-semibold text-card-foreground">{dao.votingPower}</p>
                  <p className="text-sm text-muted-foreground">Your Voting Power</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-xs text-white font-bold">MS</span>
                </div>
                <div>
                  <p className="text-sm font-mono text-card-foreground">
                    {dao.multisigAddress.slice(0, 6)}...{dao.multisigAddress.slice(-4)}
                  </p>
                  <p className="text-sm text-muted-foreground">Multisig Address</p>
                </div>
              </div>
            </div>
          </div>

          {/* Proposals Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">Proposals</h2>
              <div className="flex items-center space-x-2">
                <Badge variant="outline">{mockProposals.length} Total</Badge>
                <Badge variant="outline" className="bg-blue-50 text-blue-700">
                  {mockProposals.filter((p) => p.status === "active").length} Active
                </Badge>
              </div>
            </div>

            {mockProposals.length > 0 ? (
              <div className="grid gap-6">
                {mockProposals.map((proposal) => (
                  <ProposalCard key={proposal.id} proposal={proposal} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <FileText className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">No Proposals Yet</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  This DAO doesn't have any proposals yet. Be the first to create one and start the governance process.
                </p>
                <Link href={`/dao/${dao.id}/create-proposal`}>
                  <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
                    <Plus className="w-4 h-4 mr-2" />
                    Create First Proposal
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
