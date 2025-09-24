import Diesel from "../../dist/main";


const app = new Diesel({ platform: 'cf' })

app.get('/', ctx => ctx.send("Hello cf workers/"))

export default {
    fetch: app.cfFetch()
}