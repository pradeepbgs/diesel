import { Hono } from "hono"
import Diesel from "../../src/main"
import type { Context } from "elysia"
import type { ContextType } from "diesel-core"
// import { Hono } from '/home/pradeep/Desktop/hono/src/hono'

export const app = new Diesel({
    router: 't2'
})
    // .use(() => { Math.random() })
    // .use(() => { Math.random() })
    // .use(() => { Math.random() })
    .get('/', (c: ContextType) => c.text("Hello Diesel!"))

const honoApp = new Hono()
    // .use((c, next) => {
    //     Math.random()
    //     return next()
    // })
    // .use((c, next) => {
    //     Math.random()
    //     return next()
    // }).use((c, next) => {
    //     Math.random()
    //     return next()
    // })
    .get("/", (c) => c.text("Hello Hono!"))




//app.mount('/hono/*', honoApp.fetch)
//honoApp.mount("/diesel/", app.fetch())

app.listen(3000, () => console.log('diesel is running on port', 3000))
console.log('hono is running on port', 3002)
Bun.serve({
    fetch: honoApp.fetch,
    port: 3002,
})
