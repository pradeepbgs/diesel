

Bun.serve({
    routes:{
        '/': () => new Response("Hello world!")
    },
    port:3000,
})