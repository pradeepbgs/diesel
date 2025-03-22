import Diesel from "../../src/main";
import homepage from './templates/index.html'
import aboutPage from './templates/about.html'
const app = new Diesel();

app.addHooks("routeNotFound",(ctx) => {
    return ctx.file(`${import.meta.dirname}/templates/404.html`)
})

// app
// .static(
//         {
//             "/": homepage,
//             "/about": aboutPage
//         }
//     )


// app.serveStatic(`${import.meta.dirname}/public`);

app.get("/", (ctx) => {
    return ctx.json({
        message: "Hello World"
    })
})

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
