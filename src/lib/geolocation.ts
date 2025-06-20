// IP Geolocation service for state-based compliance
// Multiple fallback providers for reliability

export interface LocationResult {
  ip: string;
  country: string;
  countryCode: string;
  state: string;
  stateCode: string;
  city: string;
  zipCode?: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
  provider: string;
  confidence: 'high' | 'medium' | 'low';
}

export interface GeolocationError {
  error: string;
  provider: string;
  fallbackUsed: boolean;
}

// Primary geolocation provider (ipapi.co - free tier: 1000 requests/day)
async function getLocationFromIPAPI(ip: string): Promise<LocationResult> {
  const response = await fetch(`https://ipapi.co/${ip}/json/`, {
    headers: {
      'User-Agent': '123LegalDoc-Compliance/1.0'
    }
  });

  if (!response.ok) {
    throw new Error(`IPAPI error: ${response.status}`);
  }

  const data = await response.json();
  
  if (data.error) {
    throw new Error(`IPAPI error: ${data.reason}`);
  }

  return {
    ip: data.ip,
    country: data.country_name,
    countryCode: data.country_code,
    state: data.region,
    stateCode: data.region_code,
    city: data.city,
    zipCode: data.postal,
    latitude: parseFloat(data.latitude),
    longitude: parseFloat(data.longitude),
    timezone: data.timezone,
    provider: 'ipapi.co',
    confidence: 'high'
  };
}

// Fallback provider 1 (ip-api.com - free tier: 1000 requests/hour)
async function getLocationFromIPAPIcom(ip: string): Promise<LocationResult> {
  const response = await fetch(`http://ip-api.com/json/${ip}?fields=status,message,country,countryCode,region,regionName,city,zip,lat,lon,timezone,query`, {
    headers: {
      'User-Agent': '123LegalDoc-Compliance/1.0'
    }
  });

  if (!response.ok) {
    throw new Error(`IP-API.com error: ${response.status}`);
  }

  const data = await response.json();
  
  if (data.status !== 'success') {
    throw new Error(`IP-API.com error: ${data.message}`);
  }

  return {
    ip: data.query,
    country: data.country,
    countryCode: data.countryCode,
    state: data.regionName,
    stateCode: data.region,
    city: data.city,
    zipCode: data.zip,
    latitude: data.lat,
    longitude: data.lon,
    timezone: data.timezone,
    provider: 'ip-api.com',
    confidence: 'medium'
  };
}

// Fallback provider 2 (geojs.io - free tier: no limit mentioned)
async function getLocationFromGeoJS(ip: string): Promise<LocationResult> {
  const response = await fetch(`https://get.geojs.io/v1/ip/geo/${ip}.json`, {
    headers: {
      'User-Agent': '123LegalDoc-Compliance/1.0'
    }
  });

  if (!response.ok) {
    throw new Error(`GeoJS error: ${response.status}`);
  }

  const data = await response.json();

  return {
    ip: data.ip,
    country: data.country,
    countryCode: data.country_code,
    state: data.region,
    stateCode: data.region, // GeoJS doesn't provide state codes
    city: data.city,
    latitude: parseFloat(data.latitude),
    longitude: parseFloat(data.longitude),
    timezone: data.timezone,
    provider: 'geojs.io',
    confidence: 'low'
  };
}

// Get client IP from various headers (for server-side use)
export function getClientIP(request: Request): string {
  // Check various headers in order of preference
  const headers = [
    'cf-connecting-ip',      // Cloudflare
    'x-forwarded-for',       // Load balancers/proxies
    'x-real-ip',            // Nginx
    'x-client-ip',          // Apache
    'x-forwarded',          // Some proxies
    'forwarded-for',        // Less common
    'forwarded'             // Standard header
  ];

  for (const header of headers) {
    const value = request.headers.get(header);
    if (value) {
      // x-forwarded-for can contain multiple IPs (client, proxy1, proxy2)
      const firstIP = value.split(',')[0].trim();
      if (isValidIP(firstIP)) {
        return firstIP;
      }
    }
  }

  // Fallback - this won't work in production behind proxies
  return '127.0.0.1';
}

// Validate IP address format
function isValidIP(ip: string): boolean {
  const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
  const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
  
  if (ipv4Regex.test(ip)) {
    const parts = ip.split('.');
    return parts.every(part => parseInt(part) >= 0 && parseInt(part) <= 255);
  }
  
  return ipv6Regex.test(ip);
}

// Main geolocation function with fallbacks
export async function getLocationFromIP(ip: string): Promise<LocationResult> {
  // Skip geolocation for local IPs
  if (ip === '127.0.0.1' || ip === '::1' || ip.startsWith('192.168.') || ip.startsWith('10.')) {
    return {
      ip: ip,
      country: 'United States',
      countryCode: 'US',
      state: 'California', // Default to California for development
      stateCode: 'CA',
      city: 'San Francisco',
      provider: 'localhost-default',
      confidence: 'low'
    };
  }

  if (!isValidIP(ip)) {
    throw new Error(`Invalid IP address: ${ip}`);
  }

  const providers = [
    getLocationFromIPAPI,
    getLocationFromIPAPIcom,
    getLocationFromGeoJS
  ];

  let lastError: Error | null = null;

  for (const provider of providers) {
    try {
      const result = await provider(ip);
      
      // Validate result has required fields
      if (!result.countryCode || !result.stateCode) {
        throw new Error('Incomplete location data');
      }

      // Ensure US states have proper 2-letter codes
      if (result.countryCode === 'US' && result.stateCode.length !== 2) {
        // Try to map full state name to code
        result.stateCode = getStateCodeFromName(result.state) || result.stateCode;
      }

      return result;
    } catch (error) {
      lastError = error as Error;
      console.warn(`Geolocation provider failed: ${error}`);
      continue;
    }
  }

  throw new Error(`All geolocation providers failed. Last error: ${lastError?.message}`);
}

// Map state names to codes (for providers that don't return codes)
function getStateCodeFromName(stateName: string): string | null {
  const stateMap: Record<string, string> = {
    'Alabama': 'AL', 'Alaska': 'AK', 'Arizona': 'AZ', 'Arkansas': 'AR',
    'California': 'CA', 'Colorado': 'CO', 'Connecticut': 'CT', 'Delaware': 'DE',
    'Florida': 'FL', 'Georgia': 'GA', 'Hawaii': 'HI', 'Idaho': 'ID',
    'Illinois': 'IL', 'Indiana': 'IN', 'Iowa': 'IA', 'Kansas': 'KS',
    'Kentucky': 'KY', 'Louisiana': 'LA', 'Maine': 'ME', 'Maryland': 'MD',
    'Massachusetts': 'MA', 'Michigan': 'MI', 'Minnesota': 'MN', 'Mississippi': 'MS',
    'Missouri': 'MO', 'Montana': 'MT', 'Nebraska': 'NE', 'Nevada': 'NV',
    'New Hampshire': 'NH', 'New Jersey': 'NJ', 'New Mexico': 'NM', 'New York': 'NY',
    'North Carolina': 'NC', 'North Dakota': 'ND', 'Ohio': 'OH', 'Oklahoma': 'OK',
    'Oregon': 'OR', 'Pennsylvania': 'PA', 'Rhode Island': 'RI', 'South Carolina': 'SC',
    'South Dakota': 'SD', 'Tennessee': 'TN', 'Texas': 'TX', 'Utah': 'UT',
    'Vermont': 'VT', 'Virginia': 'VA', 'Washington': 'WA', 'West Virginia': 'WV',
    'Wisconsin': 'WI', 'Wyoming': 'WY', 'District of Columbia': 'DC'
  };

  return stateMap[stateName] || null;
}

// Cache geolocation results to reduce API calls
const locationCache = new Map<string, { result: LocationResult; expiry: number }>();
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours

export async function getCachedLocationFromIP(ip: string): Promise<LocationResult> {
  const cached = locationCache.get(ip);
  
  if (cached && Date.now() < cached.expiry) {
    return cached.result;
  }

  const result = await getLocationFromIP(ip);
  
  locationCache.set(ip, {
    result,
    expiry: Date.now() + CACHE_DURATION
  });

  return result;
}

// Development/testing helper
export function mockLocation(stateCode: string): LocationResult {
  return {
    ip: '127.0.0.1',
    country: 'United States',
    countryCode: 'US',
    state: stateCode,
    stateCode: stateCode.toUpperCase(),
    city: 'Test City',
    provider: 'mock',
    confidence: 'high'
  };
}