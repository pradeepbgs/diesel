import ResponseHandler from "./responseHandler";

export default async function handleRequest(req, url, diesel) {
  req.cookies = parseCookie(req.headers.get('cookie'))
  const { pathname } = url;
  const { method } = req;

  const routeHandler = diesel.trie.search(pathname, method);
  if (!routeHandler || !routeHandler.handler) {
    return new Response(`Cannot find route for ${pathname}`, { status: 404 });
  }

  if (routeHandler?.method !== method) {
    return new Response("method not allowed");
  }

  const response = new ResponseHandler();
  req.query = Object.fromEntries(url.searchParams.entries());

  // if route is dynamic then extract dynamic value

  const dynamicParams = routeHandler?.isDynamic
    ? extractDynamicParams(routeHandler?.path, pathname)
    : {};
  req.params = dynamicParams;

  const context = {
    req,
    settedValue: {},
    settedValue: {},
    next: () => {},
    set(key, value) {
      this.settedValue[key] = value;
    },
    get(key) {
      return this.settedValue[key];
    },
    setAuthentication(isAuthenticated) {
      this.isAuthenticated = isAuthenticated;
    },
    checkAuthentication() {
      return this.isAuthenticated;
    },
    text(data, status = 200) {
      return response.text(data, status);
    },
    json(data, status = 200) {
      return response.json(data, status);
    },
    file(data) {
      return response.file(data);
    },
    redirect(path, status = 302) {
      return response.redirect(path, status);
    },
    getParams(props) {
      if (props) {
        return req.params[props];
      }
      return req.params;
    },
    getQuery(props) {
      if (props) {
        return req.query[props];
      }
      return req.query;
    },
    cookie(name, value, options = {}) {
        return response.setCookies(name,value,options)  
      },
      getCookie(cookieName) {
        if (cookieName) {
        return req.cookies[cookieName];
        }
        else {
          return req.cookies;
        }
        
      },
  };

  const middlewares = [
    ...diesel.globalMiddlewares,
    ...(diesel.middlewares.get(pathname) || []),
  ];

  await executeMiddleware(middlewares, context);

  if (response.response) return response.response;

  if (routeHandler?.handler) {
    await routeHandler.handler(context);
    return response.response ?? new Response("no response from this handler!");
  }

  return new Response(`cannot get ${pathname}`, { status: 404 });
}

const extractDynamicParams = (routePattern, path) => {
  const object = {};
  const routeSegments = routePattern.split("/");
  const [pathWithoutQuery] = path.split("?"); // Ignore the query string in the path
  const pathSegments = pathWithoutQuery.split("/"); // Re-split after removing query

  if (routeSegments.length !== pathSegments.length) {
    return null; // Path doesn't match the pattern
  }

  routeSegments.forEach((segment, index) => {
    if (segment.startsWith(":")) {
      const dynamicKey = segment.slice(1); // Remove ':' to get the key name
      object[dynamicKey] = pathSegments[index]; // Map the path segment to the key
    }
  });

  return object;
};

async function executeMiddleware(middlewares, context) {
  for (const middleware of middlewares) {
    try {
      await Promise.resolve(middleware(context));
    } catch (error) {
      console.error("Middleware error:", error);
      return new Response("Internal Server Error", { status: 500 });
    }
  }
  return null;
}

function parseCookie(header){
    const cookies = {}
    if (!header) return cookies;

    const cookieArray = header.split(";")
    cookieArray.forEach(cookie =>{
      const [cookieName,cookievalue] = cookie.trim().split("=")
      cookies[cookieName] = cookievalue.split(" ")[0]
    })
    return cookies;
}
