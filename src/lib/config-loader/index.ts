// Unified configuration loader with JSON-first, TypeScript fallback strategy
// This enables seamless migration from TypeScript configs to JSON configs

import { z } from 'zod';
import { 
  DocumentConfigSchema,
  QuestionConfigSchema,
  ComplianceConfigSchema,
  OverlayConfigSchema,
  validateDocumentConfig,
  type DocumentConfig,
  type QuestionConfig,
  type ComplianceConfig,
  type OverlayConfig
} from './schemas';
import { generateQuestions } from '@/lib/question-generator';

// Re-export types from schemas for external use
export type {
  DocumentConfig,
  QuestionConfig,
  ComplianceConfig,
  OverlayConfig
} from './schemas';

import { getEnvironmentConfig, getConfigUrl } from '@/lib/config/environment';

/**
 * Main entry point: Unified document configuration loader
 * Attempts JSON-first, then falls back to TypeScript imports
 */
export async function loadDocumentConfig(
  docType: string, 
  jurisdiction: string
): Promise<DocumentConfig> {
  const env = getEnvironmentConfig();
  
  console.log(`🔄 CONFIG LOADER: Loading ${docType} for ${jurisdiction}`);
  console.log(`🌍 CONFIG LOADER: Environment - CDN: ${env.enableCDN}, Fallback: ${env.fallbackToTypeScript}`);
  
  // Step 1: Try JSON configuration from CDN
  if (env.enableCDN) {
    try {
      const jsonConfig = await loadJSONConfig(docType, jurisdiction);
      if (jsonConfig) {
        console.log(`✅ CONFIG LOADER: Loaded JSON config for ${docType}/${jurisdiction}`);
        return jsonConfig;
      }
    } catch (error) {
      console.warn(`⚠️ CONFIG LOADER: JSON config failed for ${docType}/${jurisdiction}:`, error);
    }
  }
  
  // Step 2: Fallback to TypeScript configuration
  if (env.fallbackToTypeScript) {
    try {
      const tsConfig = await loadTypeScriptConfig(docType, jurisdiction);
      if (tsConfig) {
        console.log(`✅ CONFIG LOADER: Loaded TypeScript config for ${docType}/${jurisdiction}`);
        return tsConfig;
      }
    } catch (error) {
      console.warn(`⚠️ CONFIG LOADER: TypeScript config failed for ${docType}/${jurisdiction}:`, error);
    }
  }
  
  throw new Error(`No configuration found for ${jurisdiction}/${docType}`);
}

/**
 * Load JSON configuration from CDN
 */
async function loadJSONConfig(
  docType: string, 
  jurisdiction: string
): Promise<DocumentConfig | null> {
  const configUrl = getConfigUrl(jurisdiction, docType);
  
  console.log(`🌐 JSON CONFIG: Fetching from ${configUrl}`);
  
  try {
    const response = await fetch(configUrl, {
      headers: {
        'Accept': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        console.log(`📄 JSON CONFIG: Not found at ${configUrl}`);
        return null;
      }
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const rawConfig = await response.json();
    
    // If questions are missing but overlay is present, generate them
    if (!rawConfig.questions && rawConfig.overlayConfig) {
      console.log(`🔧 JSON CONFIG: Auto-generating questions from overlay for ${docType}/${jurisdiction}`);
      rawConfig.questions = generateQuestions(rawConfig.overlayConfig);
    }
    
    // Validate JSON configuration with Zod
    const validatedConfig = validateDocumentConfig(rawConfig);
    
    console.log(`✅ JSON CONFIG: Valid configuration loaded for ${docType}/${jurisdiction}`);
    return validatedConfig;
    
  } catch (error) {
    console.error(`❌ JSON CONFIG: Failed to load ${configUrl}:`, error);
    throw error;
  }
}

/**
 * Load TypeScript configuration (legacy fallback)
 */
async function loadTypeScriptConfig(
  docType: string, 
  jurisdiction: string
): Promise<DocumentConfig | null> {
  console.log(`📦 TS CONFIG: Loading TypeScript config for ${docType}/${jurisdiction}`);
  
  try {
    // Handle jurisdiction format (us/florida -> us, florida)
    const [country, state] = jurisdiction.split('/');
    
    if (country !== 'us') {
      throw new Error(`TypeScript configs only support US jurisdiction, got: ${country}`);
    }
    
    // Currently only Vehicle Bill of Sale is implemented in TypeScript
    if (docType === 'vehicle-bill-of-sale') {
      return await loadVehicleBillOfSaleConfig(state);
    }
    
    throw new Error(`TypeScript config not available for document type: ${docType}`);
    
  } catch (error) {
    console.error(`❌ TS CONFIG: Failed to load ${docType}/${jurisdiction}:`, error);
    throw error;
  }
}

/**
 * Convert legacy Vehicle Bill of Sale configuration to new format
 */
async function loadVehicleBillOfSaleConfig(state: string): Promise<DocumentConfig> {
  // Dynamic import to avoid circular dependencies
  const { vehicleBillOfSaleCompliance } = await import('@/lib/documents/us/vehicle-bill-of-sale/compliance');
  const { vehicleBillOfSaleQuestions } = await import('@/lib/documents/us/vehicle-bill-of-sale/questions');
  
  // Convert state name to state code for legacy compatibility
  const stateCode = getStateCodeFromName(state);
  if (!stateCode) {
    throw new Error(`No state code mapping found for state: ${state}`);
  }
  
  const stateKey = stateCode as keyof typeof vehicleBillOfSaleCompliance;
  const compliance = vehicleBillOfSaleCompliance[stateKey];
  
  if (!compliance) {
    throw new Error(`No compliance configuration found for state: ${state} (code: ${stateCode})`);
  }
  
  // Convert legacy TypeScript format to new unified format
  const config: DocumentConfig = {
    jurisdiction: `us/${state.toLowerCase()}`,
    docType: 'vehicle-bill-of-sale',
    schemaVersion: compliance.schemaVersion,
    formVersion: compliance.formVersion,
    lastUpdated: compliance.lastUpdated,
    
    // Convert questions format (minimal changes needed)
    questions: vehicleBillOfSaleQuestions.map(q => ({
      id: q.id,
      label: q.label,
      type: q.type as QuestionConfig['type'],
      required: q.required,
      options: q.options,
      placeholder: q.placeholder,
      tooltip: q.tooltip
    })),
    
    // Convert compliance format
    compliance: {
      requiresNotary: compliance.requiresNotary,
      officialForm: compliance.officialForm,
      billOfSaleMandatory: compliance.billOfSaleMandatory,
      odometerIntegrated: compliance.odometerIntegrated,
      specialNotes: compliance.specialNotes,
      localFormPath: compliance.localFormPath
    },
    
    // Overlay config will be loaded separately if needed
    overlayConfig: compliance.localFormPath ? {
      pdfPath: compliance.localFormPath,
      fieldMappings: [] // Will be populated by existing overlay system
    } : undefined
  };
  
  console.log(`🔄 TS CONFIG: Converted legacy config for ${state} Vehicle Bill of Sale`);
  return config;
}

/**
 * Specialized loaders for specific use cases
 */

export async function loadComplianceOnly(
  docType: string, 
  jurisdiction: string
): Promise<ComplianceConfig> {
  const config = await loadDocumentConfig(docType, jurisdiction);
  return config.compliance;
}

export async function loadQuestionsOnly(
  docType: string, 
  jurisdiction: string
): Promise<QuestionConfig[]> {
  const config = await loadDocumentConfig(docType, jurisdiction);
  return config.questions || [];
}

export async function loadOverlayConfigOnly(
  docType: string, 
  jurisdiction: string
): Promise<OverlayConfig | null> {
  const config = await loadDocumentConfig(docType, jurisdiction);
  return config.overlayConfig || null;
}

/**
 * Utility functions
 */

export function isJSONConfigAvailable(
  docType: string, 
  jurisdiction: string
): Promise<boolean> {
  const env = getEnvironmentConfig();
  if (!env.enableCDN) return Promise.resolve(false);
  
  const configUrl = getConfigUrl(jurisdiction, docType);
  
  return fetch(configUrl, { method: 'HEAD' })
    .then(response => response.ok)
    .catch(() => false);
}

export function normalizeJurisdiction(input: string): string {
  // Handle various input formats:
  // "FL" -> "us/florida"
  // "florida" -> "us/florida" 
  // "us/florida" -> "us/florida"
  
  if (input.includes('/')) {
    return input.toLowerCase();
  }
  
  // Map state codes to full names
  const stateMap: Record<string, string> = {
    'al': 'alabama', 'ak': 'alaska', 'az': 'arizona', 'ar': 'arkansas',
    'ca': 'california', 'co': 'colorado', 'ct': 'connecticut', 'de': 'delaware',
    'fl': 'florida', 'ga': 'georgia', 'hi': 'hawaii', 'id': 'idaho',
    'il': 'illinois', 'in': 'indiana', 'ia': 'iowa', 'ks': 'kansas',
    'ky': 'kentucky', 'la': 'louisiana', 'me': 'maine', 'md': 'maryland',
    'ma': 'massachusetts', 'mi': 'michigan', 'mn': 'minnesota', 'ms': 'mississippi',
    'mo': 'missouri', 'mt': 'montana', 'ne': 'nebraska', 'nv': 'nevada',
    'nh': 'new-hampshire', 'nj': 'new-jersey', 'nm': 'new-mexico', 'ny': 'new-york',
    'nc': 'north-carolina', 'nd': 'north-dakota', 'oh': 'ohio', 'ok': 'oklahoma',
    'or': 'oregon', 'pa': 'pennsylvania', 'ri': 'rhode-island', 'sc': 'south-carolina',
    'sd': 'south-dakota', 'tn': 'tennessee', 'tx': 'texas', 'ut': 'utah',
    'vt': 'vermont', 'va': 'virginia', 'wa': 'washington', 'wv': 'west-virginia',
    'wi': 'wisconsin', 'wy': 'wyoming'
  };
  
  const normalized = input.toLowerCase();
  const stateName = stateMap[normalized] || normalized;
  
  return `us/${stateName}`;
}

// Helper function to convert state name back to state code
function getStateCodeFromName(stateName: string): string | null {
  const nameToCodeMap: Record<string, string> = {
    'alabama': 'AL', 'alaska': 'AK', 'arizona': 'AZ', 'arkansas': 'AR',
    'california': 'CA', 'colorado': 'CO', 'connecticut': 'CT', 'delaware': 'DE',
    'florida': 'FL', 'georgia': 'GA', 'hawaii': 'HI', 'idaho': 'ID',
    'illinois': 'IL', 'indiana': 'IN', 'iowa': 'IA', 'kansas': 'KS',
    'kentucky': 'KY', 'louisiana': 'LA', 'maine': 'ME', 'maryland': 'MD',
    'massachusetts': 'MA', 'michigan': 'MI', 'minnesota': 'MN', 'mississippi': 'MS',
    'missouri': 'MO', 'montana': 'MT', 'nebraska': 'NE', 'nevada': 'NV',
    'new-hampshire': 'NH', 'new-jersey': 'NJ', 'new-mexico': 'NM', 'new-york': 'NY',
    'north-carolina': 'NC', 'north-dakota': 'ND', 'ohio': 'OH', 'oklahoma': 'OK',
    'oregon': 'OR', 'pennsylvania': 'PA', 'rhode-island': 'RI', 'south-carolina': 'SC',
    'south-dakota': 'SD', 'tennessee': 'TN', 'texas': 'TX', 'utah': 'UT',
    'vermont': 'VT', 'virginia': 'VA', 'washington': 'WA', 'west-virginia': 'WV',
    'wisconsin': 'WI', 'wyoming': 'WY'
  };
  
  return nameToCodeMap[stateName.toLowerCase()] || null;
}

// Export the validation and utility functions for external use
export { validateDocumentConfig, DocumentConfigSchema } from './schemas';