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
import { Diesel } from "diesel-core"

const app = new Diesel()
const port = 3000

app.get("/", async (xl) => {
 return xl.status(200).text("Hello world...!")
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

## Using Hooks in DieselJS

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
  const authToken = ctx.req.headers.get("Authorization");
  if (!authToken) {
    return new Response("Unauthorized", { status: 401 });
  }
})

// Define a postHandler hook
app.addHooks('postHandler', async (ctx) => {
  console.log(`Response sent for: ${ctx.req.url}`);
});

// Define an onSend hook
app.addHooks('onSend',async (ctx, result) => {
  console.log(`Sending response with status: ${result.status}`);
  return result; // You can modify the response here if needed
});
```

# Middleware example

```javascript
function h (xl) => {
  return xl.status(200).text("hi im from middleware")
}
app.use(hello)

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
```javascript
app.get("/hello/:id",(xl) => {
  const id = xl.getParams("id")
  const query = xl.getQuery() // you can pass query name also , you wanna get
  return xl.json({ msg: "Hello", id });
})
```


