import { FastifyInstance, FastifyPluginCallback, RouteHandlerMethod, RouteShorthandOptions } from "fastify";
import { User } from "./user";

export type Route = {
    path: string,
    method: string,
    options: RouteShorthandOptions,
    handler: RouteHandlerMethod
};

const _routes: Route[] = [
    ...User.routes
];

export const router: FastifyPluginCallback<{}> = (server: FastifyInstance) => {
    _routes.forEach(route => {
        switch (route.method.toLowerCase()) {
            case 'get':
                server.get(route.path, route.options, route.handler);
                break;
            
            case 'post':
                server.post(route.path, route.options, route.handler);
                break;
        }
    });
}