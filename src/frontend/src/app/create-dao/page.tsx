"use client"

import type React from "react"

import { useState } from "react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Upload, Info, CreditCard, CheckCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface DAOFormData {
  name: string
  description: string
  logo: string
  tokenAddress: string
  votingAlgorithm: string
}

const votingAlgorithms = ["Simple Majority", "Quadratic Voting", "Weighted Voting", "Conviction Voting"]

export default function CreateDAOPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isCreating, setIsCreating] = useState(false)
  const [formData, setFormData] = useState<DAOFormData>({
    name: "",
    description: "",
    logo: "",
    tokenAddress: "",
    votingAlgorithm: "",
  })

  const updateFormData = (field: keyof DAOFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // In a real app, you would upload to a service like Vercel Blob
      const mockUrl = `/placeholder.svg?height=100&width=100&query=${encodeURIComponent(formData.name + " logo")}`
      updateFormData("logo", mockUrl)
    }
  }

  const handleCreateDAO = async () => {
    setIsCreating(true)
    // Simulate DAO creation process
    await new Promise((resolve) => setTimeout(resolve, 3000))
    console.log("[v0] Creating DAO with data:", formData)
    setIsCreating(false)
    // Redirect to the new DAO page
    router.push("/dao/new-dao-id")
  }

  const canProceedToStep2 = formData.name && formData.description && formData.tokenAddress && formData.votingAlgorithm

  const steps = [
    { number: 1, title: "DAO Details", icon: Info },
    { number: 2, title: "Payment", icon: CreditCard },
    { number: 3, title: "Complete", icon: CheckCircle },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Back Navigation */}
          <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to My DAOs
          </Link>

          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-foreground">Create New DAO</h1>
            <p className="text-muted-foreground">Set up your decentralized autonomous organization</p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center space-x-4">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                    currentStep >= step.number
                      ? "bg-accent text-accent-foreground border-accent"
                      : "bg-background text-muted-foreground border-border"
                  }`}
                >
                  <step.icon className="w-4 h-4" />
                </div>
                <span
                  className={`ml-2 text-sm font-medium ${
                    currentStep >= step.number ? "text-foreground" : "text-muted-foreground"
                  }`}
                >
                  {step.title}
                </span>
                {index < steps.length - 1 && <div className="w-8 h-px bg-border ml-4" />}
              </div>
            ))}
          </div>

          {/* Form Steps */}
          <div className="space-y-6">
            {currentStep === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Info className="w-5 h-5" />
                    <span>DAO Details</span>
                  </CardTitle>
                  <CardDescription>Basic information about your DAO</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">DAO Name *</Label>
                      <Input
                        id="name"
                        placeholder="e.g., DeFi Governance DAO"
                        value={formData.name}
                        onChange={(e) => updateFormData("name", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description *</Label>
                      <Textarea
                        id="description"
                        placeholder="Describe your DAO's mission and goals..."
                        rows={4}
                        value={formData.description}
                        onChange={(e) => updateFormData("description", e.target.value)}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="logo">DAO Logo</Label>
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
                          {formData.logo ? (
                            <img
                              src={formData.logo || "/placeholder.svg"}
                              alt="DAO Logo"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Upload className="w-6 h-6 text-muted-foreground" />
                          )}
                        </div>
                        <div>
                          <Input
                            id="logo"
                            type="file"
                            accept="image/*"
                            onChange={handleLogoUpload}
                            className="hidden"
                          />
                          <Button
                            variant="outline"
                            onClick={() => document.getElementById("logo")?.click()}
                            className="mb-2"
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            Upload Logo
                          </Button>
                          <p className="text-xs text-muted-foreground">PNG, JPG up to 2MB</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tokenAddress">Token Address *</Label>
                      <Input
                        id="tokenAddress"
                        placeholder="0x..."
                        value={formData.tokenAddress}
                        onChange={(e) => updateFormData("tokenAddress", e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">Address of the token used for voting</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="votingAlgorithm">Voting Algorithm *</Label>
                      <Select
                        value={formData.votingAlgorithm}
                        onValueChange={(value) => updateFormData("votingAlgorithm", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select voting algorithm" />
                        </SelectTrigger>
                        <SelectContent>
                          {votingAlgorithms.map((algorithm) => (
                            <SelectItem key={algorithm} value={algorithm}>
                              {algorithm}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {currentStep === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CreditCard className="w-5 h-5" />
                    <span>Payment</span>
                  </CardTitle>
                  <CardDescription>Pay the creation fee to deploy your DAO</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="p-6 bg-muted rounded-lg">
                    <h4 className="font-medium text-foreground mb-4">DAO Creation Fee</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">DAO Setup & Deployment:</span>
                        <span>5.0 ICP</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Multisig Creation:</span>
                        <span>2.0 ICP</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Platform Fee:</span>
                        <span>1.0 ICP</span>
                      </div>
                      <hr className="border-border" />
                      <div className="flex justify-between font-medium">
                        <span>Total:</span>
                        <span>8.0 ICP</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h5 className="font-medium text-blue-900 mb-2">What you get:</h5>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Fully deployed DAO smart contract</li>
                      <li>• Automatic multisig wallet creation</li>
                      <li>• Governance token integration</li>
                      <li>• Proposal and voting system</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            )}

            {currentStep === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5" />
                    <span>Review & Create</span>
                  </CardTitle>
                  <CardDescription>Review your DAO details before final creation</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
                        {formData.logo ? (
                          <img
                            src={formData.logo || "/placeholder.svg"}
                            alt="DAO Logo"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Upload className="w-6 h-6 text-muted-foreground" />
                        )}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold">{formData.name}</h3>
                        <Badge variant="outline">{formData.votingAlgorithm}</Badge>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium">Description</h4>
                      <p className="text-sm text-muted-foreground">{formData.description}</p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium">Token Address</h4>
                      <p className="text-sm font-mono bg-muted p-2 rounded">{formData.tokenAddress}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
            >
              Previous
            </Button>

            <div className="flex items-center space-x-2">
              {currentStep < 3 ? (
                <Button
                  onClick={() => setCurrentStep(currentStep + 1)}
                  disabled={currentStep === 1 && !canProceedToStep2}
                  className="bg-accent text-accent-foreground hover:bg-accent/90"
                >
                  Next
                </Button>
              ) : (
                <Button
                  onClick={handleCreateDAO}
                  disabled={!canProceedToStep2 || isCreating}
                  className="bg-accent text-accent-foreground hover:bg-accent/90"
                >
                  {isCreating ? "Creating DAO..." : "Create DAO"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
