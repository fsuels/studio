// Rate limiting for compliance API
// Prevents abuse of geolocation services

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Create Redis instance (you'll need to add UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN to env)
const redis = process.env.UPSTASH_REDIS_REST_URL 
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    })
  : null;

// Fallback in-memory rate limiter for development
class MemoryRatelimit {
  private requests = new Map<string, { count: number; window: number }>();
  private limit: number;
  private windowMs: number;

  constructor(requests: number, windowMs: number) {
    this.limit = requests;
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
      return { success: true, limit: this.limit, remaining: this.limit - 1, reset: new Date(windowStart + this.windowMs) };
    }
    
    if (existing.count >= this.limit) {
      return { success: false, limit: this.limit, remaining: 0, reset: new Date(windowStart + this.windowMs) };
    }
    
    existing.count++;
    return { success: true, limit: this.limit, remaining: this.limit - existing.count, reset: new Date(windowStart + this.windowMs) };
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

// Create rate limiter
export const ratelimit = redis 
  ? new Ratelimit({
      redis: redis,
      limiter: Ratelimit.slidingWindow(100, "1 h"), // 100 requests per hour per IP
      analytics: true,
    })
  : new MemoryRatelimit(100, 60 * 60 * 1000); // Fallback: 100 requests per hour