import { vehicleBillOfSaleCompliance, type VehicleBillOfSaleRule, type StateAbbr } from '@/lib/documents/us/vehicle-bill-of-sale/compliance';
import { loadComplianceOnly, normalizeJurisdiction, type ComplianceConfig } from '@/lib/config-loader';

export function getVehicleBillOfSaleCompliance(state: string): VehicleBillOfSaleRule | null {
  if (!state || state.length !== 2) {
    return null;
  }
  
  const stateKey = state.toUpperCase() as StateAbbr;
  return vehicleBillOfSaleCompliance[stateKey] || null;
}

export function requiresNotaryForVehicleBillOfSale(state: string): boolean {
  const compliance = getVehicleBillOfSaleCompliance(state);
  if (!compliance) return false;
  
  return compliance.requiresNotary === true || compliance.requiresNotary === "conditional";
}

export function hasOfficialForm(state: string): boolean {
  const compliance = getVehicleBillOfSaleCompliance(state);
  return !!(compliance?.officialForm && compliance?.localFormPath);
}

export function isBillOfSaleMandatory(state: string): boolean {
  const compliance = getVehicleBillOfSaleCompliance(state);
  return compliance?.billOfSaleMandatory ?? false;
}

export function hasIntegratedOdometer(state: string): boolean {
  const compliance = getVehicleBillOfSaleCompliance(state);
  return compliance?.odometerIntegrated ?? false;
}

export function getStateSpecialNotes(state: string): string | null {
  const compliance = getVehicleBillOfSaleCompliance(state);
  return compliance?.specialNotes || null;
}

// Enhanced compliance functions using unified config loader
export async function getDocumentCompliance(
  documentType: string, 
  state: string
): Promise<ComplianceConfig | null> {
  try {
    const jurisdiction = normalizeJurisdiction(state);
    return await loadComplianceOnly(documentType, jurisdiction);
  } catch (error) {
    console.warn(`Failed to load compliance for ${documentType}/${state}:`, error);
    
    // Fallback to legacy for Vehicle Bill of Sale
    if (documentType === 'vehicle-bill-of-sale') {
      const legacy = getVehicleBillOfSaleCompliance(state);
      if (legacy) {
        return {
          requiresNotary: legacy.requiresNotary,
          officialForm: legacy.officialForm,
          billOfSaleMandatory: legacy.billOfSaleMandatory,
          odometerIntegrated: legacy.odometerIntegrated,
          specialNotes: legacy.specialNotes,
          localFormPath: legacy.localFormPath
        };
      }
    }
    
    return null;
  }
}

export async function requiresNotaryForDocument(
  documentType: string, 
  state: string
): Promise<boolean> {
  const compliance = await getDocumentCompliance(documentType, state);
  if (!compliance) return false;
  
  return compliance.requiresNotary === true || compliance.requiresNotary === "conditional";
}

export async function hasOfficialFormForDocument(
  documentType: string, 
  state: string
): Promise<boolean> {
  const compliance = await getDocumentCompliance(documentType, state);
  return !!(compliance?.officialForm && compliance?.localFormPath);
}

export async function isDocumentMandatory(
  documentType: string, 
  state: string
): Promise<boolean> {
  const compliance = await getDocumentCompliance(documentType, state);
  return compliance?.billOfSaleMandatory ?? false;
}