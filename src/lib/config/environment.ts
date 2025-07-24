// Environment configuration for asset management and CDN
// This centralizes all environment-related configuration

export interface EnvironmentConfig {
  // Asset Management
  assetCDN: string;
  enableCDN: boolean;
  fallbackToTypeScript: boolean;
  
  // Environment Detection
  isDevelopment: boolean;
  isProduction: boolean;
  isTest: boolean;
  
  // Deployment Information
  vercelEnv?: string;
  vercelUrl?: string;
  deploymentId?: string;
}

/**
 * Get the current environment configuration
 */
export function getEnvironmentConfig(): EnvironmentConfig {
  const nodeEnv = process.env.NODE_ENV || 'development';
  const vercelEnv = process.env.VERCEL_ENV;
  
  return {
    // Asset Management Configuration
    assetCDN: getAssetCDNUrl(),
    enableCDN: shouldEnableCDN(),
    fallbackToTypeScript: getFallbackToTypeScript(),
    
    // Environment Detection
    isDevelopment: nodeEnv === 'development',
    isProduction: nodeEnv === 'production',
    isTest: nodeEnv === 'test',
    
    // Deployment Information
    vercelEnv,
    vercelUrl: process.env.VERCEL_URL,
    deploymentId: process.env.VERCEL_GIT_COMMIT_SHA
  };
}

/**
 * Determine the CDN URL based on environment
 */
function getAssetCDNUrl(): string {
  // Explicit environment variable takes precedence
  if (process.env.ASSET_CDN) {
    return process.env.ASSET_CDN;
  }
  
  // Environment-specific defaults
  const nodeEnv = process.env.NODE_ENV;
  const vercelEnv = process.env.VERCEL_ENV;
  
  if (nodeEnv === 'production' || vercelEnv === 'production') {
    return 'https://cdn.123legaldoc.com/assets';
  }
  
  if (vercelEnv === 'preview') {
    return 'https://staging-assets.123legaldoc.com/assets';
  }
  
  // Development default
  return 'http://localhost:3000/assets';
}

/**
 * Determine whether CDN should be enabled
 */
function shouldEnableCDN(): boolean {
  // Explicit environment variable takes precedence
  if (process.env.ENABLE_CDN !== undefined) {
    return process.env.ENABLE_CDN === 'true';
  }
  
  // Auto-enable CDN in production and development (for JSON config testing)
  const nodeEnv = process.env.NODE_ENV;
  const vercelEnv = process.env.VERCEL_ENV;
  
  return nodeEnv === 'production' || nodeEnv === 'development' || vercelEnv === 'production';
}

/**
 * Determine whether to fallback to TypeScript configs
 */
function getFallbackToTypeScript(): boolean {
  // Explicit environment variable takes precedence
  if (process.env.FALLBACK_TO_TYPESCRIPT !== undefined) {
    return process.env.FALLBACK_TO_TYPESCRIPT === 'true';
  }
  
  // Always enable fallback by default for safety
  return true;
}

/**
 * Get configuration for specific deployment environments
 */
export function getDeploymentConfig() {
  const config = getEnvironmentConfig();
  
  return {
    // CDN Configuration per environment
    development: {
      assetCDN: 'http://localhost:3000/assets',
      enableCDN: true,
      fallbackToTypeScript: true
    },
    preview: {
      assetCDN: 'https://staging-assets.123legaldoc.com/assets',
      enableCDN: true,
      fallbackToTypeScript: true
    },
    production: {
      assetCDN: 'https://cdn.123legaldoc.com/assets',
      enableCDN: true,
      fallbackToTypeScript: true
    },
    
    // Current active config
    current: {
      assetCDN: config.assetCDN,
      enableCDN: config.enableCDN,
      fallbackToTypeScript: config.fallbackToTypeScript
    }
  };
}

/**
 * Asset URL helpers
 */
export function getAssetUrl(relativePath: string): string {
  const config = getEnvironmentConfig();
  
  // Remove leading slash if present
  const cleanPath = relativePath.startsWith('/') ? relativePath.slice(1) : relativePath;
  
  if (config.enableCDN) {
    return `${config.assetCDN}/${cleanPath}`;
  }
  
  // Local development - serve from public directory
  return `/${cleanPath}`;
}

export function getConfigUrl(jurisdiction: string, docType: string): string {
  return getAssetUrl(`${jurisdiction}/${docType}/config.json`);
}

export function getPDFUrl(jurisdiction: string, docType: string, filename: string): string {
  return getAssetUrl(`${jurisdiction}/${docType}/${filename}`);
}

export function getOverlayUrl(jurisdiction: string, docType: string): string {
  return getAssetUrl(`${jurisdiction}/${docType}/overlay.json`);
}

/**
 * Environment validation
 */
export function validateEnvironment(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const config = getEnvironmentConfig();
  
  // Validate CDN URL format
  try {
    new URL(config.assetCDN);
  } catch {
    errors.push(`Invalid ASSET_CDN URL: ${config.assetCDN}`);
  }
  
  // Validate production configuration
  if (config.isProduction) {
    if (!config.enableCDN) {
      errors.push('CDN should be enabled in production');
    }
    
    if (!config.assetCDN.startsWith('https://')) {
      errors.push('Production CDN should use HTTPS');
    }
  }
  
  // Validate development configuration
  if (config.isDevelopment) {
    if (config.enableCDN && !config.fallbackToTypeScript) {
      errors.push('Development should have TypeScript fallback enabled');
    }
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Debug information for troubleshooting
 */
export function getEnvironmentDebugInfo() {
  const config = getEnvironmentConfig();
  const deployment = getDeploymentConfig();
  const validation = validateEnvironment();
  
  return {
    config,
    deployment,
    validation,
    
    // Raw environment variables
    rawEnv: {
      NODE_ENV: process.env.NODE_ENV,
      VERCEL_ENV: process.env.VERCEL_ENV,
      ASSET_CDN: process.env.ASSET_CDN,
      ENABLE_CDN: process.env.ENABLE_CDN,
      FALLBACK_TO_TYPESCRIPT: process.env.FALLBACK_TO_TYPESCRIPT
    },
    
    // Example URLs
    exampleUrls: {
      vehicleBillOfSale: getConfigUrl('us/florida', 'vehicle-bill-of-sale'),
      basicNDA: getConfigUrl('us/generic', 'basic-nda'),
      floridaPDF: getPDFUrl('us/florida', 'vehicle-bill-of-sale', 'HSMV-82050.pdf')
    }
  };
}

/**
 * Runtime configuration switching for testing
 */
export function createTestEnvironment(overrides: Partial<EnvironmentConfig>) {
  const originalEnv = { ...process.env };
  
  if (overrides.assetCDN) process.env.ASSET_CDN = overrides.assetCDN;
  if (overrides.enableCDN !== undefined) process.env.ENABLE_CDN = String(overrides.enableCDN);
  if (overrides.fallbackToTypeScript !== undefined) process.env.FALLBACK_TO_TYPESCRIPT = String(overrides.fallbackToTypeScript);
  
  // Return cleanup function
  return () => {
    process.env = originalEnv;
  };
}

// Export singleton instance for convenience
export const env = getEnvironmentConfig();