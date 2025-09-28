import { Diesel, type ContextType } from 'diesel-core'
//import { HTTPException } from 'diesel-core/http-exception'



const app = new Diesel({
    
})

//app.BunRoute('get', '/', 'Hello bun/')
app.get('/', (ctx:ContextType) => ctx.text('hello diesel'))

// app.get('/path/:name', (ctx) => {
//     return ctx.text(`hello ${ctx.params.name} with query: ${ctx.query.name}`)
// })

// app.get('/err', () => {
//     throw new HTTPException(400,{message:"err showing"})
// })

app.listen(3000)
