import { type Context } from "../../src/ctx";
import Diesel from "../../src/main";

export const app = new Diesel();

app
  .get("/", (c: Context) => {
    return c.json({ message: "Hi there!" });
  })
  .all('/', (c) => {
    return c.text("from any")
  })
  .get("/user/:id", (c: Context) => {
    const id = c.params.id;
    return c.json({ message: `User ${id}` });
  })
  .get('/hello/*', (ctx: Context) => {
    const params = ctx.params;
    return ctx.text("hello /hello/foo")
  })
  .get('/hello/foo', (ctx: Context) => {
    const params = ctx.params;
    return ctx.text("hello /foo")
  })

  const user = new Diesel();
  user.all("/", (c: Context) => {
    return c.json({ message: "User Home!" });
  })
  .get("/profile", (c: Context) => {
    return c.json({ message: "User Profile!" });
  });


  app.sub('/user', user)

// app.BunRoute("GET", "/", () => new Response("Hi there from Bun route!"));

app.listen(3000);
