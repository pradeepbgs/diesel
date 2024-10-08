import diesel from "./server";

class Router extends diesel{
    constructor(){
        super()
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

export default Router