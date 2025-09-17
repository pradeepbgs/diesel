import { Hono, type Context } from 'hono'
const app = new Hono()

// app.use('*',(_, next) => {
//     console.log('g')
//     next()
// })

app.get('/', (ctx: Context) => ctx.text("hello world!"))

app.get("/path/:name", (ctx: Context) => {
    return ctx.text(`hello ${ctx.req.param('name')} with query: ${ctx.req.query('name')}`)
})

console.log('hono is running on port', 3001)
Bun.serve({
    fetch: app.fetch,
    port: 3001,
})