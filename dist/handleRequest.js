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
function authenticateJwtMiddleware(jwt, user_jwt_secret) {
  if (!jwt) {
    throw new Error("JWT library is not defined, please provide jwt to authenticateJwt Function");
  }
  return (ctx) => {
    try {
      let token = ctx.cookies?.accessToken || ctx.req?.headers?.get("Authorization");
      if (!token) {
        return ctx.json({ message: "Unauthorized: No token provided" }, 401);
      }
      if (token.startsWith("Bearer ")) {
        token = token.slice(7);
      }
      const decoded = jwt?.verify(token, user_jwt_secret);
      if (!decoded) {
        return ctx.json({ message: "Unauthorized: Invalid token" }, 401);
      }
      ctx.set("user", decoded);
      return;
    } catch (error) {
      return ctx.json({ message: "Unauthorized: Invalid token", error: error?.message }, 401);
    }
  };
}
function authenticateJwtDbMiddleware(jwt, User, user_jwt_secret) {
  if (!jwt) {
    throw new Error("JWT library is not defined, please provide jwt to authenticateJwtDB Function");
  }
  if (!User) {
    throw new Error("User model is not defined, please provide UserModel to authenticateJwtDB Function");
  }
  return async (ctx) => {
    try {
      let token = ctx.cookies?.accessToken || ctx.req?.headers?.get("Authorization");
      if (!token) {
        return ctx.json({ message: "Unauthorized: No token provided" }, 401);
      }
      if (token.startsWith("Bearer ")) {
        token = token.slice(7);
      }
      const decodedToken = jwt?.verify(token, user_jwt_secret);
      if (!decodedToken) {
        return ctx.json({ message: "Unauthorized: Invalid token" }, 401);
      }
      const user = await User.findById(decodedToken._id).select("-password -refreshToken");
      if (!user) {
        return ctx.json({ message: "Unauthorized: User not found" }, 401);
      }
      ctx.set("user", user);
      return;
    } catch (error) {
      return ctx.json({ message: "Unauthorized: Authentication failed", error: error?.message }, 401);
    }
  };
}
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
    status: 200,
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
    text(data, status) {
      if (status)
        this.status = 200;
      if (!headers.has("Content-Type")) {
        headers.set("Content-Type", "text/plain; charset=utf-8");
      }
      return new Response(data, {
        status: this.status,
        headers
      });
    },
    send(data, status) {
      if (status)
        this.status = 200;
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
      return new Response(responseData, { status: this.status, headers });
    },
    json(data, status) {
      if (status)
        this.status = 200;
      if (!headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json; charset=utf-8");
      }
      return new Response(JSON.stringify(data), { status: this.status, headers });
    },
    file(filePath, status, mime_Type) {
      const file = Bun.file(filePath);
      if (!headers.has("Content-Type")) {
        headers.set("Content-Type", mime_Type ?? getMimeType(filePath));
      }
      return new Response(file, { status: status ?? 200, headers });
    },
    async ejs(viewPath, data = {}, status) {
      if (status)
        this.status = 200;
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
        return new Response(rendered, { status: this.status, headers: headers2 });
      } catch (error) {
        console.error("EJS Rendering Error:", error);
        return new Response("Error rendering template", { status: 500 });
      }
    },
    redirect(path, status) {
      if (!status)
        this.status = 302;
      headers.set("Location", path);
      return new Response(null, { status: this.status, headers });
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
  try {
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
    if (diesel.hooks.onSend) {
      const hookResponse = await diesel.hooks.onSend(ctx, finalResult);
      if (hookResponse)
        return hookResponse;
    }
    return finalResult ?? generateErrorResponse(204, "No response from this handler");
  } catch (error) {
    return diesel.hooks.onError ? diesel.hooks.onError(error, req, url, server) : new Response(JSON.stringify({ message: "Internal Server Error", error: error.message, status: 500 }), { status: 500 });
  } finally {
    if (diesel.hooks.postHandler)
      diesel.hooks.postHandler(ctx);
  }
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
export {
  handleStaticFiles,
  handleFilterRequest,
  generateErrorResponse,
  handleRequest as default
};
