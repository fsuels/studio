// Rate limiting for compliance API
// Prevents abuse of geolocation services

import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Common interface for rate limiters
interface IRatelimit {
  limit(identifier: string): Promise<{
    success: boolean;
    limit: number;
    remaining: number;
    reset: number; // Unix timestamp in milliseconds
  }>;
}

// Create Redis instance (you'll need to add UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN to env)
const redis = process.env.UPSTASH_REDIS_REST_URL
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    })
  : null;

// Fallback in-memory rate limiter for development
class MemoryRatelimit implements IRatelimit {
  private requests = new Map<string, { count: number; window: number }>();
  private maxRequests: number;
  private windowMs: number;

  constructor(requests: number, windowMs: number) {
    this.maxRequests = requests;
    this.windowMs = windowMs;
  }

  async limit(identifier: string) {
    const now = Date.now();
    const windowStart = Math.floor(now / this.windowMs) * this.windowMs;

    const key = `${identifier}:${windowStart}`;
    const existing = this.requests.get(key);

    if (!existing) {
      this.requests.set(key, { count: 1, window: windowStart });
      // Clean up old entries
      this.cleanup();
      return {
        success: true,
        limit: this.maxRequests,
        remaining: this.maxRequests - 1,
        reset: windowStart + this.windowMs,
      };
    }

    if (existing.count >= this.maxRequests) {
      return {
        success: false,
        limit: this.maxRequests,
        remaining: 0,
        reset: windowStart + this.windowMs,
      };
    }

    existing.count++;
    return {
      success: true,
      limit: this.maxRequests,
      remaining: this.maxRequests - existing.count,
      reset: windowStart + this.windowMs,
    };
  }

  private cleanup() {
    const now = Date.now();
    const cutoff = now - this.windowMs * 2; // Keep last 2 windows

    for (const [key, value] of this.requests.entries()) {
      if (value.window < cutoff) {
        this.requests.delete(key);
      }
    }
  }
}

// Wrapper for Upstash Ratelimit to match our interface
class UpstashRatelimitWrapper implements IRatelimit {
  constructor(private upstashRatelimit: Ratelimit) {}

  async limit(identifier: string) {
    const result = await this.upstashRatelimit.limit(identifier);
    return {
      success: result.success,
      limit: result.limit,
      remaining: result.remaining,
      reset: result.reset,
    };
  }
}

// Create rate limiter
export const ratelimit: IRatelimit = redis
  ? new UpstashRatelimitWrapper(new Ratelimit({
      redis: redis,
      limiter: Ratelimit.slidingWindow(100, '1 h'), // 100 requests per hour per IP
      analytics: true,
    }))
  : new MemoryRatelimit(100, 60 * 60 * 1000); // Fallback: 100 requests per hour
