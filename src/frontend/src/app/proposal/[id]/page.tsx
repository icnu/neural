"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  Clock,
  CheckCircle,
  XCircle,
  ThumbsUp,
  ThumbsDown,
  Code,
  ExternalLink,
  Users,
  Calendar,
  StopCircle,
} from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

// Mock data for demonstration
const mockProposals = {
  "1": {
    id: "1",
    daoId: "1",
    daoName: "DeFi Governance DAO",
    title: "Increase Staking Rewards by 2%",
    description: `This proposal aims to increase the annual staking rewards from 8% to 10% to attract more liquidity providers and strengthen our protocol's security.

## Background
Our current staking rewards of 8% have been in place for 6 months. During this time, we've observed:
- Declining participation in staking (down 15% from peak)
- Competitors offering higher rewards (9-12% range)
- Strong treasury position allowing for increased rewards

## Proposal Details
- Increase annual staking rewards from 8% to 10%
- Implementation timeline: 7 days after approval
- Estimated additional cost: $240,000 annually
- Expected increase in staked tokens: 25-30%

## Benefits
1. **Increased Security**: More staked tokens = better network security
2. **Competitive Positioning**: Match or exceed competitor offerings
3. **Community Growth**: Attract new participants to our ecosystem
4. **Token Value**: Increased utility and demand for our token`,
    status: "active" as const,
    votesFor: 1250,
    votesAgainst: 340,
    totalVotes: 1590,
    quorum: 2000,
    startDate: "2024-01-08",
    endDate: "2024-01-15",
    proposer: {
      address: "0x1234...5678",
      avatar: "/diverse-user-avatars.png",
      name: "Alice Chen",
    },
    execution: {
      contract: "0xabcd1234efgh5678ijkl9012mnop3456qrst7890",
      function: "updateStakingReward",
      parameters: [
        { name: "newRewardRate", type: "uint256", value: "1000" },
        { name: "effectiveDate", type: "uint256", value: "1705276800" },
      ],
      estimatedGas: "45,000",
      value: "0 ETH",
    },
    userVotingPower: "1,250 DEFI",
    userHasVoted: false,
    userVote: "for" as const,
    executionTxHash: "0x8f7e6d5c4b3a2918f7e6d5c4b3a2918f7e6d5c4b3a2918f7e6d5c4b3a291",
  },
  "2": {
    id: "2",
    daoId: "1",
    daoName: "DeFi Governance DAO",
    title: "Treasury Diversification Strategy",
    description: `Proposal to allocate 30% of treasury funds to blue-chip cryptocurrencies to reduce risk and improve stability.

## Current Treasury Composition
- 85% Native tokens (DEFI)
- 10% Stablecoins (USDC)
- 5% ETH

## Proposed Allocation
- 55% Native tokens (DEFI) - reduced from 85%
- 20% Stablecoins (USDC) - increased from 10%
- 15% ETH - increased from 5%
- 10% BTC - new allocation

This diversification will reduce our exposure to single-token risk while maintaining significant exposure to our native token.`,
    status: "passed" as const,
    votesFor: 2100,
    votesAgainst: 450,
    totalVotes: 2550,
    quorum: 2000,
    startDate: "2024-01-03",
    endDate: "2024-01-10",
    proposer: {
      address: "0xabcd...efgh",
      avatar: "/diverse-user-avatar-set-2.png",
      name: "Bob Martinez",
    },
    execution: {
      contract: "0xdef456789abc012345def678901abc234567def8",
      function: "rebalanceTreasury",
      parameters: [
        { name: "btcAllocation", type: "uint256", value: "10" },
        { name: "ethAllocation", type: "uint256", value: "15" },
        { name: "stablecoinAllocation", type: "uint256", value: "20" },
      ],
      estimatedGas: "120,000",
      value: "0 ETH",
    },
    userVotingPower: "1,250 DEFI",
    userHasVoted: true,
    userVote: "for" as const,
    executionTxHash: "0x8f7e6d5c4b3a2918f7e6d5c4b3a2918f7e6d5c4b3a2918f7e6d5c4b3a291",
  },
}

function ExecutionDetails({ execution }: { execution: (typeof mockProposals)["1"]["execution"] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Code className="w-5 h-5" />
          <span>Execution Details</span>
        </CardTitle>
        <CardDescription>Transaction that will be executed if this proposal passes</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium text-muted-foreground">Contract Address</label>
            <div className="flex items-center space-x-2 mt-1">
              <code className="bg-muted px-2 py-1 rounded text-sm font-mono">{execution.contract}</code>
              <Button variant="ghost" size="sm">
                <ExternalLink className="w-3 h-3" />
              </Button>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">Function</label>
            <code className="block bg-muted px-2 py-1 rounded text-sm font-mono mt-1">{execution.function}</code>
          </div>

          <div>
            <label className="text-sm font-medium text-muted-foreground">Parameters</label>
            <div className="space-y-2 mt-1">
              {execution.parameters.map((param, index) => (
                <div key={index} className="bg-muted p-3 rounded">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-mono text-sm">{param.name}</span>
                      <span className="text-muted-foreground text-sm ml-2">({param.type})</span>
                    </div>
                    <code className="text-sm bg-background px-2 py-1 rounded">{param.value}</code>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Estimated Gas</label>
              <p className="text-sm font-mono mt-1">{execution.estimatedGas}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Value</label>
              <p className="text-sm font-mono mt-1">{execution.value}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function ExecutionStatus({ txHash }: { txHash: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <CheckCircle className="w-5 h-5 text-green-600" />
          <span>Execution Complete</span>
        </CardTitle>
        <CardDescription>This proposal has been executed successfully</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium text-muted-foreground">Transaction Hash</label>
          <div className="mt-1 space-y-2">
            <code className="bg-muted px-2 py-1 rounded text-sm font-mono block break-all">
              {txHash.slice(0, 20)}...{txHash.slice(-20)}
            </code>
            <Button variant="ghost" size="sm" asChild className="w-full">
              <a
                href={`https://etherscan.io/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center space-x-1"
              >
                <ExternalLink className="w-3 h-3" />
                <span className="text-xs">View on Explorer</span>
              </a>
            </Button>
          </div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-3">
          <p className="text-sm text-green-800">✓ Transaction confirmed and executed successfully</p>
        </div>
      </CardContent>
    </Card>
  )
}

export default function ProposalPage({ params }: { params: { id: string } }) {
  const [isVoting, setIsVoting] = useState(false)
  const [isClosingVoting, setIsClosingVoting] = useState(false)
  const proposal = mockProposals[params.id as keyof typeof mockProposals]

  if (!proposal) {
    notFound()
  }

  const votePercentage = proposal.totalVotes > 0 ? (proposal.votesFor / proposal.totalVotes) * 100 : 0
  const quorumPercentage = proposal.totalVotes > 0 ? (proposal.totalVotes / proposal.quorum) * 100 : 0
  const isActive = proposal.status === "active"
  const hasQuorum = proposal.totalVotes >= proposal.quorum

  const handleVote = async (voteType: "for" | "against") => {
    setIsVoting(true)
    // Simulate voting process
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsVoting(false)
    // In a real app, this would update the proposal data
    console.log(`[v0] Voted ${voteType} on proposal ${proposal.id}`)
  }

  const handleCloseVoting = async () => {
    setIsClosingVoting(true)
    // Simulate closing voting process
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsClosingVoting(false)
    console.log(`[v0] Closed voting for proposal ${proposal.id}`)
    // In a real app, this would update the proposal status
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <Clock className="w-5 h-5" />
      case "passed":
        return <CheckCircle className="w-5 h-5" />
      case "rejected":
        return <XCircle className="w-5 h-5" />
      default:
        return <Clock className="w-5 h-5" />
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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Back Navigation */}
          <Link
            href={`/dao/${proposal.daoId}`}
            className="inline-flex items-center text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to {proposal.daoName}
          </Link>

          {/* Proposal Header */}
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold text-foreground">{proposal.title}</h1>
                <div className="flex items-center space-x-4">
                  <Badge className={getStatusColor(proposal.status)}>
                    {getStatusIcon(proposal.status)}
                    <span className="ml-2 capitalize">{proposal.status}</span>
                  </Badge>
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">
                      {proposal.startDate} - {proposal.endDate}
                    </span>
                  </div>
                </div>
              </div>
              {isActive && (
                <Button
                  onClick={handleCloseVoting}
                  disabled={isClosingVoting}
                  variant="outline"
                  className="border-orange-200 text-orange-600 hover:bg-orange-50 bg-transparent"
                >
                  <StopCircle className="w-4 h-4 mr-2" />
                  {isClosingVoting ? "Closing..." : "Close Voting (Demo)"}
                </Button>
              )}
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Description */}
              <Card>
                <CardHeader>
                  <CardTitle>Proposal Description</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="prose prose-sm max-w-none">
                    {proposal.description.split("\n").map((paragraph, index) => {
                      if (paragraph.startsWith("## ")) {
                        return (
                          <h3 key={index} className="text-lg font-semibold mt-6 mb-3 text-foreground">
                            {paragraph.replace("## ", "")}
                          </h3>
                        )
                      }
                      if (paragraph.startsWith("- ")) {
                        return (
                          <li key={index} className="text-muted-foreground ml-4">
                            {paragraph.replace("- ", "")}
                          </li>
                        )
                      }
                      if (paragraph.match(/^\d+\./)) {
                        return (
                          <li key={index} className="text-muted-foreground ml-4">
                            {paragraph}
                          </li>
                        )
                      }
                      return paragraph ? (
                        <p key={index} className="text-muted-foreground mb-4">
                          {paragraph}
                        </p>
                      ) : (
                        <br key={index} />
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Execution Details */}
              <ExecutionDetails execution={proposal.execution} />
            </div>

            {/* Voting Sidebar */}
            <div className="space-y-6">
              {/* Voting Power */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="w-5 h-5" />
                    <span>Your Voting Power</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-foreground">{proposal.userVotingPower}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Voting Results */}
              <Card>
                <CardHeader>
                  <CardTitle>Voting Results</CardTitle>
                  <CardDescription>
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-green-600">For</span>
                      <span className="font-medium">{proposal.votesFor.toLocaleString()}</span>
                    </div>
                    <Progress value={votePercentage} className="h-2" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-red-600">Against</span>
                      <span className="font-medium">{proposal.votesAgainst.toLocaleString()}</span>
                    </div>
                    <Progress value={100 - votePercentage} className="h-2" />
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Quorum Progress</span>
                      <span className="font-medium">{quorumPercentage.toFixed(1)}%</span>
                    </div>
                    <Progress value={quorumPercentage} className="h-2" />
                  </div>
                </CardContent>
              </Card>
              
              {proposal.status === "passed" && "executionTxHash" in proposal && (
                <ExecutionStatus txHash={proposal.executionTxHash} />
              )}

              {/* Voting Actions */}
              {isActive && !proposal.userHasVoted && (
                <Card>
                  <CardHeader>
                    <CardTitle>Cast Your Vote</CardTitle>
                    <CardDescription>Your vote cannot be changed once submitted</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button
                      onClick={() => handleVote("for")}
                      disabled={isVoting}
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                    >
                      <ThumbsUp className="w-4 h-4 mr-2" />
                      {isVoting ? "Voting..." : "Vote For"}
                    </Button>
                    <Button
                      onClick={() => handleVote("against")}
                      disabled={isVoting}
                      variant="outline"
                      className="w-full border-red-200 text-red-600 hover:bg-red-50"
                    >
                      <ThumbsDown className="w-4 h-4 mr-2" />
                      {isVoting ? "Voting..." : "Vote Against"}
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* User Vote Status */}
              {proposal.userHasVoted && (
                <Card>
                  <CardHeader>
                    <CardTitle>Your Vote</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <Badge
                        className={
                          proposal.userVote === "for" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }
                      >
                        {proposal.userVote === "for" ? (
                          <ThumbsUp className="w-3 h-3 mr-1" />
                        ) : (
                          <ThumbsDown className="w-3 h-3 mr-1" />
                        )}
                        Voted {proposal.userVote}
                      </Badge>
                      <p className="text-sm text-muted-foreground mt-2">You voted with {proposal.userVotingPower}</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
