import Fastify from 'fastify'

const fastify = Fastify({
  logger: false
})

// Declare a route
fastify.get('/', function (request, reply) {
  reply.send("Hello world")
})

fastify.register(async (app) => {
  app.addHook('onRequest', (_,ok,done) => {
    console.log('module hook')
    done()
  })
  app.get('/test', async () => {
    return "Hello test"
  })
  // app.addHook('onSend', () => {
  //   console.log('onsend module hook')
  // })
})

fastify.addHook('onRequest', (_,ok,done) => {
  console.log('global hook')
  done()
})
fastify.addHook('onResponse', async (request, reply) => {
  console.log("url ", request.routeOptions.url)
  console.log("raw url ", request.url)
})

// Run the server!
fastify.listen({ port: 3003 }, function (err, address) {
    console.log('fastify running on 3003')
  if (err) {
    fastify.log.error(err)
    process.exit(1)
  }
  // Server is now listening on ${address}
})