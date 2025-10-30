import { createApp } from '@morojs/moro';

const app = createApp({
    logger: false,
});

app.get('/', () => {
    return { message: 'Hello World' };
});


app.listen(3000);
