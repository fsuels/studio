// Non-Disclosure Agreement compliance helper functions
// These functions provide easy access to compliance requirements for each state

import { getNDACompliance, type NDARule } from '@/lib/documents/us/non-disclosure-agreement/compliance';

export function getNdaCompliance(state: string): NDARule | undefined {
  return getNDACompliance(state);
}

export function getNdaComplianceDisplay(state: string): {
  hasUTSA: boolean;
  workplaceMisconductRestrictions: boolean;
  maxReasonableDuration: number;
  enforcementStandard: string;
  hasDataPrivacyLaws: boolean;
  hasNonCompeteRestrictions: boolean;
  badges: Array<{
    type: 'success' | 'warning' | 'info';
    text: string;
  }>;
  messages: Array<{
    type: 'success' | 'warning' | 'info';
    text: string;
  }>;
} {
  const rule = getNdaCompliance(state);

  if (!rule) {
    return {
      hasUTSA: false,
      workplaceMisconductRestrictions: false,
      maxReasonableDuration: 10,
      enforcementStandard: 'moderate',
      hasDataPrivacyLaws: false,
      hasNonCompeteRestrictions: false,
      badges: [],
      messages: [{
        type: 'warning',
        text: 'Unable to determine NDA requirements for this state. Please consult with a local attorney.'
      }]
    };
  }

  const badges = [];
  const messages = [];

  // UTSA adoption status
  if (rule.hasUTSA) {
    badges.push({
      type: 'success' as const,
      text: 'UTSA Adopted'
    });
    messages.push({
      type: 'info' as const,
      text: '✅ Your state has adopted the Uniform Trade Secrets Act, providing standardized trade secret protection.'
    });
  } else {
    badges.push({
      type: 'warning' as const,
      text: 'No UTSA'
    });
    messages.push({
      type: 'warning' as const,
      text: '⚠️ Your state has NOT adopted the Uniform Trade Secrets Act. State-specific trade secret laws apply.'
    });
  }

  // Workplace misconduct restrictions
  if (rule.workplaceMisconductRestrictions) {
    badges.push({
      type: 'warning' as const,
      text: 'Workplace Restrictions'
    });
    messages.push({
      type: 'warning' as const,
      text: '⚠️ Your state restricts NDAs in workplace harassment and discrimination cases. Victims can choose whether to sign.'
    });
  }

  // Enforcement standard
  const enforcementBadge = {
    strict: { type: 'warning' as const, text: 'Strict Enforcement' },
    moderate: { type: 'info' as const, text: 'Moderate Enforcement' },
    permissive: { type: 'success' as const, text: 'Business-Friendly' }
  }[rule.enforcementStandard];

  if (enforcementBadge) {
    badges.push(enforcementBadge);
  }

  const enforcementMessage = {
    strict: '⚠️ Your state has strict enforcement standards for NDAs. Ensure reasonable scope and duration.',
    moderate: 'ℹ️ Your state has moderate enforcement standards for NDAs. Follow standard best practices.',
    permissive: '✅ Your state has business-friendly enforcement standards for NDAs.'
  }[rule.enforcementStandard];

  if (enforcementMessage) {
    messages.push({
      type: rule.enforcementStandard === 'strict' ? 'warning' as const :
           rule.enforcementStandard === 'moderate' ? 'info' as const : 'success' as const,
      text: enforcementMessage
    });
  }

  // Duration recommendations
  messages.push({
    type: 'info' as const,
    text: `📅 Recommended maximum duration for your state: ${rule.maxReasonableDuration} years.`
  });

  // Data privacy laws
  if (rule.dataPrivacyLaws) {
    badges.push({
      type: 'info' as const,
      text: 'Data Privacy Laws'
    });
    messages.push({
      type: 'info' as const,
      text: 'ℹ️ Your state has comprehensive data privacy laws that may affect information handling in NDAs.'
    });
  }

  // Non-compete restrictions
  if (rule.hasNonCompeteRestrictions) {
    badges.push({
      type: 'warning' as const,
      text: 'Non-Compete Limits'
    });
    messages.push({
      type: 'warning' as const,
      text: '⚠️ Your state has restrictions on non-compete agreements. Ensure NDAs focus on confidentiality, not competition.'
    });
  }

  // Readily ascertainable standard
  if (!rule.readilyAscertainableStandard) {
    messages.push({
      type: 'info' as const,
      text: 'ℹ️ Your state uses stricter trade secret standards than the standard UTSA "readily ascertainable" test.'
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
    hasUTSA: rule.hasUTSA,
    workplaceMisconductRestrictions: rule.workplaceMisconductRestrictions,
    maxReasonableDuration: rule.maxReasonableDuration || 10,
    enforcementStandard: rule.enforcementStandard,
    hasDataPrivacyLaws: rule.dataPrivacyLaws,
    hasNonCompeteRestrictions: rule.nonCompeteRestrictions,
    badges,
    messages
  };
}

export function getNdaRequirementsSummary(state: string): string {
  const compliance = getNdaComplianceDisplay(state);

  const requirements = [];

  if (!compliance.hasUTSA) {
    requirements.push('state-specific trade secret laws');
  } else {
    requirements.push('UTSA protection');
  }

  requirements.push(`${compliance.enforcementStandard} enforcement`);
  requirements.push(`max ${compliance.maxReasonableDuration}yr duration`);

  if (compliance.workplaceMisconductRestrictions) {
    requirements.push('workplace limitations');
  }

  if (compliance.hasNonCompeteRestrictions) {
    requirements.push('non-compete restrictions');
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