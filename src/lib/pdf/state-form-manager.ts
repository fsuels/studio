import { vehicleBillOfSaleCompliance, type StateAbbr } from '@/lib/documents/us/vehicle-bill-of-sale/compliance';

export function getStateFormPath(state: string): string | null {
  if (!state || state.length !== 2) {
    return null;
  }
  
  const stateKey = state.toUpperCase() as StateAbbr;
  const compliance = vehicleBillOfSaleCompliance[stateKey];
  
  return compliance?.localFormPath || null;
}

export function getFormDisplayName(state: string): string | null {
  if (!state || state.length !== 2) {
    return null;
  }
  
  const stateKey = state.toUpperCase() as StateAbbr;
  const compliance = vehicleBillOfSaleCompliance[stateKey];
  
  return compliance?.officialForm || null;
}

export function hasOfficialForm(state: string): boolean {
  const formPath = getStateFormPath(state);
  return !!formPath;
}

export function getAvailableStateForms(): Array<{ state: string; formName: string; formPath: string }> {
  const forms: Array<{ state: string; formName: string; formPath: string }> = [];
  
  Object.entries(vehicleBillOfSaleCompliance).forEach(([state, compliance]) => {
    if (compliance.localFormPath && compliance.officialForm) {
      forms.push({
        state,
        formName: compliance.officialForm,
        formPath: compliance.localFormPath
      });
    }
  });
  
  return forms;
}