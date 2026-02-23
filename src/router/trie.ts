import { EMPTY_OBJ } from "../main";

class TrieNodes {
  children: Record<string, TrieNodes>;
  handlers: Record<string, Function>;
  middlewares: Function[];
  params: Record<string, number>;
  paramName: string
  constructor() {
    this.children = {};
    this.handlers = {};
    this.middlewares = [];
    this.params = {}
    this.paramName=""
  }
}

export class TrieRouter {
  root: TrieNodes;
  globalMiddlewares: Function[];
  constructor() {
    this.root = new TrieNodes();
    this.globalMiddlewares = [];
  }

  pushMiddleware(path: string, handlers: Function | Function[]) {
    if (!Array.isArray(handlers)) handlers = [handlers];
    if (path === "/") {
      this.globalMiddlewares.push(...handlers);
      return;
    }

    let node = this.root;
    const pathSegments = path.split("/").filter(Boolean);

    for (const element of pathSegments) {
      let key = element;
      if (element.startsWith(":")) {
        key = ":";
      } else if (element.startsWith("*")) {
        node.middlewares.push(...handlers);
      }

      if (!node.children[key]) node.children[key] = new TrieNodes();

      node = node.children[key];
    }

    node.middlewares.push(...handlers);

  }

  addMiddleware(path: string, handlers: Function | Function[]): void {
    return this.pushMiddleware(path, handlers)
  }

  insert(method: string, path: string, handler: Function) {
    let node = this.root;

    if (path === "/") {
      node.handlers[method] = handler
      node.params = EMPTY_OBJ
      return;
    }

    const pathSegments = path.split("/").filter(Boolean);

    let routeparams: Record<string, number> = {}
    for (let i = 0; i < pathSegments.length; i++) {
      const element = pathSegments[i];
      let key = element;
      let cleanParam = ''
      if (element.startsWith(":")) {
        key = ":";
        cleanParam = element.slice(1)
      }


      if (!node.children[key]) node.children[key] = new TrieNodes();

      node = node.children[key];
      if (cleanParam) {
        routeparams[cleanParam] = i
        node.paramName=cleanParam
      }
    }
    node.params = routeparams
    node.handlers[method] = handler;
  }

  add(method: string, path: string, handler: Function) {
    return this.insert(method, path, handler)
  }

  search(method: string, path: string) {
    let node = this.root;

    const pathSegments = path.split("/")

    let collected = this.globalMiddlewares.slice();
    let paramObject:Record<string,any> | undefined

    for (let i = 0; i < pathSegments.length; i++) {
      const element = pathSegments[i];
      if (element.length === 0) {
        continue;
      }
      if (node.children[element]) {
        node = node.children[element]!;
      } else if (node.children[":"]) {
        node = node.children[":"];
        if(!paramObject) paramObject={}
        paramObject[node.paramName]=element
      } else if (node.children["*"]) {
        node = node.children["*"];
        break;
      } else {
        return { params: paramObject, handler: collected };
      }

      if (node.middlewares.length > 0) {
        const mw = node.middlewares;
        for (let j = 0; j < mw.length; j++) {
          collected.push(mw[j]);
        }
      }
    }
    const methodHandler = node.handlers[method]
    if (methodHandler) collected.push(methodHandler);
    return {
      params: paramObject,
      handler: collected,
    };
  }

  find(method: string, path: string) {
    return this.search(method, path)
  }

}


// const t1 = new TrieRouter()
// // t1.insert('GET', '/user/:id', () => "Hello /")
// t1.insert('GET', "/ok/:id/username/:number", () => "Hello /")
// const handler = t1.search('GET', '/ok/1/username/2')
// console.log('real worldf handler = ',handler)
// t1.insert('GET', '/user/:id/:number/contact', () => "Hello /")
// t1.insert('GET', "/:username", () => "Hell /user")
// t1.insert('GET', '/name', () => 'user/* route')
// t1.insert('GET', '/hello/*', () => '/hello/*')
// t1.insert('GET', '/moon/:id', () => "/moon/:id")

// t1.pushMiddleware('/', function home() {
//     return "Midd /" as any
// })
// t1.pushMiddleware('/user/*', () => "user/* middleware " as any)

// const h = t1.search('GET', '/user/2')

// for (const k of h?.handler!) {
//     console.log(k?.(null as any, null as any))
// }

// const router = new TrieRouter()
// global middleware (applies to all requests)
// router.pushMiddleware('/', () => 'log mid' as any);

// // path-specific middleware
// router.pushMiddleware('/users/*', () => "/user/* middleware" as any);        // applies to /users/* paths
// router.pushMiddleware('/users/:id', () => "id checkmid " as any); // applies to /users/:id/*

// routes
// router.insert('GET', '/users', () => "get user by handlr") as any;
// router.insert('GET', '/users/:id', () => "get user by id handler" as any);
// router.insert('GET', '/users/:id/profile', () => "get user / id / profile");
// router.insert('GET', '/users/hello', () => "Hello /user/hello")

// const matched = router.search('POST', '/users/hello')
// console.log(matched.handler?.length)
// for (const k of matched?.handler!) {
//     console.log(k?.(null as any, null as any))
// }

// for (let i = 0; i < 4; i++) {
//     t1.f
// }

// const t = new TrieRouter2()
// t.add('GET', '/user/:id/:name', () => 'root')
// t.add('GET', '/user/:id/pk', () => 'root /user/:id/pk')
