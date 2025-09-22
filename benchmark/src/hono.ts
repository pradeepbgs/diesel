import { Hono, type Context } from 'hono'
const app = new Hono()

// app.use('*',(_, next) => {
//     console.log('g')
//     next()
// })

const NUM_ROUTES = 10000;

// for (let i = 0; i < NUM_ROUTES; i++) {
//     app.get(`/${i}`, (ctx) => ctx.text(`Route ${i}`));
// }
// app.use("*", (_, next) => { next() })

app.get('/', (ctx: Context) => ctx.text("hello world!"))

app.get("/path/:name", (ctx: Context) => {
    return ctx.text(`hello ${ctx.req.param('name')} with query: ${ctx.req.query('name')}`)
})

console.log('hono is running on port', 3001)
Bun.serve({
    fetch: app.fetch,
    port: 3001,
})