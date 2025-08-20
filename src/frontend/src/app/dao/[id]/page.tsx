"use client";

import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, FileText, Plus, ArrowLeft, Clock, CheckCircle, XCircle } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { createActor as createDaoActor } from "@/declarations/dao_canister";
import { createActor as createVoteActor } from "@/declarations/vote_canister";
import { Identity } from "@dfinity/agent";
import { getEthAddress, useIdentityProvider } from "@/components/identity-provider";
import { useEffect, useState } from "react";
import { createActor as createTokenActor } from "@/declarations/token_index_canister";

type DAO = {
  id: string,
  name: string,
  logo: string,
  totalSupply: bigint,
  proposalCount: number
  votingPower: bigint,
  executionAddress: string,
  proposals: Proposal[]
}

type Proposal = {
  id: string,
  title: string,
  description: string,
  status: 'passed' | 'rejected' | 'active',
  votesFor: bigint,
  votesAgainst: bigint,
  totalVotes: bigint,
}

async function loadDAO(canister: string, identity: Identity): Promise<DAO> {
  const daoActor = createDaoActor(canister, { agentOptions: { host: 'http://localhost:4943', identity, verifyQuerySignatures: false, shouldFetchRootKey: false } });
  const metadata = await daoActor.get_metadata();
  const executionAddress = await daoActor.get_execution_address();
  const ethAddress = await getEthAddress(identity);
  const proposals: Proposal[] = [];
  let votingPower = BigInt(0);

  if ( metadata.token[0] ) {
    const tokenActor = createTokenActor(metadata.token[0], { agentOptions: { host: 'http://localhost:4943', identity, verifyQuerySignatures: false, shouldFetchRootKey: false } });
    votingPower = (await tokenActor.get_token_balance(ethAddress))[0] ?? votingPower;
  }

  for ( let i = 1; i < 5; i++ ) {
    const proposal = await daoActor.get_proposal(BigInt(i));
    if ( proposal.length == 0 ) break;

    const voteActor = await createVoteActor(proposal[0].vote_canister[0]!, { agentOptions: { host: 'http://localhost:4943', identity, verifyQuerySignatures: false, shouldFetchRootKey: false } });
    const voteData = await voteActor.get_metadata();

    let isVotingClosed = 'VotingClosed' in proposal[0].state;
    let isVoteAccepted = proposal[0].verdict[0] ? 'ACCEPTED' in proposal[0].verdict[0] : false;

    proposals.push({
      id: proposal[0].vote_canister[0]!,
      title: proposal[0].title,
      description: proposal[0].description,
      status: isVotingClosed ? (isVoteAccepted ? 'passed' : 'rejected') : 'active',
      votesFor: voteData.vote_accept,
      votesAgainst: voteData.vote_reject,
      totalVotes: votingPower,
    });
  }

  return {
    id: canister,
    name: metadata.name[0] ?? '',
    logo: metadata.logo[0] ?? '/placeholder.png',
    totalSupply: votingPower,
    proposalCount: proposals.length,
    votingPower: votingPower,
    executionAddress: executionAddress,
    proposals: proposals
  };
}

function ProposalCard({ proposal }: { proposal: Proposal }) {
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

  const votesFor = Number.parseInt(proposal.votesFor.toString());
  const votesTotal = Number.parseInt(proposal.totalVotes.toString());
  const votePercentage = proposal.totalVotes > 0 ? (votesFor / votesTotal) * 100 : 0

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
              <div className="bg-chart-2 h-2 rounded-full transition-all" style={{ width: `${votePercentage}%` }} />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{proposal.votesFor.toLocaleString()} For</span>
              <span>{proposal.votesAgainst.toLocaleString()} Against</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

export default function DAODetailPage({ params }: { params: { id: string } }) {
  const { identity } = useIdentityProvider();
  const [dao, setDao] = useState<DAO | undefined>(undefined);

  useEffect(() => {
    if ( !identity ) return;
    loadDAO(params.id, identity).then(d => setDao(d));
  }, [identity]);

  if (!dao) {
    return <></>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Back Navigation */}
          <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Active DAOs
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

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="flex items-center space-x-3">
                <Users className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="text-lg font-semibold text-card-foreground">{dao.totalSupply.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Total Supply</p>
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
                  <p className="text-sm text-muted-foreground">Your Balance</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-xs text-white font-bold">MS</span>
                </div>
                <div>
                  <p className="text-sm font-mono text-card-foreground">
                    {dao.executionAddress.slice(0, 6)}...{dao.executionAddress.slice(-4)}
                  </p>
                  <p className="text-sm text-muted-foreground">Execution Address</p>
                </div>
              </div>
            </div>
          </div>

          {/* Proposals Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-foreground">Proposals</h2>
              <div className="flex items-center space-x-2">
                <Badge variant="outline">{dao.proposalCount} Total</Badge>
                <Badge variant="outline" className="bg-blue-50 text-blue-700">
                  {dao.proposals.filter((p) => p.status === "active").length} Active
                </Badge>
              </div>
            </div>

            {dao.proposals.length > 0 ? (
              <div className="grid gap-6">
                {dao.proposals.map((proposal) => (
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
