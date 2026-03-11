import { Hono } from 'hono'
import Diesel from '../../src/main'

const app = new Hono()
    .get('/', (c, next) => {
        // return c.text('Hello Hono!')
        next()
    })
  .all('/', (c) => {
    return c.text("all")
  })

console.log('hono is running on port 3001')
Bun.serve({
    fetch: app.fetch,
    port: 3001,
})
