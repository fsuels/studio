// Power of Attorney compliance helper functions
// These functions provide easy access to compliance requirements for each state

import { getPowerOfAttorneyCompliance, type PowerOfAttorneyRule } from '@/lib/documents/us/power-of-attorney/compliance';

export function getPoaCompliance(state: string): PowerOfAttorneyRule | undefined {
  return getPowerOfAttorneyCompliance(state);
}

export function getPoaComplianceDisplay(state: string): {
  requiresNotary: boolean;
  requiresWitnesses: boolean;
  witnessCount: number;
  hasOfficialForm: boolean;
  followsUPOAA: boolean;
  badges: Array<{
    type: 'success' | 'warning' | 'info';
    text: string;
  }>;
  messages: Array<{
    type: 'success' | 'warning' | 'info';
    text: string;
  }>;
} {
  const rule = getPoaCompliance(state);

  if (!rule) {
    return {
      requiresNotary: false,
      requiresWitnesses: false,
      witnessCount: 0,
      hasOfficialForm: false,
      followsUPOAA: false,
      badges: [],
      messages: [{
        type: 'warning',
        text: 'Unable to determine compliance requirements for this state. Please consult with a local attorney.'
      }]
    };
  }

  const badges = [];
  const messages = [];

  // Determine notary requirement
  if (rule.requiresNotary) {
    badges.push({
      type: 'warning' as const,
      text: 'Notary Required'
    });
    messages.push({
      type: 'warning' as const,
      text: '⚠️ This Power of Attorney must be notarized to be valid in your state.'
    });
  } else {
    badges.push({
      type: 'success' as const,
      text: 'No Notary Required'
    });
    messages.push({
      type: 'success' as const,
      text: '✅ No notarization required for this Power of Attorney in your state.'
    });
  }

  // Determine witness requirement
  if (rule.requiresWitnesses) {
    const witnessText = rule.witnessCount === 1 ? '1 Witness Required' : `${rule.witnessCount} Witnesses Required`;
    badges.push({
      type: 'warning' as const,
      text: witnessText
    });

    const restrictionsText = rule.witnessRestrictions?.join(', ') || 'Standard witness restrictions apply';
    messages.push({
      type: 'warning' as const,
      text: `⚠️ This Power of Attorney requires ${rule.witnessCount} witness${rule.witnessCount > 1 ? 'es' : ''} at signing. Restrictions: ${restrictionsText}.`
    });
  } else {
    messages.push({
      type: 'success' as const,
      text: '✅ No witnesses required for this Power of Attorney in your state.'
    });
  }

  // Check for both notary AND witnesses
  if (rule.requiresNotary && rule.requiresWitnesses) {
    badges.push({
      type: 'warning' as const,
      text: 'High Requirements'
    });
    messages.push({
      type: 'warning' as const,
      text: '⚠️ Your state requires BOTH notarization AND witnesses for this Power of Attorney.'
    });
  }

  // Official form information
  if (rule.hasOfficialForm) {
    badges.push({
      type: 'info' as const,
      text: 'State Form Available'
    });
    messages.push({
      type: 'info' as const,
      text: 'ℹ️ Your state provides an official statutory Power of Attorney form.'
    });
  }

  // UPOAA information
  if (rule.hasUPOAA) {
    badges.push({
      type: 'info' as const,
      text: 'UPOAA State'
    });
    messages.push({
      type: 'info' as const,
      text: 'ℹ️ Your state has adopted the Uniform Power of Attorney Act, providing standardized protections.'
    });
  }

  // Special notes
  if (rule.specialNotes) {
    messages.push({
      type: 'info' as const,
      text: `📋 ${rule.specialNotes}`
    });
  }

  return {
    requiresNotary: rule.requiresNotary === true,
    requiresWitnesses: rule.requiresWitnesses === true,
    witnessCount: rule.witnessCount || 0,
    hasOfficialForm: rule.hasOfficialForm === true,
    followsUPOAA: rule.hasUPOAA === true,
    badges,
    messages
  };
}

export function getPoaRequirementsSummary(state: string): string {
  const compliance = getPoaComplianceDisplay(state);

  const requirements = [];

  if (compliance.requiresNotary && compliance.requiresWitnesses) {
    requirements.push(`notarization + ${compliance.witnessCount} witness${compliance.witnessCount > 1 ? 'es' : ''}`);
  } else if (compliance.requiresNotary) {
    requirements.push('notarization');
  } else if (compliance.requiresWitnesses) {
    requirements.push(`${compliance.witnessCount} witness${compliance.witnessCount > 1 ? 'es' : ''}`);
  } else {
    requirements.push('basic execution');
  }

  if (compliance.hasOfficialForm) {
    requirements.push('state form recommended');
  }

  return requirements.join(', ');
}

// State code conversion helpers
export function getStateCodeFromName(stateName: string): string {
  const stateMap: Record<string, string> = {
    'Alabama': 'AL', 'Alaska': 'AK', 'Arizona': 'AZ', 'Arkansas': 'AR', 'California': 'CA',
    'Colorado': 'CO', 'Connecticut': 'CT', 'Delaware': 'DE', 'District of Columbia': 'DC', 'Florida': 'FL',
    'Georgia': 'GA', 'Hawaii': 'HI', 'Idaho': 'ID', 'Illinois': 'IL', 'Indiana': 'IN',
    'Iowa': 'IA', 'Kansas': 'KS', 'Kentucky': 'KY', 'Louisiana': 'LA', 'Maine': 'ME',
    'Maryland': 'MD', 'Massachusetts': 'MA', 'Michigan': 'MI', 'Minnesota': 'MN', 'Mississippi': 'MS',
    'Missouri': 'MO', 'Montana': 'MT', 'Nebraska': 'NE', 'Nevada': 'NV', 'New Hampshire': 'NH',
    'New Jersey': 'NJ', 'New Mexico': 'NM', 'New York': 'NY', 'North Carolina': 'NC', 'North Dakota': 'ND',
    'Ohio': 'OH', 'Oklahoma': 'OK', 'Oregon': 'OR', 'Pennsylvania': 'PA', 'Rhode Island': 'RI',
    'South Carolina': 'SC', 'South Dakota': 'SD', 'Tennessee': 'TN', 'Texas': 'TX', 'Utah': 'UT',
    'Vermont': 'VT', 'Virginia': 'VA', 'Washington': 'WA', 'West Virginia': 'WV', 'Wisconsin': 'WI', 'Wyoming': 'WY'
  };

  return stateMap[stateName] || stateName;
}

export function getStateNameFromCode(stateCode: string): string {
  const stateMap: Record<string, string> = {
    'AL': 'Alabama', 'AK': 'Alaska', 'AZ': 'Arizona', 'AR': 'Arkansas', 'CA': 'California',
    'CO': 'Colorado', 'CT': 'Connecticut', 'DE': 'Delaware', 'DC': 'District of Columbia', 'FL': 'Florida',
    'GA': 'Georgia', 'HI': 'Hawaii', 'ID': 'Idaho', 'IL': 'Illinois', 'IN': 'Indiana',
    'IA': 'Iowa', 'KS': 'Kansas', 'KY': 'Kentucky', 'LA': 'Louisiana', 'ME': 'Maine',
    'MD': 'Maryland', 'MA': 'Massachusetts', 'MI': 'Michigan', 'MN': 'Minnesota', 'MS': 'Mississippi',
    'MO': 'Missouri', 'MT': 'Montana', 'NE': 'Nebraska', 'NV': 'Nevada', 'NH': 'New Hampshire',
    'NJ': 'New Jersey', 'NM': 'New Mexico', 'NY': 'New York', 'NC': 'North Carolina', 'ND': 'North Dakota',
    'OH': 'Ohio', 'OK': 'Oklahoma', 'OR': 'Oregon', 'PA': 'Pennsylvania', 'RI': 'Rhode Island',
    'SC': 'South Carolina', 'SD': 'South Dakota', 'TN': 'Tennessee', 'TX': 'Texas', 'UT': 'Utah',
    'VT': 'Vermont', 'VA': 'Virginia', 'WA': 'Washington', 'WV': 'West Virginia', 'WI': 'Wisconsin', 'WY': 'Wyoming'
  };

  return stateMap[stateCode.toUpperCase()] || stateCode;
}