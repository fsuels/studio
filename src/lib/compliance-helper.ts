import { vehicleBillOfSaleCompliance, type VehicleBillOfSaleRule, type StateAbbr } from '@/lib/documents/us/vehicle-bill-of-sale/compliance';

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