import {serve} from 'bun'
import Trie from './trie.js';
import handleRequest  from './handleRequest.js'

class diesel {
    constructor(){
        this.routes = new Map()
        this.globalMiddlewares = [];
        this.middlewares = new Map()
        this.trie = new Trie()
    }

    listen(port,callback){
        const server = serve({
            port,
            fetch: (req) => {
                const url = new  URL(req.url)
                return handleRequest(req,url,this)
            },
            onClose() {
                console.log("Server is shutting down...");
            }
          });
        if (typeof callback === 'function') {
            return callback();
          }
          console.log(`Server is running on http://localhost:${port}`);
          return server;
    }

    #addRoute(method,path,handlers){
        
        const middlewareHandlers = handlers.slice(0, -1);

        if (!this.middlewares.has(path)) {
            this.middlewares.set(path,[])
        }
        if (path === '/') {
            middlewareHandlers.forEach(midlleware => {
                if(!this.globalMiddlewares.includes(midlleware)){
                    this.globalMiddlewares.push(midlleware)
                }
            })
        } else {
            if (!this.middlewares.get(path).includes(...middlewareHandlers)) {
                this.middlewares.get(path).push(...middlewareHandlers);
            }
        }

        const handler = handlers[handlers.length-1]
        this.trie.insert(path,{handler,method})
        
    }

    use(pathORHandler,handler){
        if (typeof pathORHandler === 'function') {
            if (!this.globalMiddlewares.includes(pathORHandler)) {
                return this.globalMiddlewares.push(pathORHandler)
            }
        }
        // now it means it is path midl
        const path = pathORHandler
        if (!this.middlewares.has(path)) {
            this.middlewares.set(path,[])
        }

        if(!this.middlewares.get(path).includes(handler)){
            this.middlewares.get(path).push(handler)
        }
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


export default diesel;