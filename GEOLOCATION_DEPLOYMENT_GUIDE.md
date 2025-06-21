# 🌍 Geolocation Service Production Deployment Guide

Your Smart Pricing Engine uses IP geolocation to detect user location and provide localized pricing. This guide ensures your geolocation service works reliably in production.

## 📋 Production Checklist

### ✅ 1. API Keys and Rate Limits

Your geolocation service uses multiple providers for reliability:

#### **Primary Provider: ipapi.co**
- **Free Tier**: 1,000 requests/day
- **Paid Plans**: $10/month for 10K requests
- **Setup**: No API key required for free tier
- **Production**: Consider paid plan for higher limits

```bash
# Test ipapi.co
curl "https://ipapi.co/8.8.8.8/json/"
```

#### **Fallback Provider: ip-api.com**
- **Free Tier**: 1,000 requests/hour
- **Rate Limits**: No API key, but IP-based limits
- **Production**: Monitor usage, consider commercial license

```bash
# Test ip-api.com
curl "http://ip-api.com/json/8.8.8.8"
```

#### **Secondary Fallback: geojs.io**
- **Free Tier**: No stated limits
- **Reliability**: Lower accuracy but good fallback
- **Production**: Works well as tertiary option

```bash
# Test geojs.io
curl "https://get.geojs.io/v1/ip/geo/8.8.8.8.json"
```

### ✅ 2. Environment Variables

Add these to your production environment:

```bash
# .env.production
GEOLOCATION_CACHE_TTL=86400000  # 24 hours in milliseconds
GEOLOCATION_TIMEOUT=5000        # 5 second timeout
GEOLOCATION_RETRY_ATTEMPTS=3    # Retry failed requests
ENABLE_GEOLOCATION_LOGGING=true # Log geolocation events
```

### ✅ 3. Caching Strategy

Your geolocation service includes built-in caching:

```typescript
// Built-in cache in src/lib/geolocation.ts
const locationCache = new Map<string, { result: LocationResult; expiry: number }>();
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours
```

#### **Production Enhancements:**

1. **Redis Cache** (Recommended for scale):
```typescript
// Add to src/lib/geolocation-cache.ts
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

export async function getCachedLocation(ip: string): Promise<LocationResult | null> {
  const cached = await redis.get(`geo:${ip}`);
  return cached ? JSON.parse(cached) : null;
}

export async function setCachedLocation(ip: string, location: LocationResult): Promise<void> {
  await redis.setex(`geo:${ip}`, 86400, JSON.stringify(location)); // 24 hour TTL
}
```

2. **Database Cache** (For persistence):
```sql
-- Add to your database
CREATE TABLE geolocation_cache (
  ip VARCHAR(45) PRIMARY KEY,
  country_code VARCHAR(2) NOT NULL,
  country VARCHAR(100) NOT NULL,
  state VARCHAR(100),
  state_code VARCHAR(10),
  city VARCHAR(100),
  provider VARCHAR(50) NOT NULL,
  confidence VARCHAR(10) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at TIMESTAMP NOT NULL
);

CREATE INDEX idx_geolocation_expires ON geolocation_cache(expires_at);
```

### ✅ 4. Error Handling and Monitoring

#### **Fallback Chain Implementation:**
```typescript
// Enhanced error handling in production
export async function getLocationFromIPProduction(ip: string): Promise<LocationResult> {
  const providers = [
    { name: 'ipapi.co', fn: getLocationFromIPAPI, priority: 1 },
    { name: 'ip-api.com', fn: getLocationFromIPAPIcom, priority: 2 },
    { name: 'geojs.io', fn: getLocationFromGeoJS, priority: 3 },
  ];

  let lastError: Error | null = null;

  for (const provider of providers) {
    try {
      const startTime = Date.now();
      const result = await provider.fn(ip);
      const responseTime = Date.now() - startTime;

      // Log successful geolocation
      console.log(`✅ Geolocation success: ${provider.name} (${responseTime}ms)`, {
        ip: ip.substring(0, 8) + '***', // Mask IP for privacy
        country: result.countryCode,
        provider: provider.name,
        responseTime,
      });

      return result;
    } catch (error) {
      lastError = error as Error;
      
      // Log provider failure
      console.warn(`⚠️ Geolocation provider failed: ${provider.name}`, {
        ip: ip.substring(0, 8) + '***',
        error: error.message,
        provider: provider.name,
      });
      
      continue;
    }
  }

  // All providers failed - use default location
  console.error(`❌ All geolocation providers failed for IP`, {
    ip: ip.substring(0, 8) + '***',
    lastError: lastError?.message,
  });

  // Return default US location
  return {
    ip: ip,
    country: 'United States',
    countryCode: 'US',
    state: 'California',
    stateCode: 'CA',
    city: 'San Francisco',
    provider: 'fallback-default',
    confidence: 'low',
  };
}
```

#### **Monitoring and Alerts:**
```typescript
// Add to src/lib/geolocation-monitoring.ts
export interface GeolocationMetrics {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  averageResponseTime: number;
  providerStats: Record<string, {
    requests: number;
    failures: number;
    avgResponseTime: number;
  }>;
}

// Track metrics for monitoring
export function trackGeolocationMetrics(
  provider: string, 
  success: boolean, 
  responseTime: number
) {
  // Send to your monitoring service (Datadog, New Relic, etc.)
  console.log('Geolocation metrics:', {
    provider,
    success,
    responseTime,
    timestamp: new Date().toISOString(),
  });
}
```

### ✅ 5. Privacy and Compliance

#### **GDPR Compliance:**
```typescript
// Privacy-aware geolocation
export interface PrivacySettings {
  logIPs: boolean;
  retainLocationData: boolean;
  maxRetentionDays: number;
}

export function getLocationWithPrivacy(
  ip: string, 
  privacy: PrivacySettings
): Promise<LocationResult> {
  // Hash IP for logging if privacy is enabled
  const logIP = privacy.logIPs ? ip : hashIP(ip);
  
  return getLocationFromIP(ip);
}

function hashIP(ip: string): string {
  // Simple hash for privacy (use crypto.createHash in production)
  return Buffer.from(ip).toString('base64').substring(0, 8) + '***';
}
```

#### **Data Retention Policy:**
```typescript
// Auto-cleanup old geolocation data
export async function cleanupOldLocationData(): Promise<void> {
  const maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days
  const cutoff = Date.now() - maxAge;
  
  // Clean memory cache
  for (const [ip, data] of locationCache.entries()) {
    if (data.expiry < cutoff) {
      locationCache.delete(ip);
    }
  }
  
  // Clean database cache (if using)
  // await db.query('DELETE FROM geolocation_cache WHERE expires_at < ?', [new Date(cutoff)]);
}
```

### ✅ 6. Testing in Production

#### **Health Check Endpoint:**
```typescript
// Add to src/app/api/health/geolocation/route.ts
export async function GET() {
  const testIPs = ['8.8.8.8', '1.1.1.1']; // Known US IPs
  const results = [];
  
  for (const ip of testIPs) {
    try {
      const startTime = Date.now();
      const location = await getLocationFromIP(ip);
      const responseTime = Date.now() - startTime;
      
      results.push({
        ip,
        success: true,
        provider: location.provider,
        responseTime,
        country: location.countryCode,
      });
    } catch (error) {
      results.push({
        ip,
        success: false,
        error: error.message,
      });
    }
  }
  
  const allSuccessful = results.every(r => r.success);
  
  return Response.json({
    status: allSuccessful ? 'healthy' : 'degraded',
    timestamp: new Date().toISOString(),
    results,
  }, {
    status: allSuccessful ? 200 : 503,
  });
}
```

### ✅ 7. Performance Optimization

#### **Request Optimization:**
```typescript
// Parallel requests with timeout
export async function getLocationFromIPOptimized(ip: string): Promise<LocationResult> {
  const TIMEOUT = 3000; // 3 second timeout
  
  const providers = [
    getLocationFromIPAPI(ip),
    getLocationFromIPAPIcom(ip),
    getLocationFromGeoJS(ip),
  ];
  
  // Race the providers - first successful response wins
  try {
    const result = await Promise.race([
      Promise.race(providers),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout')), TIMEOUT)
      ),
    ]) as LocationResult;
    
    return result;
  } catch (error) {
    // If all fail, return cached result or default
    return getDefaultLocation(ip);
  }
}
```

## 🚀 Deployment Commands

### **1. Install Dependencies**
```bash
npm install ioredis redis
# or
yarn add ioredis redis
```

### **2. Test Geolocation Service**
```bash
# Test your geolocation service
node scripts/test-smart-pricing.js

# Check specific endpoints
curl "http://localhost:3000/api/health/geolocation"
curl "http://localhost:3000/api/pricing/smart-session?planId=starter"
```

### **3. Production Environment Setup**
```bash
# Set production environment variables
export GEOLOCATION_CACHE_TTL=86400000
export ENABLE_GEOLOCATION_LOGGING=true
export REDIS_URL=redis://your-redis-instance:6379

# Deploy to your hosting platform
npm run build
npm run start
```

## 📊 Monitoring Dashboard

Set up monitoring for your geolocation service:

### **Key Metrics to Track:**
- ✅ Geolocation success rate (target: >95%)
- ✅ Average response time (target: <500ms)  
- ✅ Provider failure rates
- ✅ Cache hit ratio (target: >80%)
- ✅ Fallback usage frequency

### **Alerts to Configure:**
- 🚨 Geolocation success rate drops below 90%
- 🚨 Average response time exceeds 1 second
- 🚨 All providers failing simultaneously
- 🚨 Cache hit ratio drops below 70%

## 🔧 Troubleshooting

### **Common Issues:**

#### **1. All Providers Failing**
```bash
# Check if providers are accessible
curl -v "https://ipapi.co/8.8.8.8/json/"
curl -v "http://ip-api.com/json/8.8.8.8"
curl -v "https://get.geojs.io/v1/ip/geo/8.8.8.8.json"
```

#### **2. Slow Response Times**
- Enable Redis caching
- Reduce timeout values
- Use parallel provider requests

#### **3. Rate Limit Exceeded**
- Upgrade to paid plans
- Implement request queuing
- Increase cache TTL

#### **4. Incorrect Location Detection**
- Verify IP extraction logic
- Check proxy/CDN configuration
- Test with known IP addresses

Your geolocation service is now production-ready! 🎉