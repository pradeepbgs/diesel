
import homepage from './templates/index.html'
import aboutPage from './templates/about.html'


Bun.serve({
  routes: {
    '/homepage/*': homepage,
    '/about': aboutPage,
    '/api/*': (req) => {
      if (req.method === 'GET') {
        return new Response('Hello, World!', { status: 200 });
      }
      return new Response('Method Not Allowed', { status: 405 });
    }
  }
})

