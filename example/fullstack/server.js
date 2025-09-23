import Diesel from "../../src/main";
import homepage from './templates/index.html'
import aboutPage from './templates/about.html'
const app = new Diesel();

app.addHooks("routeNotFound", (ctx) => {
    return ctx.file(`${import.meta.dirname}/templates/404.html`)
})

// app
//     .staticHtml(
//         {
//             "/": homepage,
//         }
//     )

// app.staticHtml({
//     "/about": aboutPage
// })

app.serveStatic(
    `${import.meta.dirname}/public`,
    '/static'
);

app.get("/", (ctx) => {
    return ctx.json({
        message: "Hello World"
    })
})

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
