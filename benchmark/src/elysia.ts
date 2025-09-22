import { Elysia } from 'elysia'

const loggingPlugin = (elysia: Elysia) =>
    elysia.onBeforeHandle(({ request }) => {
        console.log(`Request received: ${request.method} ${request.url}`);
    });

new Elysia()
    // .use(loggingPlugin)
    .get('/', 'Hello Elysia')
    .get('/user/:id', ({ params: { id } }) => id)
    .post('/form', ({ body }) => body)
    .listen(3002)