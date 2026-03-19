import { Context, Diesel, } from 'diesel-core'



const app = new Diesel({})
app.get('/', (ctx: Context) => ctx.text("hello diesel"))
.routeNotFound((ctx) => Response.json({error: "route not found for "+ctx.path}, {status: 404}))



app.sub('/api/v1/*', app)

// app.get('/path/:name', (ctx) => {
//     return ctx.text(`hello ${ctx.params.name} with query: ${ctx.query.name}`)
// })



app.listen(3000)
