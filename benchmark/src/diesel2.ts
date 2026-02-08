import { Diesel, } from 'diesel-core'
import { logger } from '../../src/middlewares/logger/logger'
import type { ContextType } from '../../src/types'



const app = new Diesel({})
app.get('/', (ctx: ContextType) => ctx.text("hello diesel"))

// app.get('/path/:name', (ctx) => {
//     return ctx.text(`hello ${ctx.params.name} with query: ${ctx.query.name}`)
// })



app.listen(3000)
