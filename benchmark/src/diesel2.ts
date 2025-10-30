import { Diesel, } from 'diesel-core'
import { HTTPException } from 'diesel-core/http-exception'
import { logger } from '../../src/middlewares/logger/logger'
import type { ContextType } from '../../src/types'



const app = new Diesel({})
app.get('/', (ctx: ContextType) => ctx.text("hello diesel"))

// app.get('/path/:name', (ctx) => {
//     return ctx.text(`hello ${ctx.params.name} with query: ${ctx.query.name}`)
// })

app.get('/err', (ctx: ContextType) => {
    throw new HTTPException(400, { res: ctx.json({ msg: "error shwn" }) })
})

app.listen(3000)
