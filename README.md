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
import Diesel  from "diesel-core"

const app = new Diesel()
const port = 3000

app.get("/", async (ctx:ContextType) => {
 return ctx.status(200).text("Hello world...!")
  // OR
  // return xl.text("Hello world!")
  // OR 
  // return new Response("Hello world")
})

// Start the server
app.listen(port, () => {
  console.log(`diesel is running on port ${port}`)
})
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
import  Diesel  from "diesel-core";
import jwt from 'jsonwebtoken';


const app = new Diesel();

async function authJwt (xl:ContextType, server?:Server): Promise<void | Response> {
  const token = await xl.getCookie("accessToken");  // Retrieve the JWT token from cookies
  if (!token) {
    return xl.status(401).json({ message: "Authentication token missing" });
  }
  try {
    // Verify the JWT token using a secret key
    const user = jwt.verify(token, secret);  // Replace with your JWT secret
    // Set the user data in context
    xl.setUser(user);

    // Proceed to the next middleware/route handler
    return xl.next();
  } catch (error) {
    return xl.status(403).json({ message: "Invalid token" });
  }
}

// Define routes and apply filter
app
  .filter()
  .routeMatcher('/api/user/register', '/api/user/login', '/test/:id', '/cookie') // Define public routes
  .permitAll() // Mark these routes as public (no auth required)
  .require(authJwt); // Apply the authJwt middleware to all other routes

// Example public route (no auth required)
app.get("/api/user/register", async (xl) => {
  return xl.json({ msg: "This is a public route. No authentication needed." });
});

// Example protected route (requires auth)
app.get("/api/user/profile", async (xl) => {
  // This route is protected, so the auth middleware will run before this handler
  const user = xl.getUser()
  return xl.json({ 
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
1. **require(fnc?: middlewareFunc)** :Means that defined routes in ***routeMatcher*** is public & All endpoints needs authentication.

*Note* : If you don't pass a middleware function to require(), DieselJS will throw an "Unauthorized" error by default. Ensure that you implement and pass a valid authentication function
```javascript 
.require(authJwt)
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

### How to Define Hooks

To define hooks in your DieselJS application, you can add them directly to your `Diesel` instance. Here's how to set up and use each hook:

### Example Usage

```javascript
// Define an onRequest hook
app.addHooks("onRequest",(xl) =>{
    console.log(`Request received: ${xl.req.method} ${xl.req.url}`);
})

// Define a preHandler hook
app.addHooks("preHandler",(xl) =>{
    // Check for authentication token
  const authToken = xl.req.headers.get("Authorization");
  if (!authToken) {
    return new Response("Unauthorized", { status: 401 });
  }
})

// Define a postHandler hook
app.addHooks('postHandler', async (xl) => {
  console.log(`Response sent for: ${xl.req.url}`);
});

// Define an onSend hook
app.addHooks('onSend',async (xl, result) => {
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
      return ctx.status(401).json({ message: "Authentication token missing" });
    }
    // Verify the JWT token using a secret key
    const user = jwt.verify(token, secret);
    ctx.set('user',user);
  } catch (error) {
    return ctx.status(403).json({ message: "Invalid token" });
  }
}

// this is a global middleware
app.use(authJwt)

// path middleware example
app.use("/user",authJWT)

```

# set cookies

```javascript
app.get("/set-cookie", async(xl) => {
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

  await xl.cookie("accessToken", accessToken, options)

  await xl.cookie("refreshToken", refreshToken, options)

  return xl.json({msg:"setting cookies"})
})
```

# Render a HTML page
```javascript
app.get("/render",async (xl) => {
  return xl.html(`${import.meta.dir}/index.html`)
})
```
# redirect
```javascript
app.get("/redirect",(xl) => {
  return xl.redirect("/");
})
```
# get params

**You can use set ***Multiparams***** , ***like this***

```javascript
app.get("/product/:productId/:productName)
```

```javascript
app.get("/hello/:id/",(xl) => {
  const id = xl.getParams("id")
  const query = xl.getQuery() // you can pass query name also , you wanna get
  return xl.json({ msg: "Hello", id });
})
```


