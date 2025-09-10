import Diesel from "../../src/main"
import type { ContextType } from "../../src/types"

const app = new Diesel()

app.get('/', (ctx: ContextType) => ctx.text("hello world!"))

app.get("/path/:name", (ctx: ContextType) => {
    return ctx.text(`hello ${ctx.params.name} with query: ${ctx.query.name}`)
})


app.listen(3000, () => console.log('diesel is running on port', 3000))