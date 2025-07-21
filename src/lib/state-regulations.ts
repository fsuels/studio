// State-based UPL risk management system
// Based on legal research and regulatory analysis

export type RiskLevel = 'green' | 'amber' | 'red';

export interface StateRegulation {
  risk: RiskLevel;
  reason: string;
  blockCheckout: boolean;
  requiresRegistration?: boolean;
  annualFee?: number;
  specialRequirements?: string[];
  disclaimerLevel: 'basic' | 'enhanced' | 'strict';
  lastUpdated: string;
  sources: string[];
}

export const stateRegulations: Record<string, StateRegulation> = {
  // GREEN STATES - Active regulatory programs allow non-law firms
  AZ: {
    risk: 'green',
    reason:
      'Alternative Business Structure (ABS) program allows non-law firms under oversight',
    blockCheckout: false,
    requiresRegistration: true,
    annualFee: 6000,
    specialRequirements: ['ABS filing required', 'Regulatory oversight'],
    disclaimerLevel: 'basic',
    lastUpdated: '2025-01-01',
    sources: ['law.stanford.edu/abs-programs', 'azbar.org'],
  },
  UT: {
    risk: 'green',
    reason: 'Legal Tech Sandbox program permits innovative legal services',
    blockCheckout: false,
    requiresRegistration: true,
    annualFee: 5000,
    specialRequirements: ['Sandbox registration', 'Annual reporting'],
    disclaimerLevel: 'basic',
    lastUpdated: '2025-01-01',
    sources: ['utahinnovationoffice.org', 'utahbar.org/sandbox'],
  },
  WA: {
    risk: 'green',
    reason:
      'Limited License Legal Technician (LLLT) program and regulatory flexibility',
    blockCheckout: false,
    disclaimerLevel: 'basic',
    lastUpdated: '2025-01-01',
    sources: ['wsba.org/licensing', 'reuters.com/legal-innovation'],
  },

  // RED STATES - High enforcement risk, block until local attorney partnership
  TX: {
    risk: 'red',
    reason:
      'Active UPL enforcement, recent cease-and-desist letters, strict corporate practice ban',
    blockCheckout: true,
    disclaimerLevel: 'strict',
    specialRequirements: [
      'Named in-state attorney review required',
      'Revenue sharing or flat fee arrangement',
    ],
    lastUpdated: '2025-01-01',
    sources: ['texasbar.com/upl', 'texasbar.com/ethics-opinions'],
  },
  NC: {
    risk: 'red',
    reason:
      'Required registration program for online document providers, strict Rule 5.5 enforcement',
    blockCheckout: true,
    disclaimerLevel: 'strict',
    specialRequirements: [
      'State registration required',
      'Attorney involvement mandatory',
    ],
    lastUpdated: '2025-01-01',
    sources: ['ncbar.gov/registration', 'reuters.com/legal-nc-ruling'],
  },
  MO: {
    risk: 'red',
    reason:
      'Janson v. LegalZoom class settlement requires attorney involvement and refund guarantees',
    blockCheckout: true,
    disclaimerLevel: 'strict',
    specialRequirements: [
      'Attorney involvement required',
      'Refund policy compliance',
      'Settlement obligations',
    ],
    lastUpdated: '2025-01-01',
    sources: ['attorney.elderlawanswers.com/janson-settlement', 'mobar.org'],
  },

  // AMBER STATES - Standard enforcement, enhanced disclaimers required
  AL: {
    risk: 'amber',
    reason:
      'No regulatory sandbox, UPL enforcement focuses on personalized advice',
    blockCheckout: false,
    disclaimerLevel: 'enhanced',
    lastUpdated: '2025-01-01',
    sources: ['alabar.org'],
  },
  AK: {
    risk: 'amber',
    reason:
      'Limited UPL enforcement history, standard template vendor treatment',
    blockCheckout: false,
    disclaimerLevel: 'enhanced',
    lastUpdated: '2025-01-01',
    sources: ['alaskabar.org'],
  },
  AR: {
    risk: 'amber',
    reason:
      'No specific template vendor restrictions, focus on advice vs. forms',
    blockCheckout: false,
    disclaimerLevel: 'enhanced',
    lastUpdated: '2025-01-01',
    sources: ['arkbar.com'],
  },
  CA: {
    risk: 'amber',
    reason:
      'Large market with case-by-case UPL enforcement, no systematic template restrictions',
    blockCheckout: false,
    disclaimerLevel: 'enhanced',
    lastUpdated: '2025-01-01',
    sources: ['calbar.ca.gov'],
  },
  CO: {
    risk: 'amber',
    reason: 'No regulatory sandbox yet, traditional UPL enforcement model',
    blockCheckout: false,
    disclaimerLevel: 'enhanced',
    lastUpdated: '2025-01-01',
    sources: ['coloradobar.org'],
  },
  CT: {
    risk: 'amber',
    reason:
      'Conservative bar association but limited template vendor enforcement',
    blockCheckout: false,
    disclaimerLevel: 'enhanced',
    lastUpdated: '2025-01-01',
    sources: ['ctbar.org'],
  },
  DE: {
    risk: 'amber',
    reason: 'Corporate law focus, limited individual practice restrictions',
    blockCheckout: false,
    disclaimerLevel: 'enhanced',
    lastUpdated: '2025-01-01',
    sources: ['dsba.org'],
  },
  FL: {
    risk: 'amber',
    reason:
      'Large market, case-by-case enforcement, no systematic restrictions',
    blockCheckout: false,
    disclaimerLevel: 'enhanced',
    lastUpdated: '2025-01-01',
    sources: ['floridabar.org'],
  },
  GA: {
    risk: 'amber',
    reason: 'Traditional enforcement model, focus on personalized advice',
    blockCheckout: false,
    disclaimerLevel: 'enhanced',
    lastUpdated: '2025-01-01',
    sources: ['gabar.org'],
  },
  HI: {
    risk: 'amber',
    reason: 'Small market, limited enforcement activity against templates',
    blockCheckout: false,
    disclaimerLevel: 'enhanced',
    lastUpdated: '2025-01-01',
    sources: ['hsba.org'],
  },
  ID: {
    risk: 'amber',
    reason: 'No specific template restrictions, standard UPL framework',
    blockCheckout: false,
    disclaimerLevel: 'enhanced',
    lastUpdated: '2025-01-01',
    sources: ['isb.idaho.gov'],
  },
  IL: {
    risk: 'amber',
    reason:
      'Large market, traditional enforcement, no systematic template bans',
    blockCheckout: false,
    disclaimerLevel: 'enhanced',
    lastUpdated: '2025-01-01',
    sources: ['illinoisbar.org'],
  },
  IN: {
    risk: 'amber',
    reason: 'Conservative bar but limited template enforcement history',
    blockCheckout: false,
    disclaimerLevel: 'enhanced',
    lastUpdated: '2025-01-01',
    sources: ['inbar.org'],
  },
  IA: {
    risk: 'amber',
    reason: 'No specific template vendor restrictions documented',
    blockCheckout: false,
    disclaimerLevel: 'enhanced',
    lastUpdated: '2025-01-01',
    sources: ['iowabar.org'],
  },
  KS: {
    risk: 'amber',
    reason: 'Standard UPL enforcement, no template-specific restrictions',
    blockCheckout: false,
    disclaimerLevel: 'enhanced',
    lastUpdated: '2025-01-01',
    sources: ['ksbar.org'],
  },
  KY: {
    risk: 'amber',
    reason: 'Traditional enforcement model, focus on advice vs forms',
    blockCheckout: false,
    disclaimerLevel: 'enhanced',
    lastUpdated: '2025-01-01',
    sources: ['kybar.org'],
  },
  LA: {
    risk: 'amber',
    reason: 'Civil law state with unique requirements but no template bans',
    blockCheckout: false,
    disclaimerLevel: 'enhanced',
    lastUpdated: '2025-01-01',
    sources: ['lsba.org'],
  },
  ME: {
    risk: 'amber',
    reason: 'Small market, limited enforcement against template vendors',
    blockCheckout: false,
    disclaimerLevel: 'enhanced',
    lastUpdated: '2025-01-01',
    sources: ['mainebar.org'],
  },
  MD: {
    risk: 'amber',
    reason: 'No systematic template restrictions, case-by-case enforcement',
    blockCheckout: false,
    disclaimerLevel: 'enhanced',
    lastUpdated: '2025-01-01',
    sources: ['msba.org'],
  },
  MA: {
    risk: 'amber',
    reason:
      'Traditional legal market, no specific template vendor restrictions',
    blockCheckout: false,
    disclaimerLevel: 'enhanced',
    lastUpdated: '2025-01-01',
    sources: ['massbar.org'],
  },
  MI: {
    risk: 'amber',
    reason: 'Large market, standard UPL enforcement practices',
    blockCheckout: false,
    disclaimerLevel: 'enhanced',
    lastUpdated: '2025-01-01',
    sources: ['michbar.org'],
  },
  MN: {
    risk: 'amber',
    reason: 'No template-specific restrictions, focus on personalized advice',
    blockCheckout: false,
    disclaimerLevel: 'enhanced',
    lastUpdated: '2025-01-01',
    sources: ['mnbar.org'],
  },
  MS: {
    risk: 'amber',
    reason: 'Conservative market but limited template enforcement',
    blockCheckout: false,
    disclaimerLevel: 'enhanced',
    lastUpdated: '2025-01-01',
    sources: ['msbar.org'],
  },
  MT: {
    risk: 'amber',
    reason: 'Small market, minimal enforcement against form vendors',
    blockCheckout: false,
    disclaimerLevel: 'enhanced',
    lastUpdated: '2025-01-01',
    sources: ['montanabar.org'],
  },
  NE: {
    risk: 'amber',
    reason: 'No specific template restrictions documented',
    blockCheckout: false,
    disclaimerLevel: 'enhanced',
    lastUpdated: '2025-01-01',
    sources: ['nebar.com'],
  },
  NV: {
    risk: 'amber',
    reason:
      'Business-friendly state, limited UPL enforcement against templates',
    blockCheckout: false,
    disclaimerLevel: 'enhanced',
    lastUpdated: '2025-01-01',
    sources: ['nvbar.org'],
  },
  NH: {
    risk: 'amber',
    reason: 'Small market, no systematic template restrictions',
    blockCheckout: false,
    disclaimerLevel: 'enhanced',
    lastUpdated: '2025-01-01',
    sources: ['nhbar.org'],
  },
  NJ: {
    risk: 'amber',
    reason: 'Large market, traditional enforcement, no template bans',
    blockCheckout: false,
    disclaimerLevel: 'enhanced',
    lastUpdated: '2025-01-01',
    sources: ['njsba.com'],
  },
  NM: {
    risk: 'amber',
    reason: 'No specific template vendor restrictions',
    blockCheckout: false,
    disclaimerLevel: 'enhanced',
    lastUpdated: '2025-01-01',
    sources: ['nmbar.org'],
  },
  NY: {
    risk: 'amber',
    reason: 'Large market, traditional enforcement model, case-by-case review',
    blockCheckout: false,
    disclaimerLevel: 'enhanced',
    lastUpdated: '2025-01-01',
    sources: ['nysba.org'],
  },
  ND: {
    risk: 'amber',
    reason: 'Small market, minimal enforcement history against templates',
    blockCheckout: false,
    disclaimerLevel: 'enhanced',
    lastUpdated: '2025-01-01',
    sources: ['sband.org'],
  },
  OH: {
    risk: 'amber',
    reason: 'Large market, standard UPL enforcement practices',
    blockCheckout: false,
    disclaimerLevel: 'enhanced',
    lastUpdated: '2025-01-01',
    sources: ['ohiobar.org'],
  },
  OK: {
    risk: 'amber',
    reason: 'No systematic template restrictions documented',
    blockCheckout: false,
    disclaimerLevel: 'enhanced',
    lastUpdated: '2025-01-01',
    sources: ['okbar.org'],
  },
  OR: {
    risk: 'amber',
    reason: 'Progressive state but no regulatory sandbox yet',
    blockCheckout: false,
    disclaimerLevel: 'enhanced',
    lastUpdated: '2025-01-01',
    sources: ['osbar.org'],
  },
  PA: {
    risk: 'amber',
    reason: 'Large market, conservative bar but limited template enforcement',
    blockCheckout: false,
    disclaimerLevel: 'enhanced',
    lastUpdated: '2025-01-01',
    sources: ['pabar.org'],
  },
  RI: {
    risk: 'amber',
    reason: 'Small market, no specific template restrictions',
    blockCheckout: false,
    disclaimerLevel: 'enhanced',
    lastUpdated: '2025-01-01',
    sources: ['ribar.org'],
  },
  SC: {
    risk: 'amber',
    reason: 'Conservative market but no systematic template bans',
    blockCheckout: false,
    disclaimerLevel: 'enhanced',
    lastUpdated: '2025-01-01',
    sources: ['scbar.org'],
  },
  SD: {
    risk: 'amber',
    reason: 'Small market, minimal enforcement against form vendors',
    blockCheckout: false,
    disclaimerLevel: 'enhanced',
    lastUpdated: '2025-01-01',
    sources: ['statebarofsouthdakota.com'],
  },
  TN: {
    risk: 'amber',
    reason: 'No specific template vendor restrictions documented',
    blockCheckout: false,
    disclaimerLevel: 'enhanced',
    lastUpdated: '2025-01-01',
    sources: ['tba.org'],
  },
  VT: {
    risk: 'amber',
    reason: 'Small market, no systematic template restrictions',
    blockCheckout: false,
    disclaimerLevel: 'enhanced',
    lastUpdated: '2025-01-01',
    sources: ['vtbar.org'],
  },
  VA: {
    risk: 'amber',
    reason: 'Large market, traditional enforcement, no template-specific bans',
    blockCheckout: false,
    disclaimerLevel: 'enhanced',
    lastUpdated: '2025-01-01',
    sources: ['vsb.org'],
  },
  WV: {
    risk: 'amber',
    reason: 'Small market, limited enforcement against template vendors',
    blockCheckout: false,
    disclaimerLevel: 'enhanced',
    lastUpdated: '2025-01-01',
    sources: ['wvbar.org'],
  },
  WI: {
    risk: 'amber',
    reason: 'No specific template restrictions, standard UPL framework',
    blockCheckout: false,
    disclaimerLevel: 'enhanced',
    lastUpdated: '2025-01-01',
    sources: ['wisbar.org'],
  },
  WY: {
    risk: 'amber',
    reason: 'Small market, business-friendly, minimal template enforcement',
    blockCheckout: false,
    disclaimerLevel: 'enhanced',
    lastUpdated: '2025-01-01',
    sources: ['wyomingbar.org'],
  },

  // FEDERAL TERRITORIES
  DC: {
    risk: 'amber',
    reason: 'Federal jurisdiction, traditional enforcement model',
    blockCheckout: false,
    disclaimerLevel: 'enhanced',
    lastUpdated: '2025-01-01',
    sources: ['dcbar.org'],
  },
};

// Helper functions
export function getStateRisk(stateCode: string): RiskLevel {
  return stateRegulations[stateCode?.toUpperCase()]?.risk || 'amber';
}

export function canPurchaseInState(stateCode: string): boolean {
  const regulation = stateRegulations[stateCode?.toUpperCase()];
  return regulation ? !regulation.blockCheckout : true; // Default to allow if state not found
}

export function getDisclaimerLevel(
  stateCode: string,
): 'basic' | 'enhanced' | 'strict' {
  return (
    stateRegulations[stateCode?.toUpperCase()]?.disclaimerLevel || 'enhanced'
  );
}

export function getStateRequirements(stateCode: string): string[] {
  return stateRegulations[stateCode?.toUpperCase()]?.specialRequirements || [];
}

export function getGreenStates(): string[] {
  return Object.entries(stateRegulations)
    .filter(([_, regulation]) => regulation.risk === 'green')
    .map(([state, _]) => state);
}

export function getRedStates(): string[] {
  return Object.entries(stateRegulations)
    .filter(([_, regulation]) => regulation.risk === 'red')
    .map(([state, _]) => state);
}

export function getAmberStates(): string[] {
  return Object.entries(stateRegulations)
    .filter(([_, regulation]) => regulation.risk === 'amber')
    .map(([state, _]) => state);
}

// Compliance audit trail
export interface ComplianceEvent {
  timestamp: string;
  userIP: string;
  userState: string;
  action:
    | 'checkout_allowed'
    | 'checkout_blocked'
    | 'disclaimer_shown'
    | 'waitlist_signup';
  riskLevel: RiskLevel;
  disclaimerLevel: string;
  userAgent: string;
  sessionId: string;
}

export function createComplianceEvent(
  userIP: string,
  userState: string,
  action: ComplianceEvent['action'],
  sessionId: string,
  userAgent: string,
): ComplianceEvent {
  const regulation = stateRegulations[userState?.toUpperCase()];

  return {
    timestamp: new Date().toISOString(),
    userIP,
    userState,
    action,
    riskLevel: regulation?.risk || 'amber',
    disclaimerLevel: regulation?.disclaimerLevel || 'enhanced',
    userAgent,
    sessionId,
  };
}
