import {serve} from 'bun'

class diesel {
    constructor(){
        this.routes = {}
        this.globalMiddlewares = [];
    }

    listen(port,callback){
        const server = serve({
            port,
            fetch: (req) => this.#handleRequest(req),
          });
      
        if (typeof callback === 'function') {
            callback();
          }
          console.log(`Server is running on http://localhost:${port}`);
          return server;
    }

    async #handleRequest(req){
        const { pathname, method } = req;

        const routeKey = `${pathname}-${method}`

        const routeHandler = this.routes[routeKey]

        if (routeHandler) {
            await routeHandler(req)
        }
        req.json({ error: "Not Found" }, { status: 404 });
    }

    #addRoute(method,path,handlers){
        const middlewareHandlers = handlers.slice(0, -1);
        
        const handler = handlers[handlers.length-1]
        this.routes[path]=handler
    }

    get(path,...handlers){
        if (handlers.length>0) {
            return this.#addRoute("GET",path,handlers)
        }
    }

    post(){

    }
}

export default diesel;