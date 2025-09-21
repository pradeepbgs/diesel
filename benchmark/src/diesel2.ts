import { Diesel } from 'diesel-core'

const app = new Diesel()

app.BunRoute('get','/', 'Hello bun/')
app.get('/', (ctx) => ctx.text('hello diesel'))

app.listen(3000)