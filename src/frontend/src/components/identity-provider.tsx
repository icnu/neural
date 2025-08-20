'use client';

import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";
import { Identity, SignIdentity } from '@dfinity/agent';
import { AuthClient, IdbStorage } from '@dfinity/auth-client';
import { createConfig, http, useAccount, useConnect, useSignMessage, WagmiProvider } from 'wagmi';
import { mainnet, sepolia } from 'wagmi/chains';
import { metaMask } from 'wagmi/connectors';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Ed25519KeyIdentity } from "@dfinity/identity";
import { createActor } from "@/declarations/identity_canister";

type IdentityContextType = {
    identity: SignIdentity | undefined;
    login: (type: 'metamask' | 'internet-identity') => void;
    logout: () => void;
    isLoggingIn: boolean;
    isLoggedIn: boolean;
};

const IdentityContext = createContext<IdentityContextType>({
    identity: undefined,
    login: (type: 'metamask' | 'internet-identity') => {},
    logout: () => {},
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

function generateEphemeralIdentity(): Ed25519KeyIdentity {
    return Ed25519KeyIdentity.generate();
}

async function saveIdentity(identity: Ed25519KeyIdentity) {
    const json = JSON.stringify(identity.toJSON());
    await storage.set(KEY_EPHEMERAL_SIGN_IDENTITY, json);
}

async function loadIdentity(): Promise<Ed25519KeyIdentity | undefined> {
    let json = await storage.get(KEY_EPHEMERAL_SIGN_IDENTITY);
    return json ? Ed25519KeyIdentity.fromJSON(json) : undefined;
}

async function resetIdentity() {
    await storage.remove(KEY_EPHEMERAL_SIGN_IDENTITY);
}

export async function getEthAddress(identity: Identity): Promise<string> {
    const actor = createActor(process.env.NEXT_PUBLIC_CANISTER_ID_IDENTITY_CANISTER!, {
                    agentOptions: { host: 'http://localhost:4943', identity, verifyQuerySignatures: false, shouldFetchRootKey: false }
                });
    
    return await actor.get_address(identity.getPrincipal());
}

function IdentityProviderInner({ children }: { children: ReactNode }) {
    const { connectAsync } = useConnect();
    const { signMessageAsync } = useSignMessage();

    const [ isConnecting, setIsConnecting ] = useState<boolean>(false);
    const [ identity, setIdentity ] = useState<Ed25519KeyIdentity | undefined>(undefined);

    const isLoggedIn = !!identity;

    const login = useCallback(async (type: 'metamask' | 'internet-identity') => {
        setIsConnecting(true);
        let identity_ = identity ? identity : generateEphemeralIdentity();

        if ( type == 'metamask' ) {
            const result = await connectAsync({ connector: metaMask() });
            if ( result.accounts.length > 0 ) {
                const actor = createActor(process.env.NEXT_PUBLIC_CANISTER_ID_IDENTITY_CANISTER!, {
                    agentOptions: { host: 'http://localhost:4943', identity, verifyQuerySignatures: false, shouldFetchRootKey: false }
                });
                const loginMessage = await actor.get_login_message(result.accounts[0]);
                const signature = await signMessageAsync({ account: result.accounts[0], message: loginMessage });

                await actor.login(result.accounts[0], signature);
            }

            setIsConnecting(false);
        } else {
            const authClient = await AuthClient.create({
                keyType: "Ed25519",
                storage,
                identity: identity_,
            });

            await authClient.login({
                identityProvider: "https://identity.ic0.app/",
                onSuccess: async () => {
                    if (!identity) saveIdentity(identity_);
                    setIsConnecting(false);
                },
            });
        }

        if (!identity) saveIdentity(identity_);
        setIdentity(identity_);
        console.log(identity_.getPrincipal().toText());
    }, [identity, setIsConnecting, connectAsync, signMessageAsync]);

    const logout = useCallback(async () => {
        await resetIdentity();
        setIdentity(undefined);
    }, [setIdentity]);

    const init = async () => {
        const identity_ = await loadIdentity();
        if (identity_) setIdentity(identity_);
    }

    useEffect(() => {
        init();
    }, []);

    return (
        <IdentityContext.Provider
            value={{
                identity,
                login,
                logout,
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