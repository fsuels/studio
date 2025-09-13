// src/config/experiments.ts
// Remote Config A/B testing framework with deterministic user bucketing

import { getRemoteConfig, getValue, fetchAndActivate, type RemoteConfig } from 'firebase/remote-config';
import { getAuth } from 'firebase/auth';
import { app } from '../lib/firebase';

// CRC32 implementation for deterministic bucketing
const CRC32_TABLE = (() => {
  const table: number[] = [];
  for (let i = 0; i < 256; i++) {
    let crc = i;
    for (let j = 0; j < 8; j++) {
      crc = (crc & 1) ? (0xEDB88320 ^ (crc >>> 1)) : (crc >>> 1);
    }
    table[i] = crc >>> 0; // Ensure unsigned 32-bit
  }
  return table;
})();

function crc32(str: string): number {
  let crc = 0xFFFFFFFF;
  for (let i = 0; i < str.length; i++) {
    const byte = str.charCodeAt(i);
    crc = (crc >>> 8) ^ CRC32_TABLE[(crc ^ byte) & 0xFF];
  }
  return (crc ^ 0xFFFFFFFF) >>> 0; // Ensure unsigned 32-bit result
}

// Cache for Remote Config values
interface ExperimentCache {
  [key: string]: {
    enabled: boolean;
    percentage: number;
    lastFetch: number;
    ttl: number;
  };
}

let experimentCache: ExperimentCache = {};
let lastGlobalFetch = 0;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
const GLOBAL_FETCH_INTERVAL_MS = 30 * 1000; // 30 seconds

// Remote Config singleton
let remoteConfigInstance: RemoteConfig | null = null;

function getRemoteConfigInstance() {
  if (!remoteConfigInstance) {
    remoteConfigInstance = getRemoteConfig(app);
    // Set defaults for experiments
    remoteConfigInstance.defaultConfig = {
      // Experiment flags with default configurations
      hybridSearch: JSON.stringify({ enabled: false, percentage: 0 }),
      semanticReranking: JSON.stringify({ enabled: false, percentage: 0 }),
      negativeFiltering: JSON.stringify({ enabled: false, percentage: 0 }),
      phraseMatching: JSON.stringify({ enabled: false, percentage: 0 }),
      
      // Feature flags
      enableVectorSearch: JSON.stringify({ enabled: false, percentage: 0 }),
      enableAdvancedFilters: JSON.stringify({ enabled: false, percentage: 0 }),
      enableSmartSuggestions: JSON.stringify({ enabled: false, percentage: 0 }),
      
      // UI experiments
      newSearchInterface: JSON.stringify({ enabled: false, percentage: 0 }),
      enhancedResultCards: JSON.stringify({ enabled: false, percentage: 0 }),
      voiceSearchBeta: JSON.stringify({ enabled: false, percentage: 0 }),
    };
    
    // Configure Remote Config settings
    remoteConfigInstance.settings = {
      minimumFetchIntervalMillis: 30000, // 30 seconds minimum between fetches
      fetchTimeoutMillis: 10000, // 10 second fetch timeout
    };
  }
  return remoteConfigInstance;
}

interface ExperimentConfig {
  enabled: boolean;
  percentage: number;
  description?: string;
  rolloutStrategy?: 'percentage' | 'whitelist' | 'gradual';
  whitelist?: string[];
  minVersion?: string;
  maxVersion?: string;
  platforms?: string[];
  countries?: string[];
}

/**
 * Parse experiment configuration from Remote Config
 */
function parseExperimentConfig(configValue: string): ExperimentConfig {
  try {
    const parsed = JSON.parse(configValue);
    return {
      enabled: Boolean(parsed.enabled),
      percentage: Math.max(0, Math.min(100, Number(parsed.percentage) || 0)),
      description: parsed.description,
      rolloutStrategy: parsed.rolloutStrategy || 'percentage',
      whitelist: Array.isArray(parsed.whitelist) ? parsed.whitelist : [],
      minVersion: parsed.minVersion,
      maxVersion: parsed.maxVersion,
      platforms: Array.isArray(parsed.platforms) ? parsed.platforms : [],
      countries: Array.isArray(parsed.countries) ? parsed.countries : [],
    };
  } catch (error) {
    console.warn(`Failed to parse experiment config: ${configValue}`, error);
    return { enabled: false, percentage: 0 };
  }
}

/**
 * Get current user ID for bucketing
 */
function getCurrentUserId(): string {
  const auth = getAuth(app);
  const user = auth.currentUser;
  
  if (user) {
    return user.uid;
  }
  
  // For anonymous users, create or retrieve a stable identifier
  let anonymousId = localStorage.getItem('experiment_anonymous_id');
  if (!anonymousId) {
    anonymousId = `anon_${Date.now()}_${Math.random().toString(36).substring(2)}`;
    localStorage.setItem('experiment_anonymous_id', anonymousId);
  }
  
  return anonymousId;
}

/**
 * Determine if user should be in experiment bucket
 * Uses deterministic bucketing based on CRC32(uid + flagName)
 */
function isUserInExperimentBucket(userId: string, flagName: string, percentage: number): boolean {
  // Handle edge cases
  if (!userId || !flagName) return false;
  if (percentage <= 0) return false;
  if (percentage >= 100) return true;
  
  const bucketingKey = `${userId}:${flagName}`;
  const hash = crc32(bucketingKey);
  
  // Convert percentage to 32-bit threshold
  // percentage = 50 means hash < 0x80000000 (50% of 2^32)
  const threshold = (percentage / 100) * 0x100000000;
  
  return hash < threshold;
}

/**
 * Fetch Remote Config values with caching
 */
async function fetchRemoteConfig(): Promise<void> {
  const now = Date.now();
  
  // Global rate limiting
  if (now - lastGlobalFetch < GLOBAL_FETCH_INTERVAL_MS) {
    return;
  }
  
  try {
    const remoteConfig = getRemoteConfigInstance();
    const fetchResult = await fetchAndActivate(remoteConfig);
    
    lastGlobalFetch = now;
    
    console.log('[Experiments] Remote Config fetch result:', fetchResult);
  } catch (error) {
    console.warn('[Experiments] Failed to fetch Remote Config:', error);
    // Continue with cached or default values
  }
}

/**
 * Get experiment configuration from cache or Remote Config
 */
async function getExperimentConfig(flagName: string): Promise<ExperimentConfig> {
  const now = Date.now();
  const cached = experimentCache[flagName];
  
  // Return cached value if still valid
  if (cached && (now - cached.lastFetch) < cached.ttl) {
    return {
      enabled: cached.enabled,
      percentage: cached.percentage,
    };
  }
  
  // Fetch fresh config
  await fetchRemoteConfig();
  
  try {
    const remoteConfig = getRemoteConfigInstance();
    const configValue = getValue(remoteConfig, flagName);
    const config = parseExperimentConfig(configValue.asString());
    
    // Cache the result
    experimentCache[flagName] = {
      enabled: config.enabled,
      percentage: config.percentage,
      lastFetch: now,
      ttl: CACHE_TTL_MS,
    };
    
    console.log(`[Experiments] Updated config for ${flagName}:`, config);
    
    return config;
  } catch (error) {
    console.warn(`[Experiments] Failed to get config for ${flagName}:`, error);
    
    // Return cached value if available, otherwise default
    if (cached) {
      return {
        enabled: cached.enabled,
        percentage: cached.percentage,
      };
    }
    
    return { enabled: false, percentage: 0 };
  }
}

/**
 * Main experiment hook - determines if user should see experimental feature
 * 
 * @param flagName - Name of the experiment flag in Remote Config
 * @returns boolean indicating if user is in experiment
 */
export async function useExperiment(flagName: string): Promise<boolean> {
  try {
    const config = await getExperimentConfig(flagName);
    
    // If experiment is disabled globally, return false
    if (!config.enabled) {
      return false;
    }
    
    const userId = getCurrentUserId();
    const isInBucket = isUserInExperimentBucket(userId, flagName, config.percentage);
    
    console.log(`[Experiments] ${flagName}: enabled=${config.enabled}, percentage=${config.percentage}, userId=${userId.substring(0, 8)}..., inBucket=${isInBucket}`);
    
    return isInBucket;
  } catch (error) {
    console.error(`[Experiments] Error checking experiment ${flagName}:`, error);
    return false;
  }
}

/**
 * Synchronous version for React hooks (uses cache)
 * Should be called after an initial async call to populate cache
 */
export function useExperimentSync(flagName: string): boolean {
  // Allow localStorage override for testing and emergency toggles
  try {
    const override = localStorage.getItem(`experiment_${flagName}`);
    if (override !== null) {
      return override === 'true';
    }
  } catch (_err) {
    // Ignore if localStorage is unavailable (SSR/tests)
  }

  const cached = experimentCache[flagName];
  
  if (!cached) {
    console.warn(`[Experiments] No cached config for ${flagName}, returning false`);
    return false;
  }
  
  const now = Date.now();
  
  // If cache is expired, return false (could trigger background refresh)
  if ((now - cached.lastFetch) > cached.ttl) {
    console.warn(`[Experiments] Expired cache for ${flagName}, returning false`);
    return false;
  }
  
  if (!cached.enabled) {
    return false;
  }
  
  const userId = getCurrentUserId();
  return isUserInExperimentBucket(userId, flagName, cached.percentage);
}

/**
 * Preload experiment configurations for better performance
 */
export async function preloadExperiments(flagNames: string[]): Promise<void> {
  try {
    await fetchRemoteConfig();
    
    const remoteConfig = getRemoteConfigInstance();
    const now = Date.now();
    
    for (const flagName of flagNames) {
      try {
        const configValue = getValue(remoteConfig, flagName);
        const config = parseExperimentConfig(configValue.asString());
        
        experimentCache[flagName] = {
          enabled: config.enabled,
          percentage: config.percentage,
          lastFetch: now,
          ttl: CACHE_TTL_MS,
        };
      } catch (error) {
        console.warn(`[Experiments] Failed to preload ${flagName}:`, error);
      }
    }
    
    console.log('[Experiments] Preloaded experiments:', flagNames);
  } catch (error) {
    console.error('[Experiments] Failed to preload experiments:', error);
  }
}

/**
 * Get experiment status for debugging
 */
export function getExperimentStatus(flagName: string): {
  cached: boolean;
  config: ExperimentConfig | null;
  userId: string;
  bucketHash: number;
  inBucket: boolean;
} {
  const cached = experimentCache[flagName];
  const userId = getCurrentUserId();
  const bucketHash = crc32(`${userId}:${flagName}`);
  
  if (!cached) {
    return {
      cached: false,
      config: null,
      userId,
      bucketHash,
      inBucket: false,
    };
  }
  
  const config = { enabled: cached.enabled, percentage: cached.percentage };
  const inBucket = isUserInExperimentBucket(userId, flagName, cached.percentage);
  
  return {
    cached: true,
    config,
    userId,
    bucketHash,
    inBucket,
  };
}

/**
 * Clear experiment cache (useful for testing)
 */
export function clearExperimentCache(): void {
  experimentCache = {};
  lastGlobalFetch = 0;
  console.log('[Experiments] Cache cleared');
}

// Export for testing
export { crc32, isUserInExperimentBucket };

export default useExperiment;
