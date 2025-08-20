"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Wallet, LogOut } from "lucide-react"
import { useIdentityProvider } from "./identity-provider"

export function Header() {
  const { login, identity, isLoggedIn, logout } = useIdentityProvider();
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const user = isLoggedIn && identity ? identity.getPrincipal().toString() : undefined;

  const connectMetaMask = async () => {
    login('metamask');
  }

  const connectInternetIdentity = async () => {
    login('internet-identity');
  }

  const disconnect = () => {
    logout();
  }

  const formatAddress = (address: string) => {
    if (address.length > 10) {
      return `${address.slice(0, 6)}...${address.slice(-4)}`
    }
    return address
  }

  return (
    <header className="border-b border-border bg-background">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">DAO</span>
            </div>
            <h1 className="text-xl font-bold text-foreground">Neural</h1>
          </div>

          <nav className="hidden md:flex items-center space-x-6">
          </nav>

          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-2 bg-muted px-3 py-2 rounded-lg">
                  <Wallet className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-foreground">{formatAddress(user)}</span>
                  {/* <span className="text-xs text-muted-foreground">
                    ({user.method === "metamask" ? "MetaMask" : "II"})
                  </span> */}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={disconnect}
                  className="text-destructive hover:text-destructive bg-transparent"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
                    <Wallet className="w-4 h-4 mr-2" />
                    Connect Wallet
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Connect Your Wallet</DialogTitle>
                    <DialogDescription>Choose your preferred method to connect and access your DAOs.</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 pt-4">
                    <Button
                      onClick={connectMetaMask}
                      className="w-full justify-start bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      <Wallet className="w-5 h-5 mr-3" />
                      Connect with MetaMask
                    </Button>
                    <Button
                      onClick={connectInternetIdentity}
                      variant="outline"
                      className="w-full justify-start bg-transparent"
                    >
                      <Wallet className="w-5 h-5 mr-3" />
                      Connect with Internet Identity
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
