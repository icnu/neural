import { FastifyReply, FastifyRequest } from "fastify"
import { Route } from "../routes"
import { loadIdentity } from "../utils"
import { createActor } from "../declarations/token_index_canister";
import { createPublicClient, http, parseAbi } from "viem";
import { sepolia } from "viem/chains";

type CreateTokenIndexRequest = {
    index_canister: string,
    token_contract: `0x${string}`,
}

const erc20Abi = parseAbi([
  'event Transfer(address indexed from, address indexed to, uint256 value)',
  'function balanceOf(address account) view returns (uint256)',
])

async function createTokenIndex(index_canister: string, token_contract: `0x${string}`) {
    const identity = loadIdentity();
    const rpcUrl = process.env.RPC_URL!;

    const actor = createActor(index_canister, {
        agentOptions: { host: 'http://localhost:4943', identity }
    });
    const client = createPublicClient({
        chain: sepolia,
        transport: http(rpcUrl)
    });

    const logs = await client.getLogs({
        address: token_contract,
        event: parseAbi(['event Transfer(address indexed from, address indexed to, uint256 value)'])[0],
        fromBlock: BigInt(0),
        toBlock: 'latest',
    });

    const holders = new Set<string>()
    for (const log of logs) {
        if (log.args.from && log.args.from !== '0x0000000000000000000000000000000000000000') {
        holders.add(log.args.from.toLowerCase())
        }
        if (log.args.to && log.args.to !== '0x0000000000000000000000000000000000000000') {
        holders.add(log.args.to.toLowerCase())
        }
    }

    const balances: Record<string, bigint> = {}
    for (const holder of holders) {
        const balance = await client.readContract({
            address: token_contract,
            abi: erc20Abi,
            functionName: 'balanceOf',
            args: [holder as `0x${string}`],
        })
        if (balance > BigInt(0)) {
            balances[holder] = balance
        }
    }

    for (const holder in balances) {
        await actor.set_token_balance(holder, balances[holder]);
    }
}

async function createTokenIndexHandler(request: FastifyRequest, reply: FastifyReply) {
    const body = request.body as CreateTokenIndexRequest;
    createTokenIndex(body.index_canister, body.token_contract);

    reply.send();
}

const routes: Route[] = [
    {
        path: '/api/token_index',
        method: 'POST',
        options: {
            schema: {
                body: {
                    type: 'object',
                    required: [
                        'index_canister',
                        'token_contract'
                    ],
                    properties: {
                        index_canister: { type: 'string' },
                        token_contract: { type: 'string' }
                    }
                },
                response: {
                    200: {}
                }
            }
        },
        handler: createTokenIndexHandler
    }
]

export default {
    routes
}