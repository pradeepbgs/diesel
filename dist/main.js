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
    }
    node.isEndOfWord = true;
    node.path = path;
    node.method.push(route.method);
    node.handler.push(route.handler);
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

// node:path
var L = Object.create;
var h = Object.defineProperty;
var D = Object.getOwnPropertyDescriptor;
var T = Object.getOwnPropertyNames;
var _ = Object.getPrototypeOf;
var E = Object.prototype.hasOwnProperty;
var R = (s, e) => () => (e || s((e = { exports: {} }).exports, e), e.exports);
var N = (s, e, r, t) => {
  if (e && typeof e == "object" || typeof e == "function")
    for (let i of T(e))
      !E.call(s, i) && i !== r && h(s, i, { get: () => e[i], enumerable: !(t = D(e, i)) || t.enumerable });
  return s;
};
var j = (s, e, r) => (r = s != null ? L(_(s)) : {}, N(e || !s || !s.__esModule ? h(r, "default", { value: s, enumerable: true }) : r, s));
var k = R((W, w) => {
  function v(s) {
    if (typeof s != "string")
      throw new TypeError("Path must be a string. Received " + JSON.stringify(s));
  }
  function C(s, e) {
    for (var r = "", t = 0, i = -1, a = 0, n, l = 0;l <= s.length; ++l) {
      if (l < s.length)
        n = s.charCodeAt(l);
      else {
        if (n === 47)
          break;
        n = 47;
      }
      if (n === 47) {
        if (!(i === l - 1 || a === 1))
          if (i !== l - 1 && a === 2) {
            if (r.length < 2 || t !== 2 || r.charCodeAt(r.length - 1) !== 46 || r.charCodeAt(r.length - 2) !== 46) {
              if (r.length > 2) {
                var f = r.lastIndexOf("/");
                if (f !== r.length - 1) {
                  f === -1 ? (r = "", t = 0) : (r = r.slice(0, f), t = r.length - 1 - r.lastIndexOf("/")), i = l, a = 0;
                  continue;
                }
              } else if (r.length === 2 || r.length === 1) {
                r = "", t = 0, i = l, a = 0;
                continue;
              }
            }
            e && (r.length > 0 ? r += "/.." : r = "..", t = 2);
          } else
            r.length > 0 ? r += "/" + s.slice(i + 1, l) : r = s.slice(i + 1, l), t = l - i - 1;
        i = l, a = 0;
      } else
        n === 46 && a !== -1 ? ++a : a = -1;
    }
    return r;
  }
  function F(s, e) {
    var r = e.dir || e.root, t = e.base || (e.name || "") + (e.ext || "");
    return r ? r === e.root ? r + t : r + s + t : t;
  }
  var m = { resolve: function() {
    for (var e = "", r = false, t, i = arguments.length - 1;i >= -1 && !r; i--) {
      var a;
      i >= 0 ? a = arguments[i] : (t === undefined && (t = process.cwd()), a = t), v(a), a.length !== 0 && (e = a + "/" + e, r = a.charCodeAt(0) === 47);
    }
    return e = C(e, !r), r ? e.length > 0 ? "/" + e : "/" : e.length > 0 ? e : ".";
  }, normalize: function(e) {
    if (v(e), e.length === 0)
      return ".";
    var r = e.charCodeAt(0) === 47, t = e.charCodeAt(e.length - 1) === 47;
    return e = C(e, !r), e.length === 0 && !r && (e = "."), e.length > 0 && t && (e += "/"), r ? "/" + e : e;
  }, isAbsolute: function(e) {
    return v(e), e.length > 0 && e.charCodeAt(0) === 47;
  }, join: function() {
    if (arguments.length === 0)
      return ".";
    for (var e, r = 0;r < arguments.length; ++r) {
      var t = arguments[r];
      v(t), t.length > 0 && (e === undefined ? e = t : e += "/" + t);
    }
    return e === undefined ? "." : m.normalize(e);
  }, relative: function(e, r) {
    if (v(e), v(r), e === r || (e = m.resolve(e), r = m.resolve(r), e === r))
      return "";
    for (var t = 1;t < e.length && e.charCodeAt(t) === 47; ++t)
      ;
    for (var i = e.length, a = i - t, n = 1;n < r.length && r.charCodeAt(n) === 47; ++n)
      ;
    for (var l = r.length, f = l - n, c = a < f ? a : f, d = -1, o = 0;o <= c; ++o) {
      if (o === c) {
        if (f > c) {
          if (r.charCodeAt(n + o) === 47)
            return r.slice(n + o + 1);
          if (o === 0)
            return r.slice(n + o);
        } else
          a > c && (e.charCodeAt(t + o) === 47 ? d = o : o === 0 && (d = 0));
        break;
      }
      var A = e.charCodeAt(t + o), z = r.charCodeAt(n + o);
      if (A !== z)
        break;
      A === 47 && (d = o);
    }
    var b = "";
    for (o = t + d + 1;o <= i; ++o)
      (o === i || e.charCodeAt(o) === 47) && (b.length === 0 ? b += ".." : b += "/..");
    return b.length > 0 ? b + r.slice(n + d) : (n += d, r.charCodeAt(n) === 47 && ++n, r.slice(n));
  }, _makeLong: function(e) {
    return e;
  }, dirname: function(e) {
    if (v(e), e.length === 0)
      return ".";
    for (var r = e.charCodeAt(0), t = r === 47, i = -1, a = true, n = e.length - 1;n >= 1; --n)
      if (r = e.charCodeAt(n), r === 47) {
        if (!a) {
          i = n;
          break;
        }
      } else
        a = false;
    return i === -1 ? t ? "/" : "." : t && i === 1 ? "//" : e.slice(0, i);
  }, basename: function(e, r) {
    if (r !== undefined && typeof r != "string")
      throw new TypeError('"ext" argument must be a string');
    v(e);
    var t = 0, i = -1, a = true, n;
    if (r !== undefined && r.length > 0 && r.length <= e.length) {
      if (r.length === e.length && r === e)
        return "";
      var l = r.length - 1, f = -1;
      for (n = e.length - 1;n >= 0; --n) {
        var c = e.charCodeAt(n);
        if (c === 47) {
          if (!a) {
            t = n + 1;
            break;
          }
        } else
          f === -1 && (a = false, f = n + 1), l >= 0 && (c === r.charCodeAt(l) ? --l === -1 && (i = n) : (l = -1, i = f));
      }
      return t === i ? i = f : i === -1 && (i = e.length), e.slice(t, i);
    } else {
      for (n = e.length - 1;n >= 0; --n)
        if (e.charCodeAt(n) === 47) {
          if (!a) {
            t = n + 1;
            break;
          }
        } else
          i === -1 && (a = false, i = n + 1);
      return i === -1 ? "" : e.slice(t, i);
    }
  }, extname: function(e) {
    v(e);
    for (var r = -1, t = 0, i = -1, a = true, n = 0, l = e.length - 1;l >= 0; --l) {
      var f = e.charCodeAt(l);
      if (f === 47) {
        if (!a) {
          t = l + 1;
          break;
        }
        continue;
      }
      i === -1 && (a = false, i = l + 1), f === 46 ? r === -1 ? r = l : n !== 1 && (n = 1) : r !== -1 && (n = -1);
    }
    return r === -1 || i === -1 || n === 0 || n === 1 && r === i - 1 && r === t + 1 ? "" : e.slice(r, i);
  }, format: function(e) {
    if (e === null || typeof e != "object")
      throw new TypeError('The "pathObject" argument must be of type Object. Received type ' + typeof e);
    return F("/", e);
  }, parse: function(e) {
    v(e);
    var r = { root: "", dir: "", base: "", ext: "", name: "" };
    if (e.length === 0)
      return r;
    var t = e.charCodeAt(0), i = t === 47, a;
    i ? (r.root = "/", a = 1) : a = 0;
    for (var n = -1, l = 0, f = -1, c = true, d = e.length - 1, o = 0;d >= a; --d) {
      if (t = e.charCodeAt(d), t === 47) {
        if (!c) {
          l = d + 1;
          break;
        }
        continue;
      }
      f === -1 && (c = false, f = d + 1), t === 46 ? n === -1 ? n = d : o !== 1 && (o = 1) : n !== -1 && (o = -1);
    }
    return n === -1 || f === -1 || o === 0 || o === 1 && n === f - 1 && n === l + 1 ? f !== -1 && (l === 0 && i ? r.base = r.name = e.slice(1, f) : r.base = r.name = e.slice(l, f)) : (l === 0 && i ? (r.name = e.slice(1, n), r.base = e.slice(1, f)) : (r.name = e.slice(l, n), r.base = e.slice(l, f)), r.ext = e.slice(n, f)), l > 0 ? r.dir = e.slice(0, l - 1) : i && (r.dir = "/"), r;
  }, sep: "/", delimiter: ":", win32: null, posix: null };
  m.posix = m;
  w.exports = m;
});
var x = j(k());
var u = x;
var J = x;
var P = function(s) {
  return s;
};
var S = function() {
  throw new Error("Not implemented");
};
u.parse ??= S;
J.parse ??= S;
var g = { resolve: u.resolve.bind(u), normalize: u.normalize.bind(u), isAbsolute: u.isAbsolute.bind(u), join: u.join.bind(u), relative: u.relative.bind(u), toNamespacedPath: P, dirname: u.dirname.bind(u), basename: u.basename.bind(u), extname: u.extname.bind(u), format: u.format.bind(u), parse: u.parse.bind(u), sep: "/", delimiter: ":", win32: undefined, posix: undefined, _makeLong: P };
var y = { sep: "\\", delimiter: ";", win32: undefined, ...g, posix: g };
g.win32 = y.win32 = y;
g.posix = g;
var q = g;

// src/main.ts
var { default: fs} = (() => ({}));
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
      },
      authenticateJwt: (jwt) => {
        this.filterFunction.push(authenticateJwtMiddleware(jwt, this.user_jwt_secret));
      },
      authenticateJwtDB: (jwt, User) => {
        this.filterFunction.push(authenticateJwtDbMiddleware(jwt, User, this.user_jwt_secret));
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
    return this;
  }
  static(args) {
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
    for (const [_2, middlewares] of this.middlewares.entries()) {
      if (middlewares.length > 0) {
        this.hasMiddleware = true;
        break;
      }
    }
    const projectRoot = process.cwd();
    const routesPath = q.join(projectRoot, "src", "routes");
    if (fs?.existsSync(routesPath)) {
      this.loadRoutes(routesPath, "");
    }
    setTimeout(() => {
      this.tempRoutes = null;
    }, 2000);
  }
  async registerFileRoutes(filePath, baseRoute) {
    const module = await import(filePath);
    let routePath = baseRoute + "/" + q.basename(filePath, ".ts");
    if (routePath.endsWith("/index")) {
      routePath = baseRoute;
    }
    const supportedMethods = [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "ANY",
      "HEAD",
      "OPTIONS",
      "PROPFIND"
    ];
    for (const method of supportedMethods) {
      if (module[method]) {
        const lowerMethod = method;
        const handler = module[method];
        this.trie.insert(routePath, { handler, method: lowerMethod });
      }
    }
  }
  async loadRoutes(dirPath, baseRoute) {
    const files = await fs.promises.readdir(dirPath);
    for (const file of files) {
      const filePath = q.join(dirPath, file);
      const stat = await fs.promises.stat(filePath);
      if (stat.isDirectory()) {
        this.loadRoutes(filePath, baseRoute + "/" + file);
      } else if (file.endsWith(".ts")) {
        this.registerFileRoutes(filePath, baseRoute);
      }
    }
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
        if (this.hooks.onRequest) {
          this.hooks.onRequest(req, url, server);
        }
        return await handleRequest(req, server, url, this);
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
    if (options.sslCert && options.sslKey) {
      console.log(`HTTPS server is running on https://localhost:${port}`);
    }
    if (callback) {
      return callback();
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
