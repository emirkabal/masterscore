import { Redis } from "@upstash/redis"

const config = useRuntimeConfig()
const redis = new Redis({
  url: config.UPSTASH_REDIS_REST_URL,
  token: config.UPSTASH_REDIS_REST_TOKEN
})
export default defineEventHandler(() => {
  redis.flushall()
  return {
    status: 200
  }
})
