import { Principal } from "@dfinity/principal";
import { HttpAgent, Identity } from "@dfinity/agent";
import { SnsGovernanceCanister, SnsNeuron, SnsNeuronId, SnsProposalData, SnsProposalId } from "@dfinity/sns";
import { ulid } from "ulid";

export class GovernanceServiceClass {
    async listLastProposal(canisterId: string): Promise<SnsProposalData> {
        const governance = await SnsGovernanceCanister.create({
            canisterId: Principal.fromText(canisterId)
        });
        const proposals = await governance.listProposals({
            limit: 1
        });

        return proposals.proposals[0];
    }

    async listNeurons(canisterId: string, principal: string): Promise<SnsNeuron[]> {
        const governance = await SnsGovernanceCanister.create({
            canisterId: Principal.fromText(canisterId)
        });
        const neurons = await governance.listNeurons({
            principal: Principal.fromText(principal),
            limit: 10,
        });

        return neurons;
    }

    async vote(canisterId: string, identity: Identity, neuronId: SnsNeuronId, proposalId: SnsProposalId, vote: number) {
        const governance = await SnsGovernanceCanister.create({
            canisterId: Principal.fromText(canisterId),
            agent: await HttpAgent.create({ identity })
        });

        await governance.manageNeuron({
            subaccount: neuronId.id,
            command: [{
                'RegisterVote': {
                    vote, proposal: [proposalId]
                }
            }]
        });
    }
}

export type VoteSession = {
    proposalId: SnsProposalId,
    canisterId: string,
    neuron?: string,
    identity?: Identity
};

export class VoteSessionServiceClass {
    private _voteSessions: Map<string, VoteSession>;

    constructor() {
        this._voteSessions = new Map();
    }

    createVoteSession(data: VoteSession): string {
        const sessionId = ulid();
        this._voteSessions.set(sessionId, data);
        return sessionId;
    }

    resolveVoteSession(id: string): VoteSession | undefined {
        return this._voteSessions.get(id);
    }
}

export const GovernanceService = new GovernanceServiceClass();
export const VoteSessionService = new VoteSessionServiceClass();