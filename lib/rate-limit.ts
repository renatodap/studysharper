import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

// Create a new ratelimiter that allows 10 requests per minute
const redis = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
  : null

export const ratelimit = redis ? {
  ai: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, '1 m'),
    analytics: true,
    prefix: '@upstash/ratelimit/ai',
  }),
  
  api: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(100, '1 m'),
    analytics: true,
    prefix: '@upstash/ratelimit/api',
  }),
} : null

export async function checkRateLimit(
  identifier: string,
  type: 'ai' | 'api' = 'api'
) {
  if (!ratelimit) {
    // If rate limiting is not configured, allow all requests
    return {
      success: true,
      limit: 999,
      reset: Date.now() + 60000,
      remaining: 999,
    }
  }

  const { success, limit, reset, remaining } = await ratelimit[type].limit(
    identifier
  )

  return {
    success,
    limit,
    reset,
    remaining,
  }
}