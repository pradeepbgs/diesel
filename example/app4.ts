import { Context } from "../src/ctx";
import Diesel from "../src/main";

const app = new Diesel()


app.get('/', (c:Context) => {
    throw new Error("hee")
})

app.listen(3000)