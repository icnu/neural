'use client'

import { SiweIdentityProvider } from "ic-siwe-js/react"
import { ReactNode } from "react"
import { createConfig, http, WagmiProvider } from 'wagmi'
import { mainnet, sepolia } from 'wagmi/chains'
import { metaMask } from 'wagmi/connectors'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export const config = createConfig({
  chains: [mainnet, sepolia],
  connectors: [metaMask()],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
})

const queryClient = new QueryClient();

export default function SiweProviderWrapper({ children }: { children: ReactNode }) {
    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <SiweIdentityProvider canisterId="aaaa-aa">
                    {children}
                </SiweIdentityProvider>
            </QueryClientProvider>
        </WagmiProvider>
    )
}