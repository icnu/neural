"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, FileText, Code, Plus, Trash2, Info, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { notFound } from "next/navigation"

interface ExecutionParameter {
  name: string
  type: string
  value: string
}

interface ProposalFormData {
  title: string
  description: string
  votingPeriod: string
  executionContract: string
  executionFunction: string
  executionParameters: ExecutionParameter[]
  executionValue: string
}

const parameterTypes = [
  "uint256",
  "int256",
  "address",
  "bool",
  "bytes32",
  "string",
  "bytes",
  "uint8",
  "uint16",
  "uint32",
]

export default function CreateProposalPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [isCreating, setIsCreating] = useState(false)
  const [formData, setFormData] = useState<ProposalFormData>({
    title: "",
    description: "",
    votingPeriod: "7",
    executionContract: "",
    executionFunction: "",
    executionParameters: [],
    executionValue: "0",
  })

  const updateFormData = (field: keyof ProposalFormData, value: string | ExecutionParameter[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const addParameter = () => {
    const newParameter: ExecutionParameter = { name: "", type: "uint256", value: "" }
    updateFormData("executionParameters", [...formData.executionParameters, newParameter])
  }

  const updateParameter = (index: number, field: keyof ExecutionParameter, value: string) => {
    const updatedParameters = formData.executionParameters.map((param, i) =>
      i === index ? { ...param, [field]: value } : param,
    )
    updateFormData("executionParameters", updatedParameters)
  }

  const removeParameter = (index: number) => {
    const updatedParameters = formData.executionParameters.filter((_, i) => i !== index)
    updateFormData("executionParameters", updatedParameters)
  }

  const handleCreateProposal = async () => {
    setIsCreating(true)
    // Simulate proposal creation process
    await new Promise((resolve) => setTimeout(resolve, 2000))
    console.log("[v0] Creating proposal with data:", formData)
    setIsCreating(false)
    // Redirect to the DAO page
    router.push(`/dao/${params.id}`)
  }

  const canCreateProposal = formData.title && formData.description && formData.votingPeriod

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Back Navigation */}
          <Link
            href={`/dao/${params.id}`}
            className="inline-flex items-center text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Link>

          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground">Create New Proposal</h1>
            <p className="text-muted-foreground">Submit a proposal for members to vote on</p>
          </div>

          {/* User Info Card */}
          {/* <Card className="bg-muted/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Your Voting Power</p>
                  <p className="text-lg font-semibold text-foreground">{dao.userVotingPower}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Required to Propose</p>
                  <p className="text-lg font-semibold text-foreground">{dao.proposalThreshold}% of supply</p>
                </div>
                <Badge variant="default" className="bg-green-100 text-green-800">
                  ✓ Eligible to Propose
                </Badge>
              </div>
            </CardContent>
          </Card> */}

          <div className="space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="w-5 h-5" />
                  <span>Proposal Details</span>
                </CardTitle>
                <CardDescription>Provide clear information about your proposal</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Proposal Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Increase Staking Rewards by 2%"
                    value={formData.title}
                    onChange={(e) => updateFormData("title", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Provide a detailed description of your proposal, including background, rationale, and expected outcomes..."
                    rows={8}
                    value={formData.description}
                    onChange={(e) => updateFormData("description", e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Tip: Use markdown formatting for better readability (## for headings, - for lists)
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="votingPeriod">Voting Period</Label>
                  <Select
                    value={formData.votingPeriod}
                    onValueChange={(value) => updateFormData("votingPeriod", value)}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3 days</SelectItem>
                      <SelectItem value="7">7 days</SelectItem>
                      <SelectItem value="14">14 days</SelectItem>
                      <SelectItem value="21">21 days</SelectItem>
                      <SelectItem value="30">30 days</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">How long members will have to vote on this proposal</p>
                </div>
              </CardContent>
            </Card>

            {/* Execution Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Code className="w-5 h-5" />
                  <span>Execution Details</span>
                </CardTitle>
                <CardDescription>
                  Configure the smart contract transaction that will execute if this proposal passes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start space-x-2 p-4 bg-blue-50 rounded-lg">
                  <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-blue-900">Optional but Recommended</p>
                    <p className="text-blue-700">
                      Adding execution details makes your proposal actionable. If approved, the specified transaction
                      will be automatically executed.
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="contract">Contract Address</Label>
                    <Input
                      id="contract"
                      placeholder="0x..."
                      value={formData.executionContract}
                      onChange={(e) => updateFormData("executionContract", e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">The smart contract to interact with</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="function">Function Name</Label>
                    <Input
                      id="function"
                      placeholder="e.g., updateRewardRate"
                      value={formData.executionFunction}
                      onChange={(e) => updateFormData("executionFunction", e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">The function to call on the contract</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Function Parameters</Label>
                    <Button variant="outline" size="sm" onClick={addParameter}>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Parameter
                    </Button>
                  </div>

                  {formData.executionParameters.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Code className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No parameters added yet</p>
                      <p className="text-xs">Click "Add Parameter" to configure function parameters</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {formData.executionParameters.map((param, index) => (
                        <div key={index} className="grid grid-cols-12 gap-3 items-end">
                          <div className="col-span-4">
                            <Label className="text-xs">Parameter Name</Label>
                            <Input
                              placeholder="e.g., newRate"
                              value={param.name}
                              onChange={(e) => updateParameter(index, "name", e.target.value)}
                            />
                          </div>
                          <div className="col-span-3">
                            <Label className="text-xs">Type</Label>
                            <Select value={param.type} onValueChange={(value) => updateParameter(index, "type", value)}>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {parameterTypes.map((type) => (
                                  <SelectItem key={type} value={type}>
                                    {type}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="col-span-4">
                            <Label className="text-xs">Value</Label>
                            <Input
                              placeholder="e.g., 1000"
                              value={param.value}
                              onChange={(e) => updateParameter(index, "value", e.target.value)}
                            />
                          </div>
                          <div className="col-span-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeParameter(index)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="value">ETH Value</Label>
                  <Input
                    id="value"
                    type="number"
                    step="0.001"
                    placeholder="0"
                    value={formData.executionValue}
                    onChange={(e) => updateFormData("executionValue", e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    Amount of ETH to send with the transaction (usually 0)
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Preview */}
            {(formData.title || formData.description) && (
              <Card>
                <CardHeader>
                  <CardTitle>Preview</CardTitle>
                  <CardDescription>How your proposal will appear to voters</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">{formData.title || "Proposal Title"}</h3>
                    <div className="flex items-center space-x-2 mt-2">
                      <Badge className="bg-blue-100 text-blue-800">Active</Badge>
                      <span className="text-sm text-muted-foreground">Voting ends in {formData.votingPeriod} days</span>
                    </div>
                  </div>
                  <Separator />
                  <div className="prose prose-sm max-w-none">
                    <p className="text-muted-foreground whitespace-pre-wrap">
                      {formData.description || "Proposal description will appear here..."}
                    </p>
                  </div>
                  {formData.executionContract && (
                    <>
                      <Separator />
                      <div className="bg-muted p-3 rounded">
                        <p className="text-sm font-medium mb-2">Execution Details</p>
                        <div className="text-xs space-y-1">
                          <p>
                            <span className="text-muted-foreground">Contract:</span> {formData.executionContract}
                          </p>
                          <p>
                            <span className="text-muted-foreground">Function:</span> {formData.executionFunction}
                          </p>
                          <p>
                            <span className="text-muted-foreground">Parameters:</span>{" "}
                            {formData.executionParameters.length} configured
                          </p>
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-between pt-6">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <AlertCircle className="w-4 h-4" />
              <span>Proposals cannot be edited or cancelled once submitted</span>
            </div>
            <Button
              onClick={handleCreateProposal}
              disabled={!canCreateProposal || isCreating}
              className="bg-accent text-accent-foreground hover:bg-accent/90"
            >
              {isCreating ? "Creating Proposal..." : "Submit Proposal"}
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
