### [Read the docs](https://diesel-core.vercel.app/)

# DieselJS

**made only for bun***

**Diesel** is a simple and lightweight HTTP server library for Bun.js that provides you with complete control over your API routes and middleware. It is designed to be intuitive and efficient, allowing you to quickly set up a server, define routes, and optimize important paths for faster response times. 

With built-in support for TypeScript, DieselJS ensures type safety and improved developer experience, making it easier to catch errors during development. Whether you are building a small application or a large API, DieselJS helps you manage your routes and middleware seamlessly.


## Installation
Install diesel-core via bun | npm | yarn | pnpm 

```bash
npm install diesel-core
```
```bash
bun add diesel-core
```

### Code Example
```javascript
import {Diesel}  from "diesel-core"

const app = new Diesel()
const port = 3000

app.get("/", async (ctx:ContextType) => {
 return ctx.text("Hello world...!",200)
 // Note :- passing statusCode is optional
})

// Start the server
app.listen(port, () => {
  console.log(`diesel is running on port ${port}`)
})
```
# HttpMethods 
**In Diesel there are almost all http methods that you can use**

```javascript
app.get()

app.post()

app.put()

app.patch()

app.delete()

app.any() // used for all http methods such as GET,POST,PUT..

app.head()

app.options()

```


# CORS

### Diesel supports cors out of the box

``` javascript
app.cors({
  origin: ['http://localhost:5173','*'],
  methods: 'GET,POST,PUT,DELETE',
  allowedHeaders: 'Content-Type,Authorization'
})
```

# Filter and Route Security
**Diesel** provides a simple way to manage public and protected routes by using a filter() method. You can define specific routes to be publicly accessible, while others will require authentication or custom middleware functions.

### How to Use the Filter
The **filter()** method allows you to secure certain endpoints while keeping others public. You can specify routes that should be publicly accessible using permitAll(), and apply authentication or other middleware to the remaining routes with require().


### Example Usage
```javascript
import  {Diesel}  from "diesel-core";
import jwt from 'jsonwebtoken';


const app = new Diesel();

async function authJwt (ctx:ContextType, server?:Server): Promise<void | Response> {
  const token = await ctx.getCookie("accessToken");  // Retrieve the JWT token from cookies
  if (!token) {
    return ctx.json({ message: "Authentication token missing" },401);
  }
  try {
    // Verify the JWT token using a secret key
    const user = jwt.verify(token, secret);  // Replace with your JWT secret
    // Set the user data in context
    ctx.setUser(user);

    // Proceed to the next middleware/route handler
    return ctx.next();
  } catch (error) {
    return ctx.json({ message: "Invalid token" },403);
  }
}

// Define routes and apply filter
app
  .filter()
  .routeMatcher('/api/user/register', '/api/user/login', '/test/:id', '/cookie')
  .permitAll()
  .authenticate([authJwt]); 

// Example public route (no auth required)
app.get("/api/user/register", async (ctx:ContextType) => {
  return ctx.json({ msg: "This is a public route. No authentication needed." });
});

// Example protected route (requires auth)
app.get("/api/user/profile", async (ctx:ContextType) => {
  // This route is protected, so the auth middleware will run before this handler
  const user = ctx.getUser()
  return ctx.json({ 
    msg: "You are authenticated!" ,
    user
    });
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Diesel is running on port ${port}`);
})

```
# Filter Methods
1. **routeMatcher(...routes: string[])** : Passed endpoints in this routeMatcher will be ***Public*** means they don't need authentication, including those with dynamic parameters (e.g., /test/:id).

```javascript 
.routeMatcher('/api/user/register', '/api/user/login', '/test/:id')
```
1. **permitAll()** : Marks the routes specified in routeMatcher() as publicly accessible, meaning no middleware (like authentication) will be required for these routes.

```javascript 
.permitAll()
```
1. **authenticate([fnc?: middlewareFunc])** :Means that defined routes in ***routeMatcher*** is public & All endpoints needs authentication.

*Note* : If you don't pass a middleware function to authenticate(), DieselJS will throw an "Unauthorized" error by default. Ensure that you implement and pass a valid authentication function
```javascript 
.authenticate([authJwt])

.authenticate([authJwt, ....]) // you can can add many auth midlleware to authenticate
```
## Use Case
 * **Public Routes** :  Some routes ***(like /api/user/register or /api/user/login)*** are often open to all users without authentication. These routes can be specified with permitAll().

 * **Protected Routes** : For other routes ***(like /api/user/profile)***, you'll want to require authentication or custom middleware. Use require(authJwt) to ensure that the user is authenticated before accessing these routes.

# Using Hooks in DieselJS

DieselJS allows you to enhance your request handling by utilizing hooks at various stages of the request lifecycle. This gives you the flexibility to execute custom logic for logging, authentication, data manipulation, and more.


### Available Hooks

1. **onRequest**: Triggered when a request is received.
2. **preHandler**: Invoked just before the request handler executes.
3. **postHandler**: Executed after the request handler completes but before sending the response.
4. **onSend**: Called just before the response is sent to the client.
5. **onError** : Executes if any error occurs

### How to Define Hooks

To define hooks in your DieselJS application, you can add them directly to your `Diesel` instance. Here's how to set up and use each hook:

### Example Usage

```javascript

// define and onError hook

app.addHooks("onError",(error,req,url,server) => {
  console.log(`error occured ${error.message}`)
  // retunr new Response(......)
})

// Define an onRequest hook
app.addHooks("onRequest",(req,url,server) =>{
    console.log(`Request received: ${req.method} ${url}`);
})
// you get req,url & server instance in onReq

// Define a preHandler hook
app.addHooks("preHandler",(ctx:ContextType) =>{
    // Check for authentication token
  const authToken = ctx.req.headers.get("Authorization");
  if (!authToken) {
    return new Response("Unauthorized", { status: 401 });
  }
})

// Define a postHandler hook
app.addHooks('postHandler', async (ctx:ContextType) => {
  console.log(`Response sent for: ${ctx.req.url}`);
});

// Define an onSend hook
app.addHooks('onSend',async (ctx, result) => {
  console.log(`Sending response with status: ${result.status}`);
  return result; // You can modify the response here if needed
});
```

# Middleware example

**No Need to call NonSense *next()* in Middleware**

**just dont return , if evrything goes right**

```javascript
async function authJwt (ctx:ContextType, server?:Server): Promise<void | Response> {
  
  try {
    const token = ctx?.getCookie("accessToken"); 
    if (!token) {
      return ctx.json({ message: "Authentication token missing" },401);
    }
    // Verify the JWT token using a secret key
    const user = jwt.verify(token, secret);
    ctx.set('user',user);
  } catch (error) {
    return ctx.json({ message: "Invalid token" },403);
  }
}

// this is a global middleware
app.use(authJwt)
OR 
app.use([authJwt,middleware2 , ...])

// path middleware example
app.use("/user",authJWT)
OR
app.use(["/user","/home"],[authJWT,middleware2])
//means /user and /home has two middlewares


```

# set cookies

```javascript
app.get("/set-cookie", async(ctx:ContextType) => {
  const user = {
    name: "pk",
    age: 22,
  }

  const accessToken = jwt.sign(user, secret, { expiresIn: "1d" })

  const refreshToken = jwt.sign(user, secret ,{ expiresIn: "10d" })

  const options = {
    httpOnly: true, 
    secure: true, 
    maxAge: 24 * 60 * 60 * 1000, 
    sameSite: "Strict", 
    path: "/", 
  }

  ctx
  .setCookie("accessToken", accessToken, options)
  .setCookie("refreshToken", refreshToken, options)

  return ctx.json({msg:"setting cookies"})
})
```

# Render a HTML page
```javascript
app.get("/render",async (ctx) => {
  return ctx.file(`${import.meta.dir}/index.html`)
})
```
# redirect
```javascript
app.get("/redirect",(ctx:ContextType) => {
  return ctx.redirect("/");
})
```
# get params

**You can use set ***Multiparams***** , ***like this***

```javascript
app.get("/product/:productId/:productName)
```

```javascript
app.get("/hello/:id/",(ctx:ContextType) => {
  const id = ctx.getParams("id")
  const query = ctx.getQuery() // you can pass query name also , you wanna get
  return ctx.json({ msg: "Hello", id });
})
```


