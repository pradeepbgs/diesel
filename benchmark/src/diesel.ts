import type { ContextType } from "../../dist/types"
import { extractDynamicParams } from "../../src/ctx"
import Diesel from "../../src/main"


const app = new Diesel()

// app.useLogger({app})
// app.addHooks('onRequest', () => console.log('req has come'))

const NUM_ROUTES = 10000;

for (let i = 0; i < NUM_ROUTES; i++) {
    app.get(`/${i}`, (ctx) => ctx.text(`Route ${i}`));
}

// app.use(() => { })
app.get('/', (c) => c.text("Hello world"))

//app.BunRoute('get','/',"hello bun/")

// app.use(() => console.log("console"))
// app.use('/bun', () => console.log("console2 from /bun"))

// app.BunRoute('get', '/', () => new Response("Hello world!"))
app.BunRoute('get', '/bun', () => new Response("bun is bun"))
// app.BunRoute("get", '/hello/:id', (req) => {
//     const url = new URL(req.url)
//     const params = extractDynamicParams("/hello/:id", url.pathname)
//     const param = params.id
//     return new Response(`here is the param: ${param}`)
// })
// app.BunRoute('get', "/hello/ok", () => new Response("hello/ok"))

app.get("/path/:name", (ctx: ContextType) => {
    return ctx.text(`hello ${ctx.params.name} with query: ${ctx.query.name}`)
})


app.listen(3000, () => console.log('diesel is running on port', 3000))

