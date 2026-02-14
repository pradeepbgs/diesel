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

app.BunRoute("GET", "/", () => new Response("Hi there from Bun route!"));

app.listen(3000);
