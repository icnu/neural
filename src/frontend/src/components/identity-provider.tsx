'use client';

import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";
import { SignIdentity } from '@dfinity/agent';
import { AuthClient, IdbStorage } from '@dfinity/auth-client';
import { createConfig, http, useAccount, useConnect, useSignMessage, WagmiProvider } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';
import { metaMask } from 'wagmi/connectors';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Ed25519KeyIdentity } from "@dfinity/identity";

type IdentityContextType = {
    identity: SignIdentity | undefined;
    login: (type: 'metamask' | 'internet-identity') => void;
    isLoggingIn: boolean;
    isLoggedIn: boolean;
};

const IdentityContext = createContext<IdentityContextType>({
    identity: undefined,
    login: (type: 'metamask' | 'internet-identity') => {},
    isLoggedIn: false,
    isLoggingIn: false
});

const wagmiConfig = createConfig({
  chains: [mainnet, sepolia],
  connectors: [metaMask()],
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
})

const queryClient = new QueryClient();
const storage = new IdbStorage();
const KEY_EPHEMERAL_SIGN_IDENTITY = 'neural_sign_identity';

function IdentityProviderInner({ children }: { children: ReactNode }) {
    const { connectAsync, isPending, isSuccess } = useConnect();
    const { address } = useAccount();
    const { signMessageAsync } = useSignMessage();
    const [ isConnecting, setIsConnecting ] = useState<boolean>(false);
    const [ ii, setII ] = useState<{ client: AuthClient, isAuthenticated: boolean} | undefined>(undefined);
    const [ identity, setIdentity ] = useState<Ed25519KeyIdentity | undefined>(undefined);

    const isLoggedIn = !!((isSuccess && address) || ii?.isAuthenticated);

    const login = useCallback(async (type: 'metamask' | 'internet-identity') => {
        if ( !identity ) return;
        setIsConnecting(true);

        if ( type == 'metamask' ) {
            const result = await connectAsync({ connector: metaMask() });
            // fetch sign message
            // signMessageAsync

            setIsConnecting(false);
        } else {
            if ( !ii ) return;

            await ii.client.login({
                identityProvider: "https://identity.ic0.app/",
                onSuccess: async () => {
                    setII({ client: ii.client, isAuthenticated: await ii.client.isAuthenticated() });
                    setIsConnecting(false);
                },
            });
        }
    }, [identity, setIsConnecting, connectAsync, ii, setII, signMessageAsync]);

    const init = async () => {
        let identity: Ed25519KeyIdentity;
        const existingIdentity = await storage.get(KEY_EPHEMERAL_SIGN_IDENTITY);
        if (!existingIdentity) {
            identity = Ed25519KeyIdentity.generate();
            const json = JSON.stringify(identity.toJSON());
            await storage.set(KEY_EPHEMERAL_SIGN_IDENTITY, json);
        } else {
            identity = Ed25519KeyIdentity.fromJSON(existingIdentity);
        }

        const authClient = await AuthClient.create({
            keyType: "Ed25519",
            storage,
            identity: identity,
        });
        const isAuthenticated = await authClient.isAuthenticated();

        setII({ client: authClient, isAuthenticated });
        setIdentity(identity);
    }

    useEffect(() => {
        init();
    }, []);

    return (
        <IdentityContext.Provider
            value={{
                identity,
                login,
                isLoggingIn: isConnecting,
                isLoggedIn
            }}
            >
            { children }
        </IdentityContext.Provider>
    );
}

export function IdentityProvider({ children }: { children: ReactNode }) {
    return (
        <WagmiProvider config={wagmiConfig}>
            <QueryClientProvider client={queryClient}>
                <IdentityProviderInner>
                    { children }
                </IdentityProviderInner>
            </QueryClientProvider>
        </WagmiProvider>
    );
}

export function useIdentityProvider() {
    return useContext(IdentityContext);
}