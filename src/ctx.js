export default function createCtx(req) {
  return {
    req,
    headers: {},
    settedValue: {},
    isAuthenticated:false,
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
      return props ? req.params[props] : req.params;
    },

    getQuery(props) {
      return props ? req.query[props] : req.query;
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
      return cookieName ? req.cookies[cookieName] : req.cookies;
    },
  };
}
