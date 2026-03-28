import { type Context } from "../../src/ctx";
import Diesel from "../../src/main";

export const app = new Diesel();

app
  .get("/", (c: Context) => {
    return c.text("Hi there!");
  })
  .all('/', (c) => {
    return c.text("from any")
  })
  .get('/hello/*', (ctx: Context) => {
    const params = ctx.params;
    return ctx.text("hello /hello/foo")
  })
  .get('/hello/foo', (ctx: Context) => {
    const params = ctx.params;
    return ctx.text("hello /foo")
  })

  const user = new Diesel({logger:false});
  user.get("/", (c: Context) => {
    return c.json({ message: "User Home!" });
  })
  user.get("/profile", (c: Context) => {
    return c.json({ message: "User Profile!" });
  });

  // console.log("user's instance hooks ", user.hooks)

  app.sub('/user/*', user)

// app.BunRoute("GET", "/", () => new Response("Hi there from Bun route!"));

app.listen(3000);
