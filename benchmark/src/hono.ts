import { Hono } from 'hono'
import Diesel from '../../src/main'

const app = new Hono()
    .get('/:id', (c) => {

        const extractedId = c.req.param('id');

        return c.json({
            id: extractedId,
            status: 'success',
            message: `ID ${extractedId} extracted and returned as JSON.`
        });


    })

const dieselApp = new Diesel().get('/', () => new Response('Hello Diesel!'))

app.mount('/api', dieselApp.fetch())

Bun.serve({
    fetch: app.fetch,
    port: 3001,
})
