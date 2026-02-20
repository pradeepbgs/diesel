import type { get } from "node:http";
import Diesel from "../../src/main";
import type { ContextType } from "diesel-core";

export const app = new Diesel({ pipelineArchitecture: false });

app
  .get("/", (c: ContextType) => {
    return c.json({ message: "Hi there!" });
  })
  .get("/user/:id", (c: ContextType) => {
    const id = c.params.id;
    return c.json({ message: `User ${id}` });
  })
  .get('/hello/*', (ctx: ContextType) => {
    const params = ctx.params;
    return ctx.text("hello /hello/foo")
  })
  .get('/hello/foo', (ctx: ContextType) => {
    const params = ctx.params;
    return ctx.text("hello /foo")
  })

app.BunRoute("GET", "/", () => new Response("Hi there from Bun route!"));

app.listen(3000);
