import { Hono } from 'hono'
import Diesel from '../../src/main'

const app = new Hono()
.get('/', (c) => c.text('Hello Hono!'))

const dieselApp = new Diesel().get('/', () => new Response('Hello Diesel!'))

app.mount('/api', dieselApp.fetch())

Bun.serve({
    fetch: app.fetch,
    port: 3001,
})