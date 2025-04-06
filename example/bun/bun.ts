import type { BunRequest, Server } from "bun";


function BunRoute(...handlers:any[]){

    return async (req:BunRequest,server:Server) => {
        const url = new URL(req.url);
        for (const handler of handlers){
           return await handler(req, url, server);
        }
    }
}

Bun.serve({
    routes:{
        '/': BunRoute(
            (req:BunRequest, url:URL, server:Server) => {
                return new Response("Hello World")
            }
        )
    }
})