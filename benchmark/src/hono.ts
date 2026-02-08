import { Hono } from 'hono'
import Diesel from '../../src/main'

const app = new Hono()
    .get('/', (c) => {
        return c.text('Hello Hono!')
    })

Bun.serve({
    fetch: app.fetch,
    port: 3001,
})
