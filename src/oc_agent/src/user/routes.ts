import { FastifyReply, FastifyRequest } from "fastify"
import { Route } from "../routes"
import { TokenService } from "../token";
import { UserService } from "./service";

type UserDataRequest = {
    principal: string,
    private_key_data: string,
    delegation_data: string,
}

async function handleUserDataForToken(request: FastifyRequest, reply: FastifyReply) {
    const user_data = request.body as UserDataRequest;
    const token: string = (request.query as any).token;

    const discord_id = await TokenService.get_user_from_token(token);
    await UserService.store_user_details(discord_id, user_data);

    reply.send({ status: true });
}

const routes: Route[] = [
    {
        path: '/api/token_auth',
        method: 'POST',
        options: {
            schema: {
                body: {
                    type: 'object',
                    required: [
                        'principal',
                        'private_key_data',
                        'delegation_data'
                    ],
                    properties: {
                        principal: { type: 'string' },
                        private_key_data: { type: 'string' },
                        delegation_data: { type: 'string' }
                    }
                },
                querystring: {
                    type: 'object',
                    required: ['token'],
                    properties: {
                        token: { type: 'string' }
                    }
                },
                response: {
                    200: {
                        type: 'object',
                        properties: {
                            status: { type: 'boolean' }
                        }
                    }
                }
            }
        },
        handler: handleUserDataForToken
    }
]

export default {
    routes
}