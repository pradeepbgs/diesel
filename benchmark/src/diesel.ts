import { Hono } from "hono"
import Diesel from "../../src/main"
import type { ContextType } from "diesel-core"

export const app = new Diesel({pipelineArchitecture:true})


app
    .get('/', (c: ContextType) => {
        return c.text("hello diesel")
    })

Bun
    .serve({
        fetch: app.fetch() as any,
        port: 3000,
    })

