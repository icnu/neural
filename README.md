# Neural

_This project is a part of series of projects, **Neural** for WCHL 2025, meant to make the ICP DAO capabilities accessible to organizations outside ICP. The goal is to establish ICP as the de-facto DAO platform for any needs._

Voting on SNS proposals, Stake-aware Access Controls, Enhanced Community Collaboration, all through Discord now!

This project enables seamless, secure, and privacy-conscious voting on Internet Computer’s SNS (Service Nervous System) proposals directly within Discord. It leverages Internet Identity, VetKeys and TEEs to make the entire user-flow completely secure. Designed with extensibility in mind, the system also lays the foundation for advanced community features such as stake-aware access control and enhanced governance workflows — turning Discord into a robust platform for decentralized decision-making and engagement.

[Demo Video](https://youtu.be/dUQh-IkHy70) &nbsp; [Pitch Deck](https://drive.google.com/file/d/1qW7-CRB6_LgfBYmMXB7KT_abk2aB5U_x/view?usp=sharing)

## Features
- Fully on-chain governance layer
- Gasless decentralized voting using ICP's reverse gas model
- Truly decentralized cross-chain infrastructure
- Native integration for multi-chain transaction execution
- Bridges gap between stakeholders & governance
- Auditable, scalable & secure

## How does it work?

- Enter some basic details about your DAO
- Enter the governance token smart contracts address.
- Choose a voting strategy.
- Deposit as stake.
- You're done! You can now create and vote on proposals for your newly created DAO.
- To vote, just login with Metamask or Internet Identity and start voting!

## ICP Features Used

- VetKeys - in Registry Canister, for encrypted state
- Chain Fusion - for transaction execution in DAO Canister
  - HTTP Outcalls
  - Threshold ECDSA

## Architecture

<img width="2958" height="1658" alt="image" src="https://github.com/user-attachments/assets/02db407c-602f-4eb7-a32d-28a7aba02e2d" />

The project has 6 components:
- **Token Index Canister:** This canister provides an index of addresses and balances of an ERC20 token, with snapshotting support.
- **Identity Canister:** This canister provides federated identity across chains and wallets, and provides a seamless experience for the users.
- **Hub Canister:** This canister acts as an orchestrator for DAO Canisters, and provides WASM storage for dynamically deployed Vote and DAO canisters. It handles upgrades and cycles management.
- **DAO Canister:** This canister represents an individual DAO. It uses one or more Token Index Canisters to support creating and voting on proposals.
- **Vote Canister:** Vote Canister manages an individual proposal voting and has customizable voting strategies.
- **Registry Canister:** This canister is a clone of the Encrypted Maps canister. It stores the encrypted User Identity data, and verifies the TEE Attestations through a handshake process for access to encrypted values.
- **Proxy Agent:** The off-chain component responsible for establishing websocket communication with Discord servers. Also securely handles the storage of user identity. It runs in a Nitro TEE Enclave for trust. The proxy agent also multiplexes as a feeder for the Token Index Canister.
- **Frontend Canister**

_Note: TEEs have been avoided for this hackathon project because of the high costs. In production, we'll use OracleKit's [nitro-tee-kit](https://github.com/OracleKit/nitro-tee-kit) and [nitro-tee-attestation](https://github.com/OracleKit/nitro-tee-attestation)_

The project uses the following external components:
- **SNS Aggregator:** For up-to-date SNS data
- **Internet Identity:** For authentication
- **EVM / SOL RPC Canister:** For transaction execution

## Security & Scaling

Sensitive data are all encrypted and stored in the Registry Canister using VetKeys on ICP. The Registry Canister grants access to the keys, only to the Proxy Agent by verifying the Nitro TEE Attestations, and matching the running image hash to the last release. This ensures the sensitive data is not exposed in any way.

The project is highly scalable and cost efficient, and with a few tweaks, can be horizontally scaled over multiple subnets. The major bottlenecks in our competitors is in the Token Index management. We have specifically engineered the Token Index canister and it's snapshotting functionality to support the biggest DAOs on cryptos - **200K+ token holders**. While not at the finest, it will get polished over the next few rounds.

## Deployed Canisters
- Hub Canister: [f2rvu-aiaaa-aaaai-q327q-cai](https://dashboard.internetcomputer.org/canister/f2rvu-aiaaa-aaaai-q327q-cai)
- Identity Canister: [f5qta-nqaaa-aaaai-q327a-cai](https://dashboard.internetcomputer.org/canister/f5qta-nqaaa-aaaai-q327a-cai)
- Registry Canister: [bs7kw-uiaaa-aaaam-aenqq-cai](https://dashboard.internetcomputer.org/canister/bs7kw-uiaaa-aaaam-aenqq-cai)
- Frontend Canister*: [bv6mc-zqaaa-aaaam-aenqa-cai](https://dashboard.internetcomputer.org/canister/bv6mc-zqaaa-aaaam-aenqa-cai)

_*Note: Due to limited availability of static exports, in Next.js App Router, we have only partially deployed the frontend._

## Local Setup

Requirements:
- Bash shell
- Node.js (>=16.0.0) with pnpm
- Rust

Create a `.env` file with the following contents:
```bash
DISCORD_BOT_TOKEN=
DISCORD_BOT_CLIENT_ID=
FRONTEND_URL=
VITE_DISCORD_PROXY_HOSTNAME=http://localhost:3000
REGISTRY_CANISTER_ICP_NETWORK_URL=http://localhost:4943
RPC_URL= # your ETH JSON RPC URL
DFX_NETWORK=ic
```
Fill your Discord bot client id and token, and the frontend url (either deployed asset canister or vite local instance url).

Then create a `src/discord-proxy/private-key.json` file with the output of the following script:
```js
import { Ed25519KeyIdentity } from '@dfinity/identity';
console.log(JSON.stringify(Ed25519KeyIdentity.generate().toJSON()))
```
This creates a random identity for the `discord-proxy` component, to securely access VetKeys.

To start the project locally, run:
```bash 
dfx start --background --clean
npm run setup
npm run deploy:identity
npm run deploy:registry
npm run deploy:hub
npm run start:proxy
npm run start:frontend
```

## Problems Faced

**Limited availability of static exports in Next.js App Router leading to difficulty in deploying frontend on-chain.**

Next.js provides features that makes building multi-page frontend apps easy. But sadly these features do not support static export and thus hinders on-chain deployment on ICP's Asset Canister. We have only partially deployed the frontend, but in future rounds will shift to a different framework and deploy.


## About Neural

Neural is a larger project that aims to reimagine Decentralized Governance for everyone. In chains outside ICP ecosystem like Ethereum, Solana, Aptos, because of the high gas costs and slow transactions, the DAO ecosystem is mostly on centralized voting and governance apps. This creates a paradox where DAOs that came with the promise of decentralization are themselves centralized.

The vision of Neural is to use ICP to provide a chain-agnostic DAO Governance Layer, that is not gas-heavy yet on-chain and auditable, and close to where the people actually are - Discord, Telegram and Discourse Forums. With Neural, DAOs across all chains can become truly on-chain just at a fraction of the current cost of providers and no compromise in user experience. This will make ICP the heart of DAOs, in-turn entire Web3 ecosystem.

## Roadmap
### :white_check_mark: Neuron Bot - Governance where the people are
A Discord Bot that allows governance for ICP SNS DAOs from within the Discord app. The architecture could be extended to other centralized communication platforms like Telegram, Discourse Forums, etc and bring the governance layer closer to where people talk.

### :white_check_mark: Neural Hub
The cross-chain governance layer for DAOs that works across Ethereum, Solana, ICP and Aptos. Completely on-chain and auditable voting and proposals with native chain support for Ethereum.  

### :large_blue_circle: Extending Neural Hub
Adding support for more chains - Solana, Aptos, Integrating the native voting strategies for easier migration, and 3rd party multisigs - Gnosis Safe, Orbit for decentralized transaction execution. Finding product-market fit, growth and monetization strategy.
