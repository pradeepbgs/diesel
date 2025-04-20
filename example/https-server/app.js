import { logger } from "../../dist/middlewares/logger/logger";
import Diesel  from "../../src/main";
import fs from 'fs'
import { requestId } from "../../src/middlewares/request-id";

const app  = new Diesel()


const options = {
    key: './server.key', 
    cert: './server.crt',
}

// app.use(requestId())
app.useLogger({app})

app.get('/',(ctx) => ctx.send("hello world"))

app.listen(3000,options,()=>console.log('https server is running on port 3000'))