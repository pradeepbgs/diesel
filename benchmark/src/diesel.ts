import { Hono } from "hono"
import Diesel from "../../src/main"
import type { ContextType } from "diesel-core"

export const app = new Diesel({
    router: 't2'
})


app.get('/:id', (c: ContextType) => { 

const extractedId = c.params.id

return c.json({
        id: extractedId,
        status: 'success',
        message: `ID ${extractedId} extracted and returned as JSON.`
    });

})

Bun.serve({
    fetch: app.fetch() as any,
    port: 3000,
})

