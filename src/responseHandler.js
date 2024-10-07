class ResponseHandler {
    constructor(){
        this.headers = {}
    }

    text(message, status = 200) {
       return new Response(message, { 
        status ,
        headers: this.headers
    });
    }

    json(data, status = 200) {
        return new Response(JSON.stringify(data), {
            status,
            headers: {
                ...this.headers,
                "Content-Type": "application/json"
            }
        });
    }

    file(filePath) {
        this.response = new Response(file(filePath),{
            headers:this.headers
        });
    }

    redirect(location, status = 302) {
        return Response.redirect(location, {
            status,
            headers:this.headers
        });
    }

    setCookies(name,value,options={}){
        let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

        // Add options to cookie string (e.g., expiration, path, HttpOnly, etc.)
        if (options.maxAge) cookieString += `; Max-Age=${options.maxAge}`;
        if (options.expires) cookieString += `; Expires=${options.expires.toUTCString()}`;
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

        
    }
}

export default ResponseHandler