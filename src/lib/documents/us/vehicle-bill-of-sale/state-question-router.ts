import type { Question } from '@/types/documents';
import { vehicleBillOfSaleQuestions } from './questions'; // Generic questions
import { floridaVehicleBillOfSaleQuestions, floridaFieldMapping } from './state-specific/florida-questions';
import { coloradoVehicleBillOfSaleQuestions, coloradoFieldMapping } from './state-specific/colorado-questions';
import { alabamaVehicleBillOfSaleQuestions, alabamaFieldMapping } from './state-specific/alabama-questions';
import { georgiaVehicleBillOfSaleQuestions, georgiaFieldMapping } from './state-specific/georgia-questions';
import { idahoVehicleBillOfSaleQuestions, idahoFieldMapping } from './state-specific/idaho-questions';
import { kansasVehicleBillOfSaleQuestions, kansasFieldMapping } from './state-specific/kansas-questions';
import { marylandVehicleBillOfSaleQuestions, marylandFieldMapping } from './state-specific/maryland-questions';
import { montanaVehicleBillOfSaleQuestions, montanaFieldMapping } from './state-specific/montana-questions';
import { northDakotaVehicleBillOfSaleQuestions, northDakotaFieldMapping } from './state-specific/north-dakota-questions';
import { westVirginiaVehicleBillOfSaleQuestions, westVirginiaFieldMapping } from './state-specific/west-virginia-questions';
import { getVehicleBillOfSaleCompliance } from '@/lib/compliance-helper';

export interface StateQuestionConfig {
  questions: Question[];
  fieldMapping: Record<string, string>;
  pdfPath?: string;
  requiresSpecialHandling: boolean;
}

// States that have mandatory official forms requiring special question sets
const STATES_WITH_OFFICIAL_FORMS = ['FL', 'CO', 'AL', 'GA', 'ID', 'KS', 'MD', 'MT', 'ND', 'WV'];

export function getQuestionsForState(stateCode: string): StateQuestionConfig {
  if (!stateCode || stateCode.length !== 2) {
    return {
      questions: vehicleBillOfSaleQuestions,
      fieldMapping: {},
      requiresSpecialHandling: false
    };
  }

  const state = stateCode.toUpperCase();
  const compliance = getVehicleBillOfSaleCompliance(state);

  // Check if state has official form requirement
  if (compliance?.officialForm && compliance?.localFormPath) {
    return getOfficialFormQuestions(state, compliance.localFormPath);
  }

  // Return generic questions for states without official forms
  return {
    questions: vehicleBillOfSaleQuestions,
    fieldMapping: {},
    requiresSpecialHandling: false
  };
}

function getOfficialFormQuestions(state: string, pdfPath: string): StateQuestionConfig {
  switch (state) {
    case 'FL':
      return {
        questions: floridaVehicleBillOfSaleQuestions,
        fieldMapping: floridaFieldMapping,
        pdfPath: pdfPath,
        requiresSpecialHandling: true
      };

    case 'CO':
      return {
        questions: coloradoVehicleBillOfSaleQuestions,
        fieldMapping: coloradoFieldMapping,
        pdfPath: pdfPath,
        requiresSpecialHandling: true
      };

    case 'AL':
      return {
        questions: alabamaVehicleBillOfSaleQuestions,
        fieldMapping: alabamaFieldMapping,
        pdfPath: pdfPath,
        requiresSpecialHandling: true
      };

    case 'GA':
      return {
        questions: georgiaVehicleBillOfSaleQuestions,
        fieldMapping: georgiaFieldMapping,
        pdfPath: pdfPath,
        requiresSpecialHandling: true
      };

    case 'ID':
      return {
        questions: idahoVehicleBillOfSaleQuestions,
        fieldMapping: idahoFieldMapping,
        pdfPath: pdfPath,
        requiresSpecialHandling: true
      };

    case 'KS':
      return {
        questions: kansasVehicleBillOfSaleQuestions,
        fieldMapping: kansasFieldMapping,
        pdfPath: pdfPath,
        requiresSpecialHandling: true
      };

    case 'MD':
      return {
        questions: marylandVehicleBillOfSaleQuestions,
        fieldMapping: marylandFieldMapping,
        pdfPath: pdfPath,
        requiresSpecialHandling: true
      };

    case 'MT':
      return {
        questions: montanaVehicleBillOfSaleQuestions,
        fieldMapping: montanaFieldMapping,
        pdfPath: pdfPath,
        requiresSpecialHandling: true
      };

    case 'ND':
      return {
        questions: northDakotaVehicleBillOfSaleQuestions,
        fieldMapping: northDakotaFieldMapping,
        pdfPath: pdfPath,
        requiresSpecialHandling: true
      };

    case 'WV':
      return {
        questions: westVirginiaVehicleBillOfSaleQuestions,
        fieldMapping: westVirginiaFieldMapping,
        pdfPath: pdfPath,
        requiresSpecialHandling: true
      };

    default:
      // Fallback for other states with official forms
      return {
        questions: vehicleBillOfSaleQuestions,
        fieldMapping: {},
        pdfPath: pdfPath,
        requiresSpecialHandling: true
      };
  }
}

// Placeholder functions for other states with official forms
// These would need to be implemented with state-specific question sets
function getAlabamaQuestions(pdfPath: string): StateQuestionConfig {
  return {
    questions: [...vehicleBillOfSaleQuestions,
      {
        id: 'alabama_notary_required',
        label: 'Notarization Acknowledgment',
        type: 'boolean',
        required: true,
        tooltip: 'Alabama requires notarization for all vehicle sales'
      }
    ],
    fieldMapping: {}, // Would need Alabama MVT-32-13B specific mapping
    pdfPath,
    requiresSpecialHandling: true
  };
}

function getGeorgiaQuestions(pdfPath: string): StateQuestionConfig {
  return {
    questions: [...vehicleBillOfSaleQuestions,
      {
        id: 'georgia_notary_required',
        label: 'Notarization Acknowledgment',
        type: 'boolean',
        required: true,
        tooltip: 'Georgia requires notarization for vehicle bills of sale'
      }
    ],
    fieldMapping: {}, // Would need Georgia T-7 specific mapping
    pdfPath,
    requiresSpecialHandling: true
  };
}

function getIdahoQuestions(pdfPath: string): StateQuestionConfig {
  return {
    questions: vehicleBillOfSaleQuestions,
    fieldMapping: {}, // Would need Idaho ITD-3738 specific mapping
    pdfPath,
    requiresSpecialHandling: true
  };
}

function getKansasQuestions(pdfPath: string): StateQuestionConfig {
  return {
    questions: vehicleBillOfSaleQuestions,
    fieldMapping: {}, // Would need Kansas TR-312 specific mapping
    pdfPath,
    requiresSpecialHandling: true
  };
}

function getMarylandQuestions(pdfPath: string): StateQuestionConfig {
  return {
    questions: vehicleBillOfSaleQuestions,
    fieldMapping: {}, // Would need Maryland VR-181 specific mapping
    pdfPath,
    requiresSpecialHandling: true
  };
}

function getMontanaQuestions(pdfPath: string): StateQuestionConfig {
  return {
    questions: vehicleBillOfSaleQuestions,
    fieldMapping: {}, // Would need Montana MV-24 specific mapping
    pdfPath,
    requiresSpecialHandling: true
  };
}

function getNorthDakotaQuestions(pdfPath: string): StateQuestionConfig {
  return {
    questions: vehicleBillOfSaleQuestions,
    fieldMapping: {}, // Would need North Dakota SFN-2888 specific mapping
    pdfPath,
    requiresSpecialHandling: true
  };
}

function getWestVirginiaQuestions(pdfPath: string): StateQuestionConfig {
  return {
    questions: vehicleBillOfSaleQuestions,
    fieldMapping: {}, // Would need West Virginia DMV-7-TR specific mapping
    pdfPath,
    requiresSpecialHandling: true
  };
}

// Helper function to get state display name
export function getStateDisplayName(stateCode: string): string {
  const stateNames: Record<string, string> = {
    'AL': 'Alabama', 'AK': 'Alaska', 'AZ': 'Arizona', 'AR': 'Arkansas', 'CA': 'California',
    'CO': 'Colorado', 'CT': 'Connecticut', 'DE': 'Delaware', 'FL': 'Florida', 'GA': 'Georgia',
    'HI': 'Hawaii', 'ID': 'Idaho', 'IL': 'Illinois', 'IN': 'Indiana', 'IA': 'Iowa',
    'KS': 'Kansas', 'KY': 'Kentucky', 'LA': 'Louisiana', 'ME': 'Maine', 'MD': 'Maryland',
    'MA': 'Massachusetts', 'MI': 'Michigan', 'MN': 'Minnesota', 'MS': 'Mississippi', 'MO': 'Missouri',
    'MT': 'Montana', 'NE': 'Nebraska', 'NV': 'Nevada', 'NH': 'New Hampshire', 'NJ': 'New Jersey',
    'NM': 'New Mexico', 'NY': 'New York', 'NC': 'North Carolina', 'ND': 'North Dakota', 'OH': 'Ohio',
    'OK': 'Oklahoma', 'OR': 'Oregon', 'PA': 'Pennsylvania', 'RI': 'Rhode Island', 'SC': 'South Carolina',
    'SD': 'South Dakota', 'TN': 'Tennessee', 'TX': 'Texas', 'UT': 'Utah', 'VT': 'Vermont',
    'VA': 'Virginia', 'WA': 'Washington', 'WV': 'West Virginia', 'WI': 'Wisconsin', 'WY': 'Wyoming'
  };

  return stateNames[stateCode.toUpperCase()] || stateCode;
}

// Helper to determine if state requires official PDF form filling
export function requiresOfficialPdfForm(stateCode: string): boolean {
  return STATES_WITH_OFFICIAL_FORMS.includes(stateCode.toUpperCase());
}