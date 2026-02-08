  import Diesel from "../../src/main"
  import type { ContextType } from "diesel-core"

  export const app = new Diesel({pipelineArchitecture:false})


  app
      .get('/', (c: ContextType) => {
          return c.json({ message: "Hi there!" });
      })

  for (let i = 0; i < 100; i++) {
    app.get(`/r${i}`, (ctx:ContextType) => {
      return ctx.json({ ok: true, route: i });
    });
  }


  app.listen(3000)
