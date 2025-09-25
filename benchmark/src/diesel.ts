import { Hono } from "hono"
import Diesel from "../../src/main"
// import { Hono } from '/home/pradeep/Desktop/hono/src/hono'

const app = new Diesel({})
    .get('/', (c) => c.text("Hello Diesel!"))

const honoApp = new Hono()
    .get("/", (c) => c.text("Hello Hono!"))




//app.mount('/hono/*', honoApp.fetch)
//honoApp.mount("/diesel/", app.fetch())

app.listen(3000, () => console.log('diesel is running on port', 3000))
console.log('hono is running on port', 3002)
Bun.serve({
    fetch: honoApp.fetch,
    port: 3002,
})
