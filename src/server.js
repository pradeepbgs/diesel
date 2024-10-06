import {serve} from 'bun'
import ResponseHandler from './responseHandler.js';

class diesel {
    constructor(){
        this.routes = new Map()
        this.globalMiddlewares = [];
        this.middlewares = new Map()
    }

    listen(port,callback){
        const server = serve({
            port,
            fetch: (req) => {
                const url = new  URL(req.url)
                return this.#handleRequest(req,url)
            }
          });
        if (typeof callback === 'function') {
            callback();
          }
          console.log(`Server is running on http://localhost:${port}`);
          return server;
    }

    async #handleRequest(req,url){
        const { pathname } = url;
        const {method} = req

        const routeKey = `${pathname}-${method}`

        const routeHandler = this.routes.get(routeKey)
        const response = new ResponseHandler()

        const context = {
            req,
            text(data,status = 200){
                return response.text(data,status)
            },
            json(data,status = 200){
                return response.json(data,status)
            },
            file(data){
                return response.file(data)
            },
            redirect(path,status = 302){
                return response.redirect(path,status)
            }
        }

        const middlewares = [
            ...(this.globalMiddlewares),
            ...(this.middlewares.get(pathname) || [])
        ]

       await executeMiddleware(middlewares,context)

       if (response.response) {
        return response.response
       } 

        if (routeHandler) {

           await routeHandler(context)

           if (response.response) {
            return response.response
           } 

           return new Response("no response from this handler!")

        } 
        return new Response("Route not found", { status: 404 });
        
    }

    #addRoute(method,path,handlers){
        const routeKey = `${path}-${method}`
        
        const middlewareHandlers = handlers.slice(0, -1);

        if (!this.middlewares.has(path)) {
            this.middlewares.set(path,[])
        }
        if (path === '/') {
            // we will add all midl to global midl
            if (!this.globalMiddlewares.includes(...middlewareHandlers)) {
                this.globalMiddlewares.push(...middlewareHandlers)
            }
        } else {
            if (!this.middlewares.get(path).includes(...middlewareHandlers)) {
                this.middlewares.get(path).push(...middlewareHandlers);
            }
        }

        const handler = handlers[handlers.length-1]
        this.routes.set(routeKey,handler)
        
    }

    get(path,...handlers){
            return this.#addRoute("GET",path,handlers)
    }

    post(path,...handlers){
            return this.#addRoute("POST",path,handlers)
    }

    put(path,...handlers){
            return this.#addRoute("PUT",path,handlers)
    }

    patch(path,...handlers){
        if (handlers.length>0) {
            return this.#addRoute("PATCH",path,handlers)
        }
    }

    delete(path,...handlers){
            return this.#addRoute("DELETE",path,handlers)
    }

}


async function executeMiddleware(middlewares,context){
    for(const middleware of middlewares){
        await middleware(context)
    }
    return null;
}

export default diesel;