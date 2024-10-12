# DieselJS

**Diesel** is a simple and lightweight HTTP server library for Bunjs, designed to give you control over your API routes and middleware in an intuitive and efficient way. With DieselJS, you can quickly set up a server, define routes, and optimize important routes for faster response times.


## Installation

Install diesel-core via bun, npm , yarn , pnpm :

```bash
npm install diesel-core

import diesel from "diesel-core";
import { hello } from "./hello.js";

const maya = new diesel();
const port = 3000;

// Middleware example
app.use(hello);


app.get("/", async (xl) => {
 return xl.status(200).text("Hello world...!")
  OR
  return xl.text("Hello world!")
  OR 
  return new Response("Hello world")
});

// Render a HTML page
app.get("/render",async (xl) => {
  return xl.html(`${import.meta.dir}/index.html`);
});

app.get("/async-test",async (xl) => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return xl.json({ message: "Async operation completed" },200);
});


app.get("/redirect",(xl) => {
  return xl.redirect("/");
});

app.get("/hello/:id",(xl) => {
  const id = xl.getParams("id")
  return xl.json({ msg: "Hello", id });
});


// Start the server
app.listen(port, () => {
  console.log(`diesel is running on port ${port}`);
});

