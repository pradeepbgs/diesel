var __create = Object.create;
var __getProtoOf = Object.getPrototypeOf;
var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __toESM = (mod, isNodeMode, target) => {
  target = mod != null ? __create(__getProtoOf(mod)) : {};
  const to = isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target;
  for (let key of __getOwnPropNames(mod))
    if (!__hasOwnProp.call(to, key))
      __defProp(to, key, {
        get: () => mod[key],
        enumerable: true
      });
  return to;
};
var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined")
    return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});

// src/trie.ts
class TrieNode {
  children;
  isEndOfWord;
  handler;
  isDynamic;
  pattern;
  path;
  method;
  constructor() {
    this.children = {};
    this.isEndOfWord = false;
    this.handler = [];
    this.isDynamic = false;
    this.pattern = "";
    this.path = "";
    this.method = [];
  }
}

class Trie {
  root;
  constructor() {
    this.root = new TrieNode;
  }
  insert(path, route) {
    let node = this.root;
    const pathSegments = path.split("/").filter(Boolean);
    if (path === "/") {
      node.isEndOfWord = true;
      node.handler.push(route.handler);
      node.path = path;
      node.method.push(route.method);
      return;
    }
    for (const segment of pathSegments) {
      let isDynamic = false;
      let key = segment;
      if (segment.startsWith(":")) {
        isDynamic = true;
        key = ":";
      }
      if (!node.children[key]) {
        node.children[key] = new TrieNode;
      }
      node = node.children[key];
      node.isDynamic = isDynamic;
      node.pattern = segment;
      node.method.push(route.method);
      node.handler.push(route.handler);
      node.path = path;
    }
    node.isEndOfWord = true;
    node.method.push(route.method);
    node.handler.push(route.handler);
    node.path = path;
  }
  search(path, method) {
    let node = this.root;
    const pathSegments = path.split("/").filter(Boolean);
    const totalSegments = pathSegments.length;
    for (const segment of pathSegments) {
      let key = segment;
      if (!node.children[key]) {
        if (node.children[":"]) {
          node = node.children[":"];
        } else {
          return null;
        }
      } else {
        node = node.children[key];
      }
    }
    const routeSegments = node.path.split("/").filter(Boolean);
    if (totalSegments !== routeSegments.length) {
      return null;
    }
    const routeMethodIndex = node.method.indexOf(method);
    if (routeMethodIndex !== -1) {
      return {
        path: node.path,
        handler: node.handler[routeMethodIndex],
        isDynamic: node.isDynamic,
        pattern: node.pattern,
        method: node.method[routeMethodIndex]
      };
    }
    return {
      path: node.path,
      handler: node.handler,
      isDynamic: node.isDynamic,
      pattern: node.pattern,
      method: node.method[routeMethodIndex]
    };
  }
}

// src/utils.ts
function rateLimit(props) {
  const {
    time: windowMs = 60000,
    max = 100,
    message = "Rate limit exceeded. Please try again later."
  } = props;
  const requests = new Map;
  return (ctx) => {
    const currentTime = new Date;
    const socketIP = ctx.ip;
    if (!requests.has(socketIP)) {
      requests.set(socketIP, { count: 0, startTime: currentTime });
    }
    const requestInfo = requests.get(socketIP);
    if (requestInfo) {
      if (currentTime - requestInfo.startTime > windowMs) {
        requestInfo.count = 1;
        requestInfo.startTime = currentTime;
      } else {
        requestInfo.count++;
      }
    }
    if (requestInfo && requestInfo.count > max) {
      return ctx.json({
        error: message
      }, 429);
    }
  };
}
function getMimeType(filePath) {
  const ext = filePath.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "js":
      return "application/javascript";
    case "css":
      return "text/css";
    case "html":
      return "text/html";
    case "json":
      return "application/json";
    case "png":
      return "image/png";
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "svg":
      return "image/svg+xml";
    case "gif":
      return "image/gif";
    case "woff":
      return "font/woff";
    case "woff2":
      return "font/woff2";
    default:
      return "application/octet-stream";
  }
}
var binaryS = (arr, target, start, end) => {
  if (start > end) {
    return false;
  }
  let mid = start + (end - start) / 2;
  if (arr[mid] == target) {
    return true;
  }
  if (arr[mid] > target) {
    return binaryS(arr, target, start, mid - 1);
  }
  return binaryS(arr, target, mid + 1, end);
};
// src/ctx.ts
function createCtx(req, server, url) {
  const headers = new Headers({ "Cache-Control": "no-cache" });
  let parsedQuery = null;
  let parsedParams = null;
  let parsedCookies = null;
  let parsedBody = null;
  let contextData = {};
  return {
    req,
    server,
    url,
    setHeader(key, value) {
      headers.set(key, value);
      return this;
    },
    removeHeader(key) {
      headers.delete(key);
      return this;
    },
    get ip() {
      return this.server.requestIP(this.req)?.address ?? null;
    },
    get query() {
      if (!parsedQuery) {
        try {
          parsedQuery = Object.fromEntries(this.url.searchParams);
        } catch (error) {
          throw new Error("Failed to parse query parameters");
        }
      }
      return parsedQuery;
    },
    get params() {
      if (!parsedParams && this.req.routePattern) {
        try {
          parsedParams = extractDynamicParams(this.req.routePattern, this.url.pathname);
        } catch (error) {
          throw new Error("Failed to extract route parameters");
        }
      }
      return parsedParams ?? {};
    },
    get body() {
      if (this.req.method === "GET") {
        return Promise.resolve({});
      }
      if (!parsedBody) {
        parsedBody = (async () => {
          const result = await parseBody(this.req);
          if (result.error) {
            throw new Error(result.error);
          }
          return Object.keys(result).length === 0 ? null : result;
        })();
      }
      return parsedBody;
    },
    set(key, value) {
      contextData[key] = value;
      return this;
    },
    get(key) {
      return contextData[key];
    },
    text(data, status = 200) {
      if (!headers.has("Content-Type")) {
        headers.set("Content-Type", "text/plain; charset=utf-8");
      }
      return new Response(data, {
        status,
        headers
      });
    },
    send(data, status = 200) {
      const typeMap = new Map([
        ["string", "text/plain; charset=utf-8"],
        ["object", "application/json; charset=utf-8"],
        ["Uint8Array", "application/octet-stream"],
        ["ArrayBuffer", "application/octet-stream"]
      ]);
      const dataType = data instanceof Uint8Array ? "Uint8Array" : data instanceof ArrayBuffer ? "ArrayBuffer" : typeof data;
      if (!headers.has("Content-Type")) {
        headers.set("Content-Type", typeMap.get(dataType) ?? "text/plain; charset=utf-8");
      }
      const responseData = dataType === "object" && data !== null ? JSON.stringify(data) : data;
      return new Response(responseData, { status, headers });
    },
    json(data, status = 200) {
      if (!headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json; charset=utf-8");
      }
      return new Response(JSON.stringify(data), { status, headers });
    },
    file(filePath, status = 200, mime_Type) {
      const file = Bun.file(filePath);
      if (!headers.has("Content-Type")) {
        headers.set("Content-Type", mime_Type ?? getMimeType(filePath));
      }
      return new Response(file, { status, headers });
    },
    async ejs(viewPath, data = {}) {
      let ejs;
      try {
        ejs = await import("ejs");
        ejs = ejs.default || ejs;
      } catch (error) {
        console.error("EJS not installed! Please run `bun add ejs`");
        return new Response("EJS not installed! Please run `bun add ejs`", { status: 500 });
      }
      try {
        const template = await Bun.file(viewPath).text();
        const rendered = ejs.render(template, data);
        const headers2 = new Headers({ "Content-Type": "text/html; charset=utf-8" });
        return new Response(rendered, { status: 200, headers: headers2 });
      } catch (error) {
        console.error("EJS Rendering Error:", error);
        return new Response("Error rendering template", { status: 500 });
      }
    },
    redirect(path, status = 302) {
      headers.set("Location", path);
      return new Response(null, { status, headers });
    },
    setCookie(name, value, options = {}) {
      let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;
      if (options.maxAge)
        cookieString += `; Max-Age=${options.maxAge}`;
      if (options.expires)
        cookieString += `; Expires=${options.expires.toUTCString()}`;
      if (options.path)
        cookieString += `; Path=${options.path}`;
      if (options.domain)
        cookieString += `; Domain=${options.domain}`;
      if (options.secure)
        cookieString += `; Secure`;
      if (options.httpOnly)
        cookieString += `; HttpOnly`;
      if (options.sameSite)
        cookieString += `; SameSite=${options.sameSite}`;
      headers.append("Set-Cookie", cookieString);
      return this;
    },
    get cookies() {
      if (!parsedCookies) {
        const cookieHeader = this.req.headers.get("cookie");
        parsedCookies = cookieHeader ? parseCookie(cookieHeader) : {};
      }
      return parsedCookies;
    }
  };
}
function parseCookie(cookieHeader) {
  return Object.fromEntries(cookieHeader.split(";").map((cookie) => {
    const [name, ...valueParts] = cookie.trim().split("=");
    return [name, decodeURIComponent(valueParts.join("="))];
  }));
}
function extractDynamicParams(routePattern, path) {
  const params = {};
  const routeSegments = routePattern.split("/");
  const [pathWithoutQuery] = path.split("?");
  const pathSegments = pathWithoutQuery.split("/");
  if (routeSegments.length !== pathSegments.length) {
    return null;
  }
  for (let i = 0;i < routeSegments.length; i++) {
    if (routeSegments[i].startsWith(":")) {
      params[routeSegments[i].slice(1)] = pathSegments[i];
    }
  }
  return params;
}
async function parseBody(req) {
  const contentType = req.headers.get("Content-Type");
  if (!contentType)
    return {};
  const contentLength = req.headers.get("Content-Length");
  if (contentLength === "0" || !req.body) {
    return {};
  }
  try {
    if (contentType.startsWith("application/json")) {
      return await req.json();
    }
    if (contentType.startsWith("application/x-www-form-urlencoded")) {
      const body = await req.text();
      return Object.fromEntries(new URLSearchParams(body));
    }
    if (contentType.startsWith("multipart/form-data")) {
      const formData = await req.formData();
      const obj = {};
      for (const [key, value] of formData.entries()) {
        obj[key] = value;
      }
      return obj;
    }
    return { error: "Unknown request body type" };
  } catch (error) {
    return { error: "Invalid request body format" };
  }
}

// src/handleRequest.ts
async function handleRequest(req, server, url, diesel) {
  const ctx = createCtx(req, server, url);
  const routeHandler = diesel.trie.search(url.pathname, req.method);
  req.routePattern = routeHandler?.path;
  if (diesel.hasFilterEnabled) {
    const path = req.routePattern ?? url.pathname;
    const filterResponse = await handleFilterRequest(diesel, path, ctx, server);
    if (filterResponse)
      return filterResponse;
  }
  if (diesel.hasMiddleware) {
    const globalMiddlewareResponse = await executeMiddlewares(diesel.globalMiddlewares, ctx, server);
    if (globalMiddlewareResponse)
      return globalMiddlewareResponse;
    const pathMiddlewares = diesel.middlewares.get(url.pathname) || [];
    const pathMiddlewareResponse = await executeMiddlewares(pathMiddlewares, ctx, server);
    if (pathMiddlewareResponse)
      return pathMiddlewareResponse;
  }
  if (!routeHandler?.handler || routeHandler.method !== req.method) {
    if (diesel.staticPath) {
      const staticResponse = await handleStaticFiles(diesel, url.pathname, ctx);
      if (staticResponse)
        return staticResponse;
      const wildCard = diesel.trie.search("*", req.method);
      if (wildCard?.handler) {
        return await wildCard.handler(ctx);
      }
    }
    if (diesel.hooks.routeNotFound && !routeHandler?.handler) {
      const routeNotFoundResponse = await diesel.hooks.routeNotFound(ctx);
      if (routeNotFoundResponse)
        return routeNotFoundResponse;
    }
    if (!routeHandler || !routeHandler?.handler?.length) {
      return generateErrorResponse(404, `Route not found for ${url.pathname}`);
    }
    if (routeHandler?.method !== req.method) {
      return generateErrorResponse(405, "Method not allowed");
    }
  }
  if (diesel.hooks.preHandler) {
    const preHandlerResponse = await diesel.hooks.preHandler(ctx);
    if (preHandlerResponse)
      return preHandlerResponse;
  }
  const result = routeHandler.handler(ctx);
  const finalResult = result instanceof Promise ? await result : result;
  if (diesel.hooks.postHandler)
    await diesel.hooks.postHandler(ctx);
  if (diesel.hooks.onSend) {
    const hookResponse = await diesel.hooks.onSend(ctx, finalResult);
    if (hookResponse)
      return hookResponse;
  }
  return finalResult ?? generateErrorResponse(204, "No response from this handler");
}
async function executeMiddlewares(middlewares, ctx, server) {
  for (const middleware of middlewares) {
    const result = await middleware(ctx, server);
    if (result)
      return result;
  }
  return null;
}
async function handleFilterRequest(diesel, path, ctx, server) {
  if (!diesel.filters.has(path)) {
    if (diesel.filterFunction.length) {
      for (const filterFunction of diesel.filterFunction) {
        const filterResult = await filterFunction(ctx, server);
        if (filterResult)
          return filterResult;
      }
    } else {
      return ctx.json({ error: true, message: "Protected route, authentication required", status: 401 }, 401);
    }
  }
}
function generateErrorResponse(status, message) {
  return new Response(JSON.stringify({ error: true, message, status }), { status, headers: { "Content-Type": "application/json" } });
}
async function handleStaticFiles(diesel, pathname, ctx) {
  if (!diesel.staticPath)
    return null;
  const filePath = `${diesel.staticPath}${pathname}`;
  const file = Bun.file(filePath);
  if (await file.exists()) {
    const mimeType = getMimeType(filePath);
    return ctx.file(filePath, 200, mimeType);
  }
  return null;
}

// src/main.ts
class Diesel {
  tempRoutes;
  globalMiddlewares;
  middlewares;
  trie;
  hasOnReqHook;
  hasMiddleware;
  hasPreHandlerHook;
  hasPostHandlerHook;
  hasOnSendHook;
  hasOnError;
  hooks;
  corsConfig;
  FilterRoutes;
  filters;
  filterFunction;
  hasFilterEnabled;
  serverInstance;
  staticPath;
  staticFiles;
  user_jwt_secret;
  constructor() {
    this.user_jwt_secret = process.env.DIESEL_JWT_SECRET ?? "feault_diesel_secret_for_jwt";
    this.tempRoutes = new Map;
    this.globalMiddlewares = [];
    this.middlewares = new Map;
    this.trie = new Trie;
    this.corsConfig = null;
    this.hasMiddleware = false;
    this.hasOnReqHook = false;
    this.hasPreHandlerHook = false;
    this.hasPostHandlerHook = false;
    this.hasOnSendHook = false;
    this.hasOnError = false;
    this.hooks = {
      onRequest: null,
      preHandler: null,
      postHandler: null,
      onSend: null,
      onError: null,
      onClose: null,
      routeNotFound: null
    };
    this.FilterRoutes = [];
    this.filters = new Set;
    this.filterFunction = [];
    this.hasFilterEnabled = false;
    this.serverInstance = null;
    this.staticPath = null;
    this.staticFiles = {};
  }
  setupFilter() {
    this.hasFilterEnabled = true;
    return {
      routeMatcher: (...routes) => {
        this.FilterRoutes = routes;
        return this.setupFilter();
      },
      permitAll: () => {
        for (const route of this?.FilterRoutes) {
          this.filters.add(route);
        }
        this.FilterRoutes = null;
        return this.setupFilter();
      },
      authenticate: (fnc) => {
        if (fnc?.length) {
          for (const fn of fnc) {
            this.filterFunction.push(fn);
          }
        }
      }
    };
  }
  redirect(incomingPath, redirectPath, statusCode) {
    this.any(incomingPath, (ctx) => {
      const params = ctx.params;
      let finalPathToRedirect = redirectPath;
      if (params) {
        for (const key in params) {
          finalPathToRedirect = finalPathToRedirect.replace(`:${key}`, params[key]);
        }
      }
      const queryParams = ctx.url.search;
      if (queryParams)
        finalPathToRedirect += queryParams;
      return ctx.redirect(finalPathToRedirect, statusCode);
    });
    return this;
  }
  serveStatic(filePath) {
    this.staticPath = filePath;
  }
  static(args = {}) {
    this.staticFiles = { ...this.staticFiles, ...args };
    return this;
  }
  addHooks(typeOfHook, fnc) {
    if (typeof typeOfHook !== "string") {
      throw new Error("hookName must be a string");
    }
    if (typeof fnc !== "function") {
      throw new Error("callback must be a instance of function");
    }
    switch (typeOfHook) {
      case "onRequest":
        this.hooks.onRequest = fnc;
        break;
      case "preHandler":
        this.hooks.preHandler = fnc;
        break;
      case "postHandler":
        this.hooks.postHandler = fnc;
        break;
      case "onSend":
        this.hooks.onSend = fnc;
        break;
      case "onError":
        this.hooks.onError = fnc;
        break;
      case "onClose":
        this.hooks.onClose = fnc;
        break;
      case "routeNotFound":
        this.hooks.routeNotFound = fnc;
        break;
      default:
        throw new Error(`Unknown hook type: ${typeOfHook}`);
    }
    return this;
  }
  compile() {
    if (this.globalMiddlewares.length > 0) {
      this.hasMiddleware = true;
    }
    for (const [_, middlewares] of this.middlewares.entries()) {
      if (middlewares.length > 0) {
        this.hasMiddleware = true;
        break;
      }
    }
    this.tempRoutes = null;
  }
  listen(port, ...args) {
    if (typeof Bun === "undefined")
      throw new Error(".listen() is designed to run on Bun only...");
    let hostname = "0.0.0.0";
    let callback = undefined;
    let options = {};
    for (const arg of args) {
      if (typeof arg === "string") {
        hostname = arg;
      } else if (typeof arg === "function") {
        callback = arg;
      } else if (typeof arg === "object" && arg !== null) {
        options = arg;
      }
    }
    const ServerOptions = {
      port,
      hostname,
      fetch: async (req, server) => {
        const url = new URL(req.url);
        try {
          if (this.hooks.onRequest) {
            this.hooks.onRequest(req, url, server);
          }
          return await handleRequest(req, server, url, this);
        } catch (error) {
          return this.hooks.onError ? this.hooks.onError(error, req, url, server) : new Response(JSON.stringify({ message: "Internal Server Error", error: error.message, status: 500 }), { status: 500 });
        }
      },
      static: this.staticFiles,
      development: true
    };
    if (options.sslCert && options.sslKey) {
      ServerOptions.certFile = options.sslCert;
      ServerOptions.keyFile = options.sslKey;
    }
    this.compile();
    this.serverInstance = Bun?.serve(ServerOptions);
    if (callback) {
      return callback();
    }
    if (options.sslCert && options.sslKey) {
      console.log(`HTTPS server is running on https://localhost:${port}`);
    } else {
      console.log(`HTTP server is running on http://localhost:${port}`);
    }
    return this.serverInstance;
  }
  close(callback) {
    if (this.serverInstance) {
      this.serverInstance.stop(true);
      this.serverInstance = null;
      callback ? callback() : console.log("Server has been stopped");
    } else {
      console.warn("Server is not running.");
    }
  }
  route(basePath, routerInstance) {
    if (!basePath || typeof basePath !== "string")
      throw new Error("Path must be a string");
    const routes = Object.fromEntries(routerInstance.tempRoutes);
    const routesArray = Object.entries(routes);
    routesArray.forEach(([path, args]) => {
      const cleanedPath = path.replace(/::\w+$/, "");
      const fullpath = `${basePath}${cleanedPath}`;
      if (!this.middlewares.has(fullpath)) {
        this.middlewares.set(fullpath, []);
      }
      const middlewareHandlers = args.handlers.slice(0, -1);
      middlewareHandlers.forEach((middleware) => {
        if (!this.middlewares.get(fullpath)?.includes(middleware)) {
          this.middlewares.get(fullpath)?.push(middleware);
        }
      });
      const handler = args.handlers[args.handlers.length - 1];
      const method = args.method;
      try {
        this.trie.insert(fullpath, {
          handler,
          method
        });
      } catch (error) {
        console.error(`Error inserting ${fullpath}:`, error);
      }
    });
    routerInstance = null;
    return this;
  }
  register(basePath, routerInstance) {
    return this.route(basePath, routerInstance);
  }
  addRoute(method, path, handlers) {
    if (typeof path !== "string")
      throw new Error(`Error in ${handlers[handlers.length - 1]}: Path must be a string. Received: ${typeof path}`);
    if (typeof method !== "string")
      throw new Error(`Error in addRoute: Method must be a string. Received: ${typeof method}`);
    this.tempRoutes?.set(path + "::" + method, { method, handlers });
    const middlewareHandlers = handlers.slice(0, -1);
    const handler = handlers[handlers.length - 1];
    if (!this.middlewares.has(path)) {
      this.middlewares.set(path, []);
    }
    middlewareHandlers.forEach((middleware) => {
      if (path === "/") {
        this.globalMiddlewares = [
          ...new Set([...this.globalMiddlewares, ...middlewareHandlers])
        ];
      } else {
        if (!this.middlewares.get(path)?.includes(middleware)) {
          this.middlewares.get(path)?.push(middleware);
        }
      }
    });
    try {
      if (method === "ANY") {
        const allMethods = [
          "GET",
          "POST",
          "PUT",
          "DELETE",
          "PATCH",
          "OPTIONS",
          "HEAD",
          "PROPFIND"
        ];
        for (const m of allMethods) {
          this.trie.insert(path, { handler, method: m });
        }
      }
      this.trie.insert(path, { handler, method });
    } catch (error) {
      console.error(`Error inserting ${path}:`, error);
    }
  }
  use(pathORHandler, handlers) {
    if (Array.isArray(pathORHandler)) {
      pathORHandler.forEach((handler) => {
        if (typeof handler === "function") {
          this.globalMiddlewares.push(handler);
        }
      });
    }
    if (typeof pathORHandler === "function") {
      this.globalMiddlewares.push(pathORHandler);
      if (Array.isArray(handlers)) {
        handlers.forEach((handler) => {
          this.globalMiddlewares.push(handler);
        });
      }
      return;
    }
    const paths = Array.isArray(pathORHandler) ? pathORHandler.filter((path) => typeof path === "string") : [pathORHandler].filter((path) => typeof path === "string");
    paths.forEach((path) => {
      if (!this.middlewares.has(path)) {
        this.middlewares.set(path, []);
      }
      if (handlers) {
        const handlerArray = Array.isArray(handlers) ? handlers : [handlers];
        handlerArray.forEach((handler) => {
          this.middlewares.get(path)?.push(handler);
        });
      }
    });
    return this;
  }
  get(path, ...handlers) {
    this.addRoute("GET", path, handlers);
    return this;
  }
  post(path, ...handlers) {
    this.addRoute("POST", path, handlers);
    return this;
  }
  put(path, ...handlers) {
    this.addRoute("PUT", path, handlers);
    return this;
  }
  patch(path, ...handlers) {
    this.addRoute("PATCH", path, handlers);
    return this;
  }
  delete(path, ...handlers) {
    this.addRoute("DELETE", path, handlers);
    return this;
  }
  any(path, ...handlers) {
    this.addRoute("ANY", path, handlers);
    return this;
  }
  head(path, ...handlers) {
    this.addRoute("HEAD", path, handlers);
    return this;
  }
  options(path, ...handlers) {
    this.addRoute("OPTIONS", path, handlers);
    return this;
  }
  propfind(path, ...handlers) {
    this.addRoute("PROPFIND", path, handlers);
    return this;
  }
}
export {
  Diesel as default
};
