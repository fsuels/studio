// Non-Disclosure Agreement compliance rules for all 50 US states
// Based on comprehensive research of state trade secrets laws and NDA enforceability for 2025

export interface NDARule {
  hasUTSA: boolean; // Uniform Trade Secrets Act adopted
  hasDTSA: boolean; // Defend Trade Secrets Act applies (federal - all states)
  workplaceMisconductRestrictions: boolean; // Restrictions on NDAs for workplace harassment/discrimination
  readilyAscertainableStandard: boolean; // Uses UTSA's "readily ascertainable" standard
  dataPrivacyLaws: boolean; // Has comprehensive data privacy laws
  nonCompeteRestrictions: boolean; // Has restrictions on non-compete agreements
  specialNotes?: string;
  maxReasonableDuration?: number; // Maximum reasonable duration in years
  tradeSecretDefinition: "strict" | "standard" | "broad";
  enforcementStandard: "strict" | "moderate" | "permissive";
}

export const ndaCompliance: Record<string, NDARule> = {
  AL: {
    hasUTSA: true,
    hasDTSA: true,
    workplaceMisconductRestrictions: false,
    readilyAscertainableStandard: true,
    dataPrivacyLaws: false,
    nonCompeteRestrictions: false,
    tradeSecretDefinition: "standard",
    enforcementStandard: "moderate",
    maxReasonableDuration: 10,
    specialNotes: "Alabama adopted UTSA with standard provisions. Reasonable scope and duration required for enforceability"
  },

  AK: {
    hasUTSA: true,
    hasDTSA: true,
    workplaceMisconductRestrictions: false,
    readilyAscertainableStandard: true,
    dataPrivacyLaws: false,
    nonCompeteRestrictions: false,
    tradeSecretDefinition: "standard",
    enforcementStandard: "moderate",
    maxReasonableDuration: 10,
    specialNotes: "Alaska follows standard UTSA provisions for trade secrets protection"
  },

  AZ: {
    hasUTSA: true,
    hasDTSA: true,
    workplaceMisconductRestrictions: true,
    readilyAscertainableStandard: true,
    dataPrivacyLaws: false,
    nonCompeteRestrictions: false,
    tradeSecretDefinition: "standard",
    enforcementStandard: "moderate",
    maxReasonableDuration: 10,
    specialNotes: "Arizona has restrictions on NDAs in workplace sexual misconduct cases"
  },

  AR: {
    hasUTSA: true,
    hasDTSA: true,
    workplaceMisconductRestrictions: false,
    readilyAscertainableStandard: true,
    dataPrivacyLaws: false,
    nonCompeteRestrictions: false,
    tradeSecretDefinition: "standard",
    enforcementStandard: "moderate",
    maxReasonableDuration: 10,
    specialNotes: "Arkansas follows standard UTSA provisions"
  },

  CA: {
    hasUTSA: true,
    hasDTSA: true,
    workplaceMisconductRestrictions: true,
    readilyAscertainableStandard: false,
    dataPrivacyLaws: true,
    nonCompeteRestrictions: true,
    tradeSecretDefinition: "strict",
    enforcementStandard: "strict",
    maxReasonableDuration: 7,
    specialNotes: "California has strong employee protections. NDAs cannot block reporting of sexual abuse, assault, or discrimination. Non-competes generally unenforceable. California declined to adopt UTSA's 'readily ascertainable' standard"
  },

  CO: {
    hasUTSA: true,
    hasDTSA: true,
    workplaceMisconductRestrictions: true,
    readilyAscertainableStandard: false,
    dataPrivacyLaws: true,
    nonCompeteRestrictions: true,
    tradeSecretDefinition: "strict",
    enforcementStandard: "strict",
    maxReasonableDuration: 8,
    specialNotes: "Colorado has comprehensive data privacy laws and restrictions on workplace misconduct NDAs. Declined to adopt UTSA's 'readily ascertainable' standard. Strong non-compete restrictions"
  },

  CT: {
    hasUTSA: true,
    hasDTSA: true,
    workplaceMisconductRestrictions: false,
    readilyAscertainableStandard: true,
    dataPrivacyLaws: false,
    nonCompeteRestrictions: false,
    tradeSecretDefinition: "standard",
    enforcementStandard: "moderate",
    maxReasonableDuration: 10,
    specialNotes: "Connecticut follows standard UTSA provisions"
  },

  DE: {
    hasUTSA: true,
    hasDTSA: true,
    workplaceMisconductRestrictions: false,
    readilyAscertainableStandard: true,
    dataPrivacyLaws: false,
    nonCompeteRestrictions: false,
    tradeSecretDefinition: "standard",
    enforcementStandard: "moderate",
    maxReasonableDuration: 10,
    specialNotes: "Delaware follows standard UTSA provisions with corporate-friendly enforcement"
  },

  DC: {
    hasUTSA: true,
    hasDTSA: true,
    workplaceMisconductRestrictions: false,
    readilyAscertainableStandard: true,
    dataPrivacyLaws: false,
    nonCompeteRestrictions: false,
    tradeSecretDefinition: "standard",
    enforcementStandard: "moderate",
    maxReasonableDuration: 10,
    specialNotes: "District of Columbia follows standard UTSA provisions"
  },

  FL: {
    hasUTSA: true,
    hasDTSA: true,
    workplaceMisconductRestrictions: false,
    readilyAscertainableStandard: true,
    dataPrivacyLaws: true,
    nonCompeteRestrictions: false,
    tradeSecretDefinition: "standard",
    enforcementStandard: "permissive",
    maxReasonableDuration: 15,
    specialNotes: "Florida has comprehensive data privacy laws (effective 2024) and generally business-friendly NDA enforcement"
  },

  GA: {
    hasUTSA: true,
    hasDTSA: true,
    workplaceMisconductRestrictions: false,
    readilyAscertainableStandard: true,
    dataPrivacyLaws: false,
    nonCompeteRestrictions: false,
    tradeSecretDefinition: "standard",
    enforcementStandard: "moderate",
    maxReasonableDuration: 10,
    specialNotes: "Georgia follows standard UTSA provisions"
  },

  HI: {
    hasUTSA: true,
    hasDTSA: true,
    workplaceMisconductRestrictions: true,
    readilyAscertainableStandard: true,
    dataPrivacyLaws: false,
    nonCompeteRestrictions: false,
    tradeSecretDefinition: "standard",
    enforcementStandard: "moderate",
    maxReasonableDuration: 10,
    specialNotes: "Hawaii has restrictions on NDAs in workplace sexual misconduct cases"
  },

  ID: {
    hasUTSA: true,
    hasDTSA: true,
    workplaceMisconductRestrictions: false,
    readilyAscertainableStandard: true,
    dataPrivacyLaws: false,
    nonCompeteRestrictions: false,
    tradeSecretDefinition: "standard",
    enforcementStandard: "moderate",
    maxReasonableDuration: 10,
    specialNotes: "Idaho follows standard UTSA provisions"
  },

  IL: {
    hasUTSA: true,
    hasDTSA: true,
    workplaceMisconductRestrictions: true,
    readilyAscertainableStandard: false,
    dataPrivacyLaws: false,
    nonCompeteRestrictions: true,
    tradeSecretDefinition: "strict",
    enforcementStandard: "strict",
    maxReasonableDuration: 8,
    specialNotes: "Illinois has restrictions on workplace misconduct NDAs and declined to adopt UTSA's 'readily ascertainable' standard. Strong non-compete restrictions"
  },

  IN: {
    hasUTSA: true,
    hasDTSA: true,
    workplaceMisconductRestrictions: false,
    readilyAscertainableStandard: true,
    dataPrivacyLaws: false,
    nonCompeteRestrictions: false,
    tradeSecretDefinition: "standard",
    enforcementStandard: "moderate",
    maxReasonableDuration: 10,
    specialNotes: "Indiana follows standard UTSA provisions"
  },

  IA: {
    hasUTSA: true,
    hasDTSA: true,
    workplaceMisconductRestrictions: false,
    readilyAscertainableStandard: true,
    dataPrivacyLaws: false,
    nonCompeteRestrictions: false,
    tradeSecretDefinition: "standard",
    enforcementStandard: "moderate",
    maxReasonableDuration: 10,
    specialNotes: "Iowa follows standard UTSA provisions"
  },

  KS: {
    hasUTSA: true,
    hasDTSA: true,
    workplaceMisconductRestrictions: false,
    readilyAscertainableStandard: true,
    dataPrivacyLaws: false,
    nonCompeteRestrictions: false,
    tradeSecretDefinition: "standard",
    enforcementStandard: "moderate",
    maxReasonableDuration: 10,
    specialNotes: "Kansas follows standard UTSA provisions"
  },

  KY: {
    hasUTSA: true,
    hasDTSA: true,
    workplaceMisconductRestrictions: false,
    readilyAscertainableStandard: true,
    dataPrivacyLaws: false,
    nonCompeteRestrictions: false,
    tradeSecretDefinition: "standard",
    enforcementStandard: "moderate",
    maxReasonableDuration: 10,
    specialNotes: "Kentucky follows standard UTSA provisions"
  },

  LA: {
    hasUTSA: true,
    hasDTSA: true,
    workplaceMisconductRestrictions: true,
    readilyAscertainableStandard: true,
    dataPrivacyLaws: false,
    nonCompeteRestrictions: false,
    tradeSecretDefinition: "standard",
    enforcementStandard: "moderate",
    maxReasonableDuration: 10,
    specialNotes: "Louisiana has restrictions on NDAs in workplace sexual misconduct cases"
  },

  ME: {
    hasUTSA: true,
    hasDTSA: true,
    workplaceMisconductRestrictions: true,
    readilyAscertainableStandard: true,
    dataPrivacyLaws: false,
    nonCompeteRestrictions: false,
    tradeSecretDefinition: "standard",
    enforcementStandard: "moderate",
    maxReasonableDuration: 10,
    specialNotes: "Maine has restrictions on NDAs in workplace sexual misconduct cases"
  },

  MD: {
    hasUTSA: true,
    hasDTSA: true,
    workplaceMisconductRestrictions: true,
    readilyAscertainableStandard: true,
    dataPrivacyLaws: false,
    nonCompeteRestrictions: false,
    tradeSecretDefinition: "standard",
    enforcementStandard: "moderate",
    maxReasonableDuration: 10,
    specialNotes: "Maryland has restrictions on NDAs in workplace sexual misconduct cases"
  },

  MA: {
    hasUTSA: false,
    hasDTSA: true,
    workplaceMisconductRestrictions: false,
    readilyAscertainableStandard: false,
    dataPrivacyLaws: false,
    nonCompeteRestrictions: true,
    tradeSecretDefinition: "strict",
    enforcementStandard: "strict",
    maxReasonableDuration: 7,
    specialNotes: "Massachusetts has NOT adopted UTSA (one of only two states). Has own trade secrets law. Strong non-compete restrictions"
  },

  MI: {
    hasUTSA: true,
    hasDTSA: true,
    workplaceMisconductRestrictions: false,
    readilyAscertainableStandard: true,
    dataPrivacyLaws: false,
    nonCompeteRestrictions: false,
    tradeSecretDefinition: "standard",
    enforcementStandard: "moderate",
    maxReasonableDuration: 10,
    specialNotes: "Michigan follows standard UTSA provisions"
  },

  MN: {
    hasUTSA: true,
    hasDTSA: true,
    workplaceMisconductRestrictions: false,
    readilyAscertainableStandard: true,
    dataPrivacyLaws: false,
    nonCompeteRestrictions: true,
    tradeSecretDefinition: "standard",
    enforcementStandard: "moderate",
    maxReasonableDuration: 10,
    specialNotes: "Minnesota follows standard UTSA provisions but has strong non-compete restrictions"
  },

  MS: {
    hasUTSA: true,
    hasDTSA: true,
    workplaceMisconductRestrictions: false,
    readilyAscertainableStandard: true,
    dataPrivacyLaws: false,
    nonCompeteRestrictions: false,
    tradeSecretDefinition: "standard",
    enforcementStandard: "moderate",
    maxReasonableDuration: 10,
    specialNotes: "Mississippi follows standard UTSA provisions"
  },

  MO: {
    hasUTSA: true,
    hasDTSA: true,
    workplaceMisconductRestrictions: false,
    readilyAscertainableStandard: true,
    dataPrivacyLaws: false,
    nonCompeteRestrictions: false,
    tradeSecretDefinition: "standard",
    enforcementStandard: "moderate",
    maxReasonableDuration: 10,
    specialNotes: "Missouri follows standard UTSA provisions"
  },

  MT: {
    hasUTSA: true,
    hasDTSA: true,
    workplaceMisconductRestrictions: false,
    readilyAscertainableStandard: true,
    dataPrivacyLaws: true,
    nonCompeteRestrictions: false,
    tradeSecretDefinition: "standard",
    enforcementStandard: "moderate",
    maxReasonableDuration: 10,
    specialNotes: "Montana has comprehensive data privacy laws (effective 2024) and follows standard UTSA provisions"
  },

  NE: {
    hasUTSA: true,
    hasDTSA: true,
    workplaceMisconductRestrictions: false,
    readilyAscertainableStandard: true,
    dataPrivacyLaws: false,
    nonCompeteRestrictions: false,
    tradeSecretDefinition: "standard",
    enforcementStandard: "moderate",
    maxReasonableDuration: 10,
    specialNotes: "Nebraska follows standard UTSA provisions"
  },

  NV: {
    hasUTSA: true,
    hasDTSA: true,
    workplaceMisconductRestrictions: true,
    readilyAscertainableStandard: true,
    dataPrivacyLaws: false,
    nonCompeteRestrictions: false,
    tradeSecretDefinition: "standard",
    enforcementStandard: "moderate",
    maxReasonableDuration: 10,
    specialNotes: "Nevada has restrictions on NDAs in workplace sexual misconduct cases"
  },

  NH: {
    hasUTSA: true,
    hasDTSA: true,
    workplaceMisconductRestrictions: false,
    readilyAscertainableStandard: true,
    dataPrivacyLaws: false,
    nonCompeteRestrictions: false,
    tradeSecretDefinition: "standard",
    enforcementStandard: "moderate",
    maxReasonableDuration: 10,
    specialNotes: "New Hampshire follows standard UTSA provisions"
  },

  NJ: {
    hasUTSA: true,
    hasDTSA: true,
    workplaceMisconductRestrictions: true,
    readilyAscertainableStandard: true,
    dataPrivacyLaws: false,
    nonCompeteRestrictions: false,
    tradeSecretDefinition: "standard",
    enforcementStandard: "moderate",
    maxReasonableDuration: 10,
    specialNotes: "New Jersey has restrictions on NDAs in workplace sexual misconduct cases"
  },

  NM: {
    hasUTSA: true,
    hasDTSA: true,
    workplaceMisconductRestrictions: true,
    readilyAscertainableStandard: true,
    dataPrivacyLaws: false,
    nonCompeteRestrictions: false,
    tradeSecretDefinition: "standard",
    enforcementStandard: "moderate",
    maxReasonableDuration: 10,
    specialNotes: "New Mexico has restrictions on NDAs in workplace sexual misconduct cases"
  },

  NY: {
    hasUTSA: false,
    hasDTSA: true,
    workplaceMisconductRestrictions: true,
    readilyAscertainableStandard: false,
    dataPrivacyLaws: false,
    nonCompeteRestrictions: true,
    tradeSecretDefinition: "strict",
    enforcementStandard: "strict",
    maxReasonableDuration: 7,
    specialNotes: "New York has NOT adopted UTSA (one of only two states). Has own trade secrets law. 2023 amendments further restricted NDAs in workplace settlement agreements. Strong non-compete restrictions"
  },

  NC: {
    hasUTSA: false,
    hasDTSA: true,
    workplaceMisconductRestrictions: false,
    readilyAscertainableStandard: false,
    dataPrivacyLaws: false,
    nonCompeteRestrictions: false,
    tradeSecretDefinition: "strict",
    enforcementStandard: "moderate",
    maxReasonableDuration: 10,
    specialNotes: "North Carolina has NOT formally adopted UTSA but has very similar law that borrows heavily from the act. Declined to adopt 'readily ascertainable' standard"
  },

  ND: {
    hasUTSA: true,
    hasDTSA: true,
    workplaceMisconductRestrictions: false,
    readilyAscertainableStandard: true,
    dataPrivacyLaws: false,
    nonCompeteRestrictions: false,
    tradeSecretDefinition: "standard",
    enforcementStandard: "moderate",
    maxReasonableDuration: 10,
    specialNotes: "North Dakota follows standard UTSA provisions"
  },

  OH: {
    hasUTSA: true,
    hasDTSA: true,
    workplaceMisconductRestrictions: false,
    readilyAscertainableStandard: true,
    dataPrivacyLaws: false,
    nonCompeteRestrictions: false,
    tradeSecretDefinition: "standard",
    enforcementStandard: "moderate",
    maxReasonableDuration: 10,
    specialNotes: "Ohio follows standard UTSA provisions"
  },

  OK: {
    hasUTSA: true,
    hasDTSA: true,
    workplaceMisconductRestrictions: false,
    readilyAscertainableStandard: true,
    dataPrivacyLaws: false,
    nonCompeteRestrictions: false,
    tradeSecretDefinition: "standard",
    enforcementStandard: "moderate",
    maxReasonableDuration: 10,
    specialNotes: "Oklahoma follows standard UTSA provisions"
  },

  OR: {
    hasUTSA: true,
    hasDTSA: true,
    workplaceMisconductRestrictions: true,
    readilyAscertainableStandard: false,
    dataPrivacyLaws: true,
    nonCompeteRestrictions: true,
    tradeSecretDefinition: "strict",
    enforcementStandard: "strict",
    maxReasonableDuration: 8,
    specialNotes: "Oregon has comprehensive data privacy laws (effective 2024), restrictions on workplace misconduct NDAs, and declined to adopt UTSA's 'readily ascertainable' standard. Strong non-compete restrictions"
  },

  PA: {
    hasUTSA: true,
    hasDTSA: true,
    workplaceMisconductRestrictions: false,
    readilyAscertainableStandard: true,
    dataPrivacyLaws: false,
    nonCompeteRestrictions: false,
    tradeSecretDefinition: "standard",
    enforcementStandard: "moderate",
    maxReasonableDuration: 10,
    specialNotes: "Pennsylvania follows standard UTSA provisions"
  },

  RI: {
    hasUTSA: true,
    hasDTSA: true,
    workplaceMisconductRestrictions: false,
    readilyAscertainableStandard: true,
    dataPrivacyLaws: false,
    nonCompeteRestrictions: false,
    tradeSecretDefinition: "standard",
    enforcementStandard: "moderate",
    maxReasonableDuration: 10,
    specialNotes: "Rhode Island follows standard UTSA provisions"
  },

  SC: {
    hasUTSA: true,
    hasDTSA: true,
    workplaceMisconductRestrictions: false,
    readilyAscertainableStandard: true,
    dataPrivacyLaws: false,
    nonCompeteRestrictions: false,
    tradeSecretDefinition: "standard",
    enforcementStandard: "moderate",
    maxReasonableDuration: 10,
    specialNotes: "South Carolina follows standard UTSA provisions"
  },

  SD: {
    hasUTSA: true,
    hasDTSA: true,
    workplaceMisconductRestrictions: false,
    readilyAscertainableStandard: true,
    dataPrivacyLaws: false,
    nonCompeteRestrictions: false,
    tradeSecretDefinition: "standard",
    enforcementStandard: "moderate",
    maxReasonableDuration: 10,
    specialNotes: "South Dakota follows standard UTSA provisions"
  },

  TN: {
    hasUTSA: true,
    hasDTSA: true,
    workplaceMisconductRestrictions: true,
    readilyAscertainableStandard: true,
    dataPrivacyLaws: false,
    nonCompeteRestrictions: false,
    tradeSecretDefinition: "standard",
    enforcementStandard: "moderate",
    maxReasonableDuration: 10,
    specialNotes: "Tennessee has restrictions on NDAs in workplace sexual misconduct cases"
  },

  TX: {
    hasUTSA: true,
    hasDTSA: true,
    workplaceMisconductRestrictions: false,
    readilyAscertainableStandard: true,
    dataPrivacyLaws: true,
    nonCompeteRestrictions: true,
    tradeSecretDefinition: "standard",
    enforcementStandard: "permissive",
    maxReasonableDuration: 15,
    specialNotes: "Texas has comprehensive data privacy laws (effective 2024). Federal judge blocked FTC non-compete rule in September 2024. Generally business-friendly enforcement"
  },

  UT: {
    hasUTSA: true,
    hasDTSA: true,
    workplaceMisconductRestrictions: true,
    readilyAscertainableStandard: true,
    dataPrivacyLaws: false,
    nonCompeteRestrictions: false,
    tradeSecretDefinition: "standard",
    enforcementStandard: "moderate",
    maxReasonableDuration: 10,
    specialNotes: "Utah has restrictions on NDAs in workplace sexual misconduct cases"
  },

  VT: {
    hasUTSA: true,
    hasDTSA: true,
    workplaceMisconductRestrictions: true,
    readilyAscertainableStandard: true,
    dataPrivacyLaws: false,
    nonCompeteRestrictions: false,
    tradeSecretDefinition: "standard",
    enforcementStandard: "moderate",
    maxReasonableDuration: 10,
    specialNotes: "Vermont has restrictions on NDAs in workplace sexual misconduct cases"
  },

  VA: {
    hasUTSA: true,
    hasDTSA: true,
    workplaceMisconductRestrictions: true,
    readilyAscertainableStandard: true,
    dataPrivacyLaws: false,
    nonCompeteRestrictions: false,
    tradeSecretDefinition: "standard",
    enforcementStandard: "moderate",
    maxReasonableDuration: 10,
    specialNotes: "Virginia has restrictions on NDAs in workplace sexual misconduct cases"
  },

  WA: {
    hasUTSA: true,
    hasDTSA: true,
    workplaceMisconductRestrictions: true,
    readilyAscertainableStandard: true,
    dataPrivacyLaws: false,
    nonCompeteRestrictions: true,
    tradeSecretDefinition: "standard",
    enforcementStandard: "strict",
    maxReasonableDuration: 8,
    specialNotes: "Washington has restrictions on NDAs in workplace sexual misconduct cases and strong non-compete restrictions"
  },

  WV: {
    hasUTSA: true,
    hasDTSA: true,
    workplaceMisconductRestrictions: false,
    readilyAscertainableStandard: true,
    dataPrivacyLaws: false,
    nonCompeteRestrictions: false,
    tradeSecretDefinition: "standard",
    enforcementStandard: "moderate",
    maxReasonableDuration: 10,
    specialNotes: "West Virginia follows standard UTSA provisions"
  },

  WI: {
    hasUTSA: true,
    hasDTSA: true,
    workplaceMisconductRestrictions: false,
    readilyAscertainableStandard: true,
    dataPrivacyLaws: false,
    nonCompeteRestrictions: false,
    tradeSecretDefinition: "standard",
    enforcementStandard: "moderate",
    maxReasonableDuration: 10,
    specialNotes: "Wisconsin follows standard UTSA provisions"
  },

  WY: {
    hasUTSA: true,
    hasDTSA: true,
    workplaceMisconductRestrictions: false,
    readilyAscertainableStandard: true,
    dataPrivacyLaws: false,
    nonCompeteRestrictions: false,
    tradeSecretDefinition: "standard",
    enforcementStandard: "moderate",
    maxReasonableDuration: 10,
    specialNotes: "Wyoming follows standard UTSA provisions"
  }
};

// Helper functions for NDA compliance
export function getNDACompliance(state: string): NDARule | undefined {
  return ndaCompliance[state.toUpperCase()];
}

export function hasUTSA(state: string): boolean {
  const rule = getNDACompliance(state);
  return rule ? rule.hasUTSA : false;
}

export function hasWorkplaceMisconductRestrictions(state: string): boolean {
  const rule = getNDACompliance(state);
  return rule ? rule.workplaceMisconductRestrictions : false;
}

export function getMaxReasonableDuration(state: string): number {
  const rule = getNDACompliance(state);
  return rule?.maxReasonableDuration ?? 10;
}

export function getEnforcementStandard(state: string): "strict" | "moderate" | "permissive" {
  const rule = getNDACompliance(state);
  return rule?.enforcementStandard ?? "moderate";
}

export function hasDataPrivacyLaws(state: string): boolean {
  const rule = getNDACompliance(state);
  return rule ? rule.dataPrivacyLaws : false;
}

export function hasNonCompeteRestrictions(state: string): boolean {
  const rule = getNDACompliance(state);
  return rule ? rule.nonCompeteRestrictions : false;
}

// Export for easier imports
export default ndaCompliance;