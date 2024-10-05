import {serve} from 'bun'
import ResponseHandler from './responseHandler.js';

class diesel {
    constructor(){
        this.routes = new Map()
        this.globalMiddlewares = [];
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
        if (routeHandler) {
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

           await routeHandler(context)

           if (response.response) {
            return response.response
           } 

           return new Response("no response from this handler!")

        } else {
            return new Response("route not found")
        }
        
    }

    #addRoute(method,path,handlers){
        const routeKey = `${path}-${method}`

        const middlewareHandlers = handlers.slice(0, -1);
        
        const handler = handlers[handlers.length-1]
        this.routes.set(routeKey,handler)
        
    }

    get(path,...handlers){
        if (handlers.length>0) {
            return this.#addRoute("GET",path,handlers)
        }
    }

    post(path,...handlers){
        if (handlers.length>0) {
            return this.#addRoute("POST",path,handlers)
        }
    }

    put(path,...handlers){
        if (handlers.length>0) {
            return this.#addRoute("PUT",path,handlers)
        }
    }

    patch(path,...handlers){
        if (handlers.length>0) {
            return this.#addRoute("PATCH",path,handlers)
        }
    }

    delete(path,...handlers){
        if (handlers.length>0) {
            return this.#addRoute("DELETE",path,handlers)
        }
    }

}



export default diesel;