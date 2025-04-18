import Redis from 'ioredis'
export const redis = new Redis({
  host: '127.0.0.1',
  port: 6379,
})
redis.ping().then((res) => {
  console.log("Redis ping successful:",res)
}).catch((err) => {
  console.log(err)
})