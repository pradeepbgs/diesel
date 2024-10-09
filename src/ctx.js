export default function createCtx(req,url) {
  return {
    req,
    headers: {},
    settedValue: {},
    isAuthenticated:false,
    parsedQuery:null,
    parsedCookie:null,
    parsedParams:null,
    next: () => {},

    setHeader(key,value){
        this.headers[key]=value
    },

    set(key, value) {
      this.settedValue[key] = value;
    },

    get(key) {
      return this.settedValue[key];
    },

    setAuth(isAuthenticated) {
      this.isAuthenticated = isAuthenticated;
    },

    getAuth() {
      return this.isAuthenticated
    },

    text(data, status = 200) {
      return new Response(data, {
        status,
        headers: this.headers,
      });
    },

    json(data, status = 200) {
      return new Response(JSON.stringify(data), {
        status,
        headers: {
          "Content-Type": "application/json",
          ...this.headers,
        },
      });
    },

    file(filePath) {
      return new Response(file(filePath), {
        status: 200,
        headers: {
          "Content-Disposition": "attachment",
          ...this.headers,
        },
      });
    },

    redirect(path, status = 302) {
      return new Response(null, {
        status,
        headers: {
          Location: path,
          ...this.headers,
        },
      });
    },

    getParams(props) {
      if (!this.parsedParams) {
        this.parsedParams = extractDynamicParams(req.routePattern,url.pathname)
      }
      return props ? req.params[props] : req.params;
    },

    getQuery(props) {
      if (!this.parsedQuery) {
        this.parsedQuery = Object.fromEntries(url.searchParams.entries());
      }
      return props ? this.parsedQuery[props] : this.parsedQuery;
    },

    cookie(name, value, options = {}) {
      let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(
        value
      )}`;

      // Add options to cookie string (e.g., expiration, path, HttpOnly, etc.)
      if (options.maxAge) cookieString += `; Max-Age=${options.maxAge}`;
      if (options.expires)
        cookieString += `; Expires=${options.expires.toUTCString()}`;
      if (options.path) cookieString += `; Path=${options.path}`;
      if (options.domain) cookieString += `; Domain=${options.domain}`;
      if (options.secure) cookieString += `; Secure`;
      if (options.httpOnly) cookieString += `; HttpOnly`;
      if (options.sameSite) cookieString += `; SameSite=${options.sameSite}`;

      if (this.headers["Set-Cookie"]) {
        // If it's already an array, push the new cookie, otherwise convert to array
        const existingCookies = Array.isArray(this.headers["Set-Cookie"])
          ? this.headers["Set-Cookie"]
          : [this.headers["Set-Cookie"]];

        // Add the new cookie string to the array
        existingCookies.push(cookieString);
        

        // Update Set-Cookie header
        this.headers["Set-Cookie"] = existingCookies;
      } else {
        // If no cookies exist, initialize the header
        this.headers["Set-Cookie"] = cookieString;
      }
    },
    getCookie(cookieName) {
      if (!this.parsedCookie) {
        this.parsedCookie = parseCookie(req.headers.get('cookie'))
      }
      return cookieName ? this.parsedCookie[cookieName] : this.parsedCookie;
    },
  };
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