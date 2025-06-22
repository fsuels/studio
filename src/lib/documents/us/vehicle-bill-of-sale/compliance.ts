// State-specific compliance rules for Vehicle Bill of Sale
export type StateAbbr = 
  | 'AL' | 'AK' | 'AZ' | 'AR' | 'CA' | 'CO' | 'CT' | 'DE' | 'FL' | 'GA'
  | 'HI' | 'ID' | 'IL' | 'IN' | 'IA' | 'KS' | 'KY' | 'LA' | 'ME' | 'MD'
  | 'MA' | 'MI' | 'MN' | 'MS' | 'MO' | 'MT' | 'NE' | 'NV' | 'NH' | 'NJ'
  | 'NM' | 'NY' | 'NC' | 'ND' | 'OH' | 'OK' | 'OR' | 'PA' | 'RI' | 'SC'
  | 'SD' | 'TN' | 'TX' | 'UT' | 'VT' | 'VA' | 'WA' | 'WV' | 'WI' | 'WY';

export interface VehicleBillOfSaleRule {
  requiresNotary: boolean | "conditional";
  officialForm?: string;
  billOfSaleMandatory: boolean;
  odometerIntegrated: boolean;
  specialNotes?: string;
  localFormPath?: string;
}

export const vehicleBillOfSaleCompliance: Record<StateAbbr, VehicleBillOfSaleRule> = {
  'AL': {
    requiresNotary: true,
    officialForm: 'MVT 32-13B',
    billOfSaleMandatory: true,
    odometerIntegrated: true,
    specialNotes: 'Requires notarization for all vehicle sales. Official form must be used.',
    localFormPath: '/forms/vehicle-bill-of-sale/alabama/MVT-32-13B.pdf'
  },
  'AK': {
    requiresNotary: false,
    billOfSaleMandatory: false,
    odometerIntegrated: false,
    specialNotes: 'Bill of sale is optional but recommended for registration.'
  },
  'AZ': {
    requiresNotary: true,
    billOfSaleMandatory: true,
    odometerIntegrated: true,
    specialNotes: 'Notarization required. Must include odometer disclosure.'
  },
  'AR': {
    requiresNotary: true,
    billOfSaleMandatory: true,
    odometerIntegrated: true,
    specialNotes: 'Notarization required for vehicles over 10 years old.'
  },
  'CA': {
    requiresNotary: false,
    billOfSaleMandatory: true,
    odometerIntegrated: true,
    specialNotes: 'Bill of sale required for registration. No notarization needed.'
  },
  'CO': {
    requiresNotary: true,
    officialForm: 'DR 2116',
    billOfSaleMandatory: true,
    odometerIntegrated: true,
    specialNotes: 'Must use official Colorado form. Notarization required.',
    localFormPath: '/forms/vehicle-bill-of-sale/colorado/DR-2116.pdf'
  },
  'CT': {
    requiresNotary: false,
    billOfSaleMandatory: true,
    odometerIntegrated: true,
    specialNotes: 'Bill of sale required for registration.'
  },
  'DE': {
    requiresNotary: false,
    billOfSaleMandatory: false,
    odometerIntegrated: false,
    specialNotes: 'Bill of sale is optional.'
  },
  'FL': {
    requiresNotary: true,
    officialForm: 'HSMV 82050',
    billOfSaleMandatory: true,
    odometerIntegrated: true,
    specialNotes: 'Must use official HSMV 82050 form with notarization.',
    localFormPath: '/forms/vehicle-bill-of-sale/florida/HSMV-82050.pdf'
  },
  'GA': {
    requiresNotary: true,
    officialForm: 'T-7',
    billOfSaleMandatory: true,
    odometerIntegrated: true,
    specialNotes: 'Must use official T-7 form. Notarization required.',
    localFormPath: '/forms/vehicle-bill-of-sale/georgia/T-7.pdf'
  },
  'HI': {
    requiresNotary: false,
    billOfSaleMandatory: true,
    odometerIntegrated: true,
    specialNotes: 'Bill of sale required for registration.'
  },
  'ID': {
    requiresNotary: true,
    officialForm: 'ITD 3738',
    billOfSaleMandatory: true,
    odometerIntegrated: true,
    specialNotes: 'Must use official ITD 3738 form with notarization.',
    localFormPath: '/forms/vehicle-bill-of-sale/idaho/ITD-3738.pdf'
  },
  'IL': {
    requiresNotary: false,
    billOfSaleMandatory: true,
    odometerIntegrated: true,
    specialNotes: 'Bill of sale required for registration.'
  },
  'IN': {
    requiresNotary: true,
    billOfSaleMandatory: true,
    odometerIntegrated: true,
    specialNotes: 'Notarization required for vehicles over certain value.'
  },
  'IA': {
    requiresNotary: false,
    billOfSaleMandatory: false,
    odometerIntegrated: false,
    specialNotes: 'Bill of sale is optional.'
  },
  'KS': {
    requiresNotary: true,
    officialForm: 'TR-312',
    billOfSaleMandatory: true,
    odometerIntegrated: true,
    specialNotes: 'Must use official TR-312 form. Notarization required.',
    localFormPath: '/forms/vehicle-bill-of-sale/kansas/TR-312.pdf'
  },
  'KY': {
    requiresNotary: true,
    billOfSaleMandatory: true,
    odometerIntegrated: true,
    specialNotes: 'Notarization required for all vehicle sales.'
  },
  'LA': {
    requiresNotary: true,
    billOfSaleMandatory: true,
    odometerIntegrated: true,
    specialNotes: 'Notarization required. Must include odometer disclosure.'
  },
  'ME': {
    requiresNotary: false,
    billOfSaleMandatory: true,
    odometerIntegrated: true,
    specialNotes: 'Bill of sale required for registration.'
  },
  'MD': {
    requiresNotary: true,
    officialForm: 'VR-181',
    billOfSaleMandatory: true,
    odometerIntegrated: true,
    specialNotes: 'Must use official VR-181 form with notarization.',
    localFormPath: '/forms/vehicle-bill-of-sale/maryland/VR-181.pdf'
  },
  'MA': {
    requiresNotary: false,
    billOfSaleMandatory: true,
    odometerIntegrated: true,
    specialNotes: 'Bill of sale required for registration.'
  },
  'MI': {
    requiresNotary: false,
    billOfSaleMandatory: true,
    odometerIntegrated: true,
    specialNotes: 'Bill of sale required for registration.'
  },
  'MN': {
    requiresNotary: false,
    billOfSaleMandatory: true,
    odometerIntegrated: true,
    specialNotes: 'Bill of sale required for registration.'
  },
  'MS': {
    requiresNotary: true,
    billOfSaleMandatory: true,
    odometerIntegrated: true,
    specialNotes: 'Notarization required for all vehicle sales.'
  },
  'MO': {
    requiresNotary: true,
    billOfSaleMandatory: true,
    odometerIntegrated: true,
    specialNotes: 'Notarization required. Must include odometer disclosure.'
  },
  'MT': {
    requiresNotary: true,
    officialForm: 'MV-24',
    billOfSaleMandatory: true,
    odometerIntegrated: true,
    specialNotes: 'Must use official MV-24 form. Notarization required.',
    localFormPath: '/forms/vehicle-bill-of-sale/montana/MV-24.pdf'
  },
  'NE': {
    requiresNotary: true,
    billOfSaleMandatory: true,
    odometerIntegrated: true,
    specialNotes: 'Notarization required for all vehicle sales.'
  },
  'NV': {
    requiresNotary: true,
    billOfSaleMandatory: true,
    odometerIntegrated: true,
    specialNotes: 'Notarization required. Must include odometer disclosure.'
  },
  'NH': {
    requiresNotary: false,
    billOfSaleMandatory: true,
    odometerIntegrated: true,
    specialNotes: 'Bill of sale required for registration.'
  },
  'NJ': {
    requiresNotary: false,
    billOfSaleMandatory: true,
    odometerIntegrated: true,
    specialNotes: 'Bill of sale required for registration.'
  },
  'NM': {
    requiresNotary: true,
    billOfSaleMandatory: true,
    odometerIntegrated: true,
    specialNotes: 'Notarization required for vehicles over certain value.'
  },
  'NY': {
    requiresNotary: false,
    billOfSaleMandatory: true,
    odometerIntegrated: true,
    specialNotes: 'Bill of sale required for registration.'
  },
  'NC': {
    requiresNotary: true,
    billOfSaleMandatory: true,
    odometerIntegrated: true,
    specialNotes: 'Notarization required for all vehicle sales.'
  },
  'ND': {
    requiresNotary: true,
    officialForm: 'SFN-2888',
    billOfSaleMandatory: true,
    odometerIntegrated: true,
    specialNotes: 'Must use official SFN-2888 form. Notarization required.',
    localFormPath: '/forms/vehicle-bill-of-sale/north-dakota/SFN-2888.pdf'
  },
  'OH': {
    requiresNotary: true,
    billOfSaleMandatory: true,
    odometerIntegrated: true,
    specialNotes: 'Notarization required for all vehicle sales.'
  },
  'OK': {
    requiresNotary: true,
    billOfSaleMandatory: true,
    odometerIntegrated: true,
    specialNotes: 'Notarization required. Must include odometer disclosure.'
  },
  'OR': {
    requiresNotary: false,
    billOfSaleMandatory: true,
    odometerIntegrated: true,
    specialNotes: 'Bill of sale required for registration.'
  },
  'PA': {
    requiresNotary: true,
    billOfSaleMandatory: true,
    odometerIntegrated: true,
    specialNotes: 'Notarization required for vehicles over certain value.'
  },
  'RI': {
    requiresNotary: false,
    billOfSaleMandatory: true,
    odometerIntegrated: true,
    specialNotes: 'Bill of sale required for registration.'
  },
  'SC': {
    requiresNotary: true,
    billOfSaleMandatory: true,
    odometerIntegrated: true,
    specialNotes: 'Notarization required for all vehicle sales.'
  },
  'SD': {
    requiresNotary: false,
    officialForm: 'Online Form',
    billOfSaleMandatory: true,
    odometerIntegrated: true,
    specialNotes: 'Uses online form system. Bill of sale required for registration.'
  },
  'TN': {
    requiresNotary: true,
    billOfSaleMandatory: true,
    odometerIntegrated: true,
    specialNotes: 'Notarization required for all vehicle sales.'
  },
  'TX': {
    requiresNotary: false,
    billOfSaleMandatory: true,
    odometerIntegrated: true,
    specialNotes: 'Bill of sale required for registration. No notarization needed.'
  },
  'UT': {
    requiresNotary: true,
    billOfSaleMandatory: true,
    odometerIntegrated: true,
    specialNotes: 'Notarization required for vehicles over certain value.'
  },
  'VT': {
    requiresNotary: false,
    billOfSaleMandatory: true,
    odometerIntegrated: true,
    specialNotes: 'Bill of sale required for registration.'
  },
  'VA': {
    requiresNotary: true,
    billOfSaleMandatory: true,
    odometerIntegrated: true,
    specialNotes: 'Notarization required for all vehicle sales.'
  },
  'WA': {
    requiresNotary: false,
    billOfSaleMandatory: true,
    odometerIntegrated: true,
    specialNotes: 'Bill of sale required for registration.'
  },
  'WV': {
    requiresNotary: true,
    officialForm: 'DMV-7-TR',
    billOfSaleMandatory: true,
    odometerIntegrated: true,
    specialNotes: 'Must use official DMV-7-TR form. Notarization required.',
    localFormPath: '/forms/vehicle-bill-of-sale/west-virginia/DMV-7-TR.pdf'
  },
  'WI': {
    requiresNotary: false,
    billOfSaleMandatory: true,
    odometerIntegrated: true,
    specialNotes: 'Bill of sale required for registration.'
  },
  'WY': {
    requiresNotary: true,
    billOfSaleMandatory: true,
    odometerIntegrated: true,
    specialNotes: 'Notarization required for vehicles over certain value.'
  }
};