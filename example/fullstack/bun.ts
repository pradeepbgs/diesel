import type { BunRequest, Server } from "bun";

const logger = async (req:BunRequest):Promise<undefined> => {
    console.log(`Request from: ${req.url}`);
};

const hello = ():Response => {
    return new Response("Hello World! from handler /");
};

type handlerFunc = (req: BunRequest, server: Server, url: URL) => Response | null | void | undefined | Promise<Response | undefined>

const giveHandlers = (...handlers: handlerFunc[]) => {
    return async (req: BunRequest, server: Server, url: URL) => {
        for (const handler of handlers) {
            const response = await handler(req, server, url);
            if (response) return response;
        }
    }
}

Bun.serve({
    routes: {
        "/": giveHandlers(logger, hello),
        "/hello": () => new Response("Hello World! from /hello"),
    }
});
