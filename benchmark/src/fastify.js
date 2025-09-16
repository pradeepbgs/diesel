import Fastify from 'fastify'

const fastify = Fastify({
  logger: false
})

// Declare a route
fastify.get('/', function (request, reply) {
  reply.send("Hello world")
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