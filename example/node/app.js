import Diesel from '../../dist/main.js'
import { serve } from '../../dist/adaptor/node/main.js'
import { connInfo } from '../../dist/adaptor/node/conninfo.js'
import { HTTPException } from '../../dist/http-exception.js'

const app = new Diesel({})
// app.addHooks('onRequest', () => console.log("Hello onReq"))
app.get("/", (c) => {
    const a = connInfo(c.req)
    console.log(a)
    return c.text(`hello from node diesel/`)
})

app.get('/err', () => {
    throw new HTTPException(400, { message: "err showin" })
})

serve({
    fetch: app.fetch(),
    port: 3000
})