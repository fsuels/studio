// Power of Attorney compliance rules for all 50 US states
// Based on comprehensive research of state requirements for 2025

export interface PowerOfAttorneyRule {
  requiresNotary: boolean | "conditional";
  requiresWitnesses: boolean;
  witnessCount?: number;
  witnessRestrictions?: string[];
  hasOfficialForm?: boolean;
  localFormPath?: string;
  hasUPOAA: boolean; // Uniform Power of Attorney Act adopted
  specialNotes?: string;
  durablePowerDefault?: boolean;
  acknowledgmentRequired?: boolean;
}

export const powerOfAttorneyCompliance: Record<string, PowerOfAttorneyRule> = {
  // States requiring BOTH notary AND witnesses
  FL: {
    requiresNotary: true,
    requiresWitnesses: true,
    witnessCount: 2,
    witnessRestrictions: ["Cannot be agent", "Cannot be related by blood/marriage", "Cannot be beneficiary", "Must be 18+"],
    hasOfficialForm: false,
    hasUPOAA: false,
    specialNotes: "Florida requires both notarization AND two witnesses for all POA documents",
    durablePowerDefault: false,
    acknowledgmentRequired: true
  },

  IA: {
    requiresNotary: true,
    requiresWitnesses: true,
    witnessCount: 2,
    witnessRestrictions: ["Cannot be agent", "Cannot be related by blood/marriage", "Cannot be beneficiary", "Must be 18+"],
    hasOfficialForm: false,
    hasUPOAA: true,
    specialNotes: "Iowa follows UPOAA and requires both notarization AND two witnesses",
    durablePowerDefault: false,
    acknowledgmentRequired: true
  },

  KS: {
    requiresNotary: true,
    requiresWitnesses: true,
    witnessCount: 2,
    witnessRestrictions: ["Cannot be agent", "Cannot be related by blood/marriage", "Cannot be beneficiary", "Must be 18+"],
    hasOfficialForm: false,
    hasUPOAA: false,
    specialNotes: "Kansas requires both notarization AND two witnesses for all POA documents",
    durablePowerDefault: false,
    acknowledgmentRequired: true
  },

  KY: {
    requiresNotary: true,
    requiresWitnesses: true,
    witnessCount: 2,
    witnessRestrictions: ["Cannot be agent", "Cannot be related by blood/marriage", "Cannot be beneficiary", "Must be 18+"],
    hasOfficialForm: false,
    hasUPOAA: false,
    specialNotes: "Kentucky requires both notarization AND two witnesses. Adopted UPOAA in 2020",
    durablePowerDefault: false,
    acknowledgmentRequired: true
  },

  MD: {
    requiresNotary: true,
    requiresWitnesses: true,
    witnessCount: 2,
    witnessRestrictions: ["Cannot be agent", "Cannot be related by blood/marriage", "Cannot be beneficiary", "Must be 18+"],
    hasOfficialForm: false,
    hasUPOAA: true,
    localFormPath: "/forms/power-of-attorney/maryland/Maryland-Power-of-Attorney.pdf",
    specialNotes: "Maryland follows UPOAA and requires both notarization AND two witnesses",
    durablePowerDefault: false,
    acknowledgmentRequired: true
  },

  NC: {
    requiresNotary: true,
    requiresWitnesses: true,
    witnessCount: 2,
    witnessRestrictions: ["Cannot be agent", "Cannot be related by blood/marriage", "Cannot be beneficiary", "Must be 18+"],
    hasOfficialForm: false,
    hasUPOAA: true,
    specialNotes: "North Carolina follows UPOAA and requires both notarization AND two witnesses",
    durablePowerDefault: false,
    acknowledgmentRequired: true
  },

  UT: {
    requiresNotary: true,
    requiresWitnesses: true,
    witnessCount: 2,
    witnessRestrictions: ["Cannot be agent", "Cannot be related by blood/marriage", "Cannot be beneficiary", "Must be 18+"],
    hasOfficialForm: false,
    hasUPOAA: true,
    specialNotes: "Utah follows UPOAA and requires both notarization AND two witnesses",
    durablePowerDefault: false,
    acknowledgmentRequired: true
  },

  // States requiring witnesses OR notary (either acceptable)
  AK: {
    requiresNotary: false,
    requiresWitnesses: false,
    hasOfficialForm: false,
    hasUPOAA: false,
    specialNotes: "Alaska accepts either two witnesses OR notarization - either method is sufficient",
    durablePowerDefault: false,
    acknowledgmentRequired: false
  },

  AZ: {
    requiresNotary: false,
    requiresWitnesses: false,
    hasOfficialForm: false,
    hasUPOAA: false,
    specialNotes: "Arizona accepts either two witnesses OR notarization - either method is sufficient",
    durablePowerDefault: false,
    acknowledgmentRequired: false
  },

  AR: {
    requiresNotary: false,
    requiresWitnesses: false,
    hasOfficialForm: false,
    hasUPOAA: true,
    specialNotes: "Arkansas follows UPOAA and accepts either two witnesses OR notarization",
    durablePowerDefault: false,
    acknowledgmentRequired: false
  },

  CA: {
    requiresNotary: false,
    requiresWitnesses: false,
    hasOfficialForm: false,
    hasUPOAA: false,
    specialNotes: "California accepts either two witnesses OR notarization - either method is sufficient",
    durablePowerDefault: false,
    acknowledgmentRequired: true
  },

  HI: {
    requiresNotary: false,
    requiresWitnesses: false,
    hasOfficialForm: true,
    localFormPath: "/forms/power-of-attorney/hawaii/Hawaii-Statutory-Power-of-Attorney.pdf",
    hasUPOAA: true,
    specialNotes: "Hawaii has statutory form and follows UPOAA. Accepts either two witnesses OR notarization",
    durablePowerDefault: false,
    acknowledgmentRequired: false
  },

  ID: {
    requiresNotary: false,
    requiresWitnesses: false,
    hasOfficialForm: false,
    hasUPOAA: true,
    specialNotes: "Idaho follows UPOAA and accepts either two witnesses OR notarization",
    durablePowerDefault: false,
    acknowledgmentRequired: true
  },

  IL: {
    requiresNotary: false,
    requiresWitnesses: false,
    hasOfficialForm: false,
    hasUPOAA: false,
    specialNotes: "Illinois accepts either two witnesses OR notarization - either method is sufficient",
    durablePowerDefault: false,
    acknowledgmentRequired: false
  },

  MN: {
    requiresNotary: false,
    requiresWitnesses: false,
    hasOfficialForm: false,
    hasUPOAA: false,
    specialNotes: "Minnesota accepts either two witnesses OR notarization - either method is sufficient",
    durablePowerDefault: false,
    acknowledgmentRequired: false
  },

  MS: {
    requiresNotary: false,
    requiresWitnesses: false,
    hasOfficialForm: false,
    hasUPOAA: false,
    specialNotes: "Mississippi accepts either two witnesses OR notarization - either method is sufficient",
    durablePowerDefault: false,
    acknowledgmentRequired: false
  },

  NE: {
    requiresNotary: false,
    requiresWitnesses: false,
    hasOfficialForm: false,
    hasUPOAA: true,
    specialNotes: "Nebraska follows UPOAA and accepts either two witnesses OR notarization",
    durablePowerDefault: false,
    acknowledgmentRequired: false
  },

  NH: {
    requiresNotary: false,
    requiresWitnesses: false,
    hasOfficialForm: false,
    hasUPOAA: true,
    specialNotes: "New Hampshire follows UPOAA and accepts either two witnesses OR notarization",
    durablePowerDefault: false,
    acknowledgmentRequired: false
  },

  NJ: {
    requiresNotary: false,
    requiresWitnesses: false,
    hasOfficialForm: false,
    hasUPOAA: false,
    specialNotes: "New Jersey accepts either two witnesses OR notarization - either method is sufficient",
    durablePowerDefault: false,
    acknowledgmentRequired: false
  },

  NM: {
    requiresNotary: false,
    requiresWitnesses: false,
    hasOfficialForm: false,
    hasUPOAA: true,
    specialNotes: "New Mexico follows UPOAA and accepts either two witnesses OR notarization",
    durablePowerDefault: false,
    acknowledgmentRequired: false
  },

  ND: {
    requiresNotary: false,
    requiresWitnesses: false,
    hasOfficialForm: false,
    hasUPOAA: false,
    specialNotes: "North Dakota accepts either two witnesses OR notarization - either method is sufficient",
    durablePowerDefault: false,
    acknowledgmentRequired: false
  },

  OH: {
    requiresNotary: false,
    requiresWitnesses: false,
    hasOfficialForm: false,
    hasUPOAA: true,
    specialNotes: "Ohio follows UPOAA and accepts either two witnesses OR notarization",
    durablePowerDefault: false,
    acknowledgmentRequired: false
  },

  RI: {
    requiresNotary: false,
    requiresWitnesses: false,
    hasOfficialForm: false,
    hasUPOAA: false,
    specialNotes: "Rhode Island accepts either two witnesses OR notarization - either method is sufficient",
    durablePowerDefault: false,
    acknowledgmentRequired: false
  },

  TN: {
    requiresNotary: false,
    requiresWitnesses: false,
    hasOfficialForm: false,
    hasUPOAA: false,
    specialNotes: "Tennessee accepts either two witnesses OR notarization - either method is sufficient",
    durablePowerDefault: false,
    acknowledgmentRequired: false
  },

  TX: {
    requiresNotary: false,
    requiresWitnesses: false,
    hasOfficialForm: false,
    hasUPOAA: true,
    specialNotes: "Texas follows UPOAA and accepts either two witnesses OR notarization",
    durablePowerDefault: false,
    acknowledgmentRequired: false
  },

  WY: {
    requiresNotary: false,
    requiresWitnesses: false,
    hasOfficialForm: false,
    hasUPOAA: true,
    specialNotes: "Wyoming follows UPOAA and accepts either two witnesses OR notarization",
    durablePowerDefault: false,
    acknowledgmentRequired: false
  },

  // States requiring witnesses only (no notary required)
  AL: {
    requiresNotary: false,
    requiresWitnesses: true,
    witnessCount: 2,
    witnessRestrictions: ["Cannot be agent", "Cannot be related by blood/marriage", "Cannot be beneficiary", "Must be 18+"],
    hasOfficialForm: false,
    hasUPOAA: true,
    specialNotes: "Alabama follows UPOAA and requires two witnesses (no notary required)",
    durablePowerDefault: false,
    acknowledgmentRequired: false
  },

  CO: {
    requiresNotary: false,
    requiresWitnesses: true,
    witnessCount: 2,
    witnessRestrictions: ["Cannot be agent", "Cannot be related by blood/marriage", "Cannot be beneficiary", "Must be 18+"],
    hasOfficialForm: true,
    localFormPath: "/forms/power-of-attorney/colorado/Colorado-Power-of-Attorney.pdf",
    hasUPOAA: true,
    specialNotes: "Colorado follows UPOAA and requires two witnesses (no notary required)",
    durablePowerDefault: false,
    acknowledgmentRequired: false
  },

  CT: {
    requiresNotary: false,
    requiresWitnesses: true,
    witnessCount: 2,
    witnessRestrictions: ["Cannot be agent", "Cannot be related by blood/marriage", "Cannot be beneficiary", "Must be 18+"],
    hasOfficialForm: false,
    hasUPOAA: true,
    specialNotes: "Connecticut follows UPOAA and requires two witnesses (no notary required)",
    durablePowerDefault: false,
    acknowledgmentRequired: false
  },

  DE: {
    requiresNotary: true,
    requiresWitnesses: true,
    witnessCount: 1,
    witnessRestrictions: ["Cannot be agent", "Cannot be related by blood/marriage", "Cannot be beneficiary", "Must be 18+"],
    hasOfficialForm: false,
    hasUPOAA: false,
    specialNotes: "Delaware requires notarization AND one witness who meets strict requirements",
    durablePowerDefault: false,
    acknowledgmentRequired: true
  },

  DC: {
    requiresNotary: false,
    requiresWitnesses: true,
    witnessCount: 2,
    witnessRestrictions: ["Cannot be agent", "Cannot be related by blood/marriage", "Cannot be beneficiary", "Must be 18+"],
    hasOfficialForm: false,
    hasUPOAA: false,
    specialNotes: "District of Columbia requires two witnesses (no notary required)",
    durablePowerDefault: false,
    acknowledgmentRequired: false
  },

  GA: {
    requiresNotary: false,
    requiresWitnesses: true,
    witnessCount: 2,
    witnessRestrictions: ["Cannot be agent", "Cannot be related by blood/marriage", "Cannot be beneficiary", "Must be 18+"],
    hasOfficialForm: false,
    hasUPOAA: true,
    specialNotes: "Georgia follows UPOAA and requires two witnesses (no notary required)",
    durablePowerDefault: false,
    acknowledgmentRequired: false
  },

  IN: {
    requiresNotary: false,
    requiresWitnesses: true,
    witnessCount: 2,
    witnessRestrictions: ["Cannot be agent", "Cannot be related by blood/marriage", "Cannot be beneficiary", "Must be 18+"],
    hasOfficialForm: false,
    hasUPOAA: false,
    specialNotes: "Indiana requires two witnesses (no notary required)",
    durablePowerDefault: false,
    acknowledgmentRequired: false
  },

  LA: {
    requiresNotary: false,
    requiresWitnesses: true,
    witnessCount: 2,
    witnessRestrictions: ["Cannot be agent", "Cannot be related by blood/marriage", "Cannot be beneficiary", "Must be 18+"],
    hasOfficialForm: false,
    hasUPOAA: false,
    specialNotes: "Louisiana uses 'mandate' terminology and requires two witnesses (no notary required)",
    durablePowerDefault: false,
    acknowledgmentRequired: false
  },

  ME: {
    requiresNotary: false,
    requiresWitnesses: true,
    witnessCount: 2,
    witnessRestrictions: ["Cannot be agent", "Cannot be related by blood/marriage", "Cannot be beneficiary", "Must be 18+"],
    hasOfficialForm: false,
    hasUPOAA: true,
    specialNotes: "Maine follows UPOAA and requires two witnesses (no notary required)",
    durablePowerDefault: false,
    acknowledgmentRequired: false
  },

  MA: {
    requiresNotary: false,
    requiresWitnesses: true,
    witnessCount: 2,
    witnessRestrictions: ["Cannot be agent", "Cannot be related by blood/marriage", "Cannot be beneficiary", "Must be 18+"],
    hasOfficialForm: false,
    hasUPOAA: false,
    specialNotes: "Massachusetts requires two witnesses (no notary required). UPOAA legislation pending",
    durablePowerDefault: false,
    acknowledgmentRequired: false
  },

  MI: {
    requiresNotary: false,
    requiresWitnesses: true,
    witnessCount: 2,
    witnessRestrictions: ["Cannot be agent", "Cannot be related by blood/marriage", "Cannot be beneficiary", "Must be 18+"],
    hasOfficialForm: false,
    hasUPOAA: false,
    specialNotes: "Michigan requires two witnesses (no notary required)",
    durablePowerDefault: false,
    acknowledgmentRequired: false
  },

  MO: {
    requiresNotary: false,
    requiresWitnesses: true,
    witnessCount: 2,
    witnessRestrictions: ["Cannot be agent", "Cannot be related by blood/marriage", "Cannot be beneficiary", "Must be 18+"],
    hasOfficialForm: false,
    hasUPOAA: false,
    specialNotes: "Missouri requires two witnesses (no notary required)",
    durablePowerDefault: false,
    acknowledgmentRequired: false
  },

  MT: {
    requiresNotary: false,
    requiresWitnesses: true,
    witnessCount: 2,
    witnessRestrictions: ["Cannot be agent", "Cannot be related by blood/marriage", "Cannot be beneficiary", "Must be 18+"],
    hasOfficialForm: false,
    hasUPOAA: true,
    specialNotes: "Montana follows UPOAA and requires two witnesses (no notary required)",
    durablePowerDefault: false,
    acknowledgmentRequired: false
  },

  NV: {
    requiresNotary: false,
    requiresWitnesses: true,
    witnessCount: 2,
    witnessRestrictions: ["Cannot be agent", "Cannot be related by blood/marriage", "Cannot be beneficiary", "Must be 18+"],
    hasOfficialForm: false,
    hasUPOAA: true,
    specialNotes: "Nevada follows UPOAA and requires two witnesses (no notary required)",
    durablePowerDefault: false,
    acknowledgmentRequired: false
  },

  NY: {
    requiresNotary: false,
    requiresWitnesses: true,
    witnessCount: 2,
    witnessRestrictions: ["Cannot be agent", "Cannot be related by blood/marriage", "Cannot be beneficiary", "Must be 18+"],
    hasOfficialForm: false,
    hasUPOAA: false,
    specialNotes: "New York requires two witnesses (no notary required)",
    durablePowerDefault: false,
    acknowledgmentRequired: false
  },

  OR: {
    requiresNotary: false,
    requiresWitnesses: true,
    witnessCount: 2,
    witnessRestrictions: ["Cannot be agent", "Cannot be related by blood/marriage", "Cannot be beneficiary", "Must be 18+"],
    hasOfficialForm: false,
    hasUPOAA: false,
    specialNotes: "Oregon requires two witnesses (no notary required)",
    durablePowerDefault: false,
    acknowledgmentRequired: false
  },

  OK: {
    requiresNotary: false,
    requiresWitnesses: true,
    witnessCount: 2,
    witnessRestrictions: ["Cannot be agent", "Cannot be related by blood/marriage", "Cannot be beneficiary", "Must be 18+"],
    hasOfficialForm: false,
    hasUPOAA: false,
    specialNotes: "Oklahoma requires two witnesses (no notary required)",
    durablePowerDefault: false,
    acknowledgmentRequired: false
  },

  PA: {
    requiresNotary: false,
    requiresWitnesses: true,
    witnessCount: 2,
    witnessRestrictions: ["Cannot be agent", "Cannot be related by blood/marriage", "Cannot be beneficiary", "Must be 18+"],
    hasOfficialForm: false,
    hasUPOAA: true,
    specialNotes: "Pennsylvania follows UPOAA and requires two witnesses (no notary required)",
    durablePowerDefault: false,
    acknowledgmentRequired: false
  },

  SC: {
    requiresNotary: false,
    requiresWitnesses: true,
    witnessCount: 2,
    witnessRestrictions: ["Cannot be agent", "Cannot be related by blood/marriage", "Cannot be beneficiary", "Must be 18+"],
    hasOfficialForm: false,
    hasUPOAA: true,
    specialNotes: "South Carolina follows UPOAA and requires two witnesses (no notary required)",
    durablePowerDefault: false,
    acknowledgmentRequired: false
  },

  SD: {
    requiresNotary: false,
    requiresWitnesses: true,
    witnessCount: 2,
    witnessRestrictions: ["Cannot be agent", "Cannot be related by blood/marriage", "Cannot be beneficiary", "Must be 18+"],
    hasOfficialForm: false,
    hasUPOAA: false,
    specialNotes: "South Dakota requires two witnesses (no notary required). Adopted UPOAA in 2020",
    durablePowerDefault: false,
    acknowledgmentRequired: false
  },

  VT: {
    requiresNotary: false,
    requiresWitnesses: true,
    witnessCount: 2,
    witnessRestrictions: ["Cannot be agent", "Cannot be related by blood/marriage", "Cannot be beneficiary", "Must be 18+"],
    hasOfficialForm: false,
    hasUPOAA: false,
    specialNotes: "Vermont requires two witnesses (no notary required). UPOAA legislation pending",
    durablePowerDefault: false,
    acknowledgmentRequired: false
  },

  VA: {
    requiresNotary: false,
    requiresWitnesses: true,
    witnessCount: 2,
    witnessRestrictions: ["Cannot be agent", "Cannot be related by blood/marriage", "Cannot be beneficiary", "Must be 18+"],
    hasOfficialForm: false,
    hasUPOAA: true,
    specialNotes: "Virginia follows UPOAA and requires two witnesses (no notary required)",
    durablePowerDefault: false,
    acknowledgmentRequired: false
  },

  WA: {
    requiresNotary: true,
    requiresWitnesses: true,
    witnessCount: 2,
    witnessRestrictions: ["Cannot be agent", "Cannot be related by blood/marriage", "Cannot be beneficiary", "Must be 18+"],
    hasOfficialForm: false,
    hasUPOAA: true,
    specialNotes: "Washington follows UPOAA and requires acknowledgment before notary OR two witnesses",
    durablePowerDefault: false,
    acknowledgmentRequired: true
  },

  WV: {
    requiresNotary: false,
    requiresWitnesses: true,
    witnessCount: 2,
    witnessRestrictions: ["Cannot be agent", "Cannot be related by blood/marriage", "Cannot be beneficiary", "Must be 18+"],
    hasOfficialForm: false,
    hasUPOAA: true,
    specialNotes: "West Virginia follows UPOAA and requires two witnesses (no notary required)",
    durablePowerDefault: false,
    acknowledgmentRequired: false
  },

  WI: {
    requiresNotary: false,
    requiresWitnesses: true,
    witnessCount: 2,
    witnessRestrictions: ["Cannot be agent", "Cannot be related by blood/marriage", "Cannot be beneficiary", "Must be 18+"],
    hasOfficialForm: false,
    hasUPOAA: true,
    specialNotes: "Wisconsin follows UPOAA and requires two witnesses (no notary required)",
    durablePowerDefault: false,
    acknowledgmentRequired: false
  }
};

// Helper functions for Power of Attorney compliance
export function getPowerOfAttorneyCompliance(state: string): PowerOfAttorneyRule | undefined {
  return powerOfAttorneyCompliance[state.toUpperCase()];
}

export function requiresNotaryForPowerOfAttorney(state: string): boolean {
  const rule = getPowerOfAttorneyCompliance(state);
  return rule ? rule.requiresNotary === true : false;
}

export function requiresWitnessesForPowerOfAttorney(state: string): boolean {
  const rule = getPowerOfAttorneyCompliance(state);
  return rule ? rule.requiresWitnesses === true : false;
}

export function hasPowerOfAttorneyOfficialForm(state: string): boolean {
  const rule = getPowerOfAttorneyCompliance(state);
  return rule ? rule.hasOfficialForm === true : false;
}

export function followsUPOAA(state: string): boolean {
  const rule = getPowerOfAttorneyCompliance(state);
  return rule ? rule.hasUPOAA === true : false;
}

export function getWitnessRequirements(state: string): { count?: number; restrictions?: string[] } {
  const rule = getPowerOfAttorneyCompliance(state);
  if (!rule || !rule.requiresWitnesses) {
    return {};
  }

  return {
    count: rule.witnessCount,
    restrictions: rule.witnessRestrictions
  };
}

// Export for easier imports
export default powerOfAttorneyCompliance;