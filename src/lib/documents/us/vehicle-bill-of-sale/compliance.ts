// State-specific compliance rules for Vehicle Bill of Sale
export type StateAbbr = 
  | 'AL' | 'AK' | 'AZ' | 'AR' | 'CA' | 'CO' | 'CT' | 'DE' | 'FL' | 'GA'
  | 'HI' | 'ID' | 'IL' | 'IN' | 'IA' | 'KS' | 'KY' | 'LA' | 'ME' | 'MD'
  | 'MA' | 'MI' | 'MN' | 'MS' | 'MO' | 'MT' | 'NE' | 'NV' | 'NH' | 'NJ'
  | 'NM' | 'NY' | 'NC' | 'ND' | 'OH' | 'OK' | 'OR' | 'PA' | 'RI' | 'SC'
  | 'SD' | 'TN' | 'TX' | 'UT' | 'VT' | 'VA' | 'WA' | 'WV' | 'WI' | 'WY';

export interface VehicleBillOfSaleRule {
  schemaVersion: string;           // Version of this configuration schema (e.g., "1.0")
  formVersion?: string;            // Version of the official PDF form (e.g., "2024.1") 
  lastUpdated: string;             // ISO date when this config was last updated
  requiresNotary: boolean | "conditional";
  officialForm?: string;
  billOfSaleMandatory: boolean;
  odometerIntegrated: boolean;
  specialNotes?: string;
  localFormPath?: string;
}

export const vehicleBillOfSaleCompliance: Record<StateAbbr, VehicleBillOfSaleRule> = {
  'AL': {
    schemaVersion: '1.0',
    formVersion: '2024.1',
    lastUpdated: '2025-01-18',
    requiresNotary: true,
    officialForm: 'MVT 32-13B',
    billOfSaleMandatory: true,
    odometerIntegrated: true,
    specialNotes: 'Requires notarization for all vehicle sales. Official form must be used.',
    localFormPath: '/forms/vehicle-bill-of-sale/alabama/MVT-32-13B.pdf'
  },
  'AK': {
    schemaVersion: '1.0',
    lastUpdated: '2025-01-18',
    requiresNotary: false,
    billOfSaleMandatory: false,
    odometerIntegrated: false,
    specialNotes: 'Bill of sale is optional but recommended for registration.'
  },
  'AZ': {
    schemaVersion: '1.0',
    lastUpdated: '2025-01-18',
    requiresNotary: true,
    billOfSaleMandatory: true,
    odometerIntegrated: true,
    specialNotes: 'Notarization required. Must include odometer disclosure.'
  },
  'AR': {
    schemaVersion: '1.0',
    lastUpdated: '2025-01-18',
    requiresNotary: true,
    billOfSaleMandatory: true,
    odometerIntegrated: true,
    specialNotes: 'Notarization required for vehicles over 10 years old.'
  },
  'CA': {
    schemaVersion: '1.0',
    lastUpdated: '2025-01-18',
    requiresNotary: false,
    billOfSaleMandatory: true,
    odometerIntegrated: true,
    specialNotes: 'Bill of sale required for registration. No notarization needed.'
  },
  'CO': {
    schemaVersion: '1.0',
    formVersion: '2024.1',
    lastUpdated: '2025-01-18',
    requiresNotary: true,
    officialForm: 'DR 2116',
    billOfSaleMandatory: true,
    odometerIntegrated: true,
    specialNotes: 'Must use official Colorado form. Notarization required.',
    localFormPath: '/forms/vehicle-bill-of-sale/colorado/DR-2116.pdf'
  },
  'CT': {
    schemaVersion: '1.0',
    lastUpdated: '2025-01-18',
    requiresNotary: false,
    billOfSaleMandatory: true,
    odometerIntegrated: true,
    specialNotes: 'Bill of sale required for registration.'
  },
  'DE': {
    schemaVersion: '1.0',
    lastUpdated: '2025-01-18',
    requiresNotary: false,
    billOfSaleMandatory: false,
    odometerIntegrated: false,
    specialNotes: 'Bill of sale is optional.'
  },
  'FL': {
    schemaVersion: '1.0',
    formVersion: '2024.1',
    lastUpdated: '2025-01-18',
    requiresNotary: true,
    officialForm: 'HSMV 82050',
    billOfSaleMandatory: true,
    odometerIntegrated: true,
    specialNotes: 'Must use official HSMV 82050 form with notarization.',
    localFormPath: '/forms/vehicle-bill-of-sale/florida/HSMV-82050.pdf'
  },
  'GA': {
    schemaVersion: '1.0',
    formVersion: '2024.1',
    lastUpdated: '2025-01-18',
    requiresNotary: true,
    officialForm: 'T-7',
    billOfSaleMandatory: true,
    odometerIntegrated: true,
    specialNotes: 'Must use official T-7 form. Notarization required.',
    localFormPath: '/forms/vehicle-bill-of-sale/georgia/T-7.pdf'
  },
  'HI': {
    schemaVersion: '1.0',
    lastUpdated: '2025-01-18',
    requiresNotary: false,
    billOfSaleMandatory: true,
    odometerIntegrated: true,
    specialNotes: 'Bill of sale required for registration.'
  },
  'ID': {
    schemaVersion: '1.0',
    formVersion: '2024.1',
    lastUpdated: '2025-01-18',
    requiresNotary: true,
    officialForm: 'ITD 3738',
    billOfSaleMandatory: true,
    odometerIntegrated: true,
    specialNotes: 'Must use official ITD 3738 form with notarization.',
    localFormPath: '/forms/vehicle-bill-of-sale/idaho/ITD-3738.pdf'
  },
  'IL': {
    schemaVersion: '1.0',
    lastUpdated: '2025-01-18',
    requiresNotary: false,
    billOfSaleMandatory: true,
    odometerIntegrated: true,
    specialNotes: 'Bill of sale required for registration.'
  },
  'IN': {
    schemaVersion: '1.0',
    lastUpdated: '2025-01-18',
    requiresNotary: true,
    billOfSaleMandatory: true,
    odometerIntegrated: true,
    specialNotes: 'Notarization required for vehicles over certain value.'
  },
  'IA': {
    schemaVersion: '1.0',
    lastUpdated: '2025-01-18',
    requiresNotary: false,
    billOfSaleMandatory: false,
    odometerIntegrated: false,
    specialNotes: 'Bill of sale is optional.'
  },
  'KS': {
    schemaVersion: '1.0',
    formVersion: '2024.1',
    lastUpdated: '2025-01-18',
    requiresNotary: true,
    officialForm: 'TR-312',
    billOfSaleMandatory: true,
    odometerIntegrated: true,
    specialNotes: 'Must use official TR-312 form. Notarization required.',
    localFormPath: '/forms/vehicle-bill-of-sale/kansas/TR-312.pdf'
  },
  'KY': {
    schemaVersion: '1.0',
    lastUpdated: '2025-01-18',
    requiresNotary: true,
    billOfSaleMandatory: true,
    odometerIntegrated: true,
    specialNotes: 'Notarization required for all vehicle sales.'
  },
  'LA': {
    schemaVersion: '1.0',
    lastUpdated: '2025-01-18',
    requiresNotary: true,
    billOfSaleMandatory: true,
    odometerIntegrated: true,
    specialNotes: 'Notarization required. Must include odometer disclosure.'
  },
  'ME': {
    schemaVersion: '1.0',
    lastUpdated: '2025-01-18',
    requiresNotary: false,
    billOfSaleMandatory: true,
    odometerIntegrated: true,
    specialNotes: 'Bill of sale required for registration.'
  },
  'MD': {
    schemaVersion: '1.0',
    formVersion: '2024.1',
    lastUpdated: '2025-01-18',
    requiresNotary: true,
    officialForm: 'VR-181',
    billOfSaleMandatory: true,
    odometerIntegrated: true,
    specialNotes: 'Must use official VR-181 form with notarization.',
    localFormPath: '/forms/vehicle-bill-of-sale/maryland/VR-181.pdf'
  },
  'MA': {
    schemaVersion: '1.0',
    lastUpdated: '2025-01-18',
    requiresNotary: false,
    billOfSaleMandatory: true,
    odometerIntegrated: true,
    specialNotes: 'Bill of sale required for registration.'
  },
  'MI': {
    schemaVersion: '1.0',
    lastUpdated: '2025-01-18',
    requiresNotary: false,
    billOfSaleMandatory: true,
    odometerIntegrated: true,
    specialNotes: 'Bill of sale required for registration.'
  },
  'MN': {
    schemaVersion: '1.0',
    lastUpdated: '2025-01-18',
    requiresNotary: false,
    billOfSaleMandatory: true,
    odometerIntegrated: true,
    specialNotes: 'Bill of sale required for registration.'
  },
  'MS': {
    schemaVersion: '1.0',
    lastUpdated: '2025-01-18',
    requiresNotary: true,
    billOfSaleMandatory: true,
    odometerIntegrated: true,
    specialNotes: 'Notarization required for all vehicle sales.'
  },
  'MO': {
    schemaVersion: '1.0',
    lastUpdated: '2025-01-18',
    requiresNotary: true,
    billOfSaleMandatory: true,
    odometerIntegrated: true,
    specialNotes: 'Notarization required. Must include odometer disclosure.'
  },
  'MT': {
    schemaVersion: '1.0',
    formVersion: '2024.1',
    lastUpdated: '2025-01-18',
    requiresNotary: true,
    officialForm: 'MV-24',
    billOfSaleMandatory: true,
    odometerIntegrated: true,
    specialNotes: 'Must use official MV-24 form. Notarization required.',
    localFormPath: '/forms/vehicle-bill-of-sale/montana/MV-24.pdf'
  },
  'NE': {
    schemaVersion: '1.0',
    lastUpdated: '2025-01-18',
    requiresNotary: true,
    billOfSaleMandatory: true,
    odometerIntegrated: true,
    specialNotes: 'Notarization required for all vehicle sales.'
  },
  'NV': {
    schemaVersion: '1.0',
    lastUpdated: '2025-01-18',
    requiresNotary: true,
    billOfSaleMandatory: true,
    odometerIntegrated: true,
    specialNotes: 'Notarization required. Must include odometer disclosure.'
  },
  'NH': {
    schemaVersion: '1.0',
    lastUpdated: '2025-01-18',
    requiresNotary: false,
    billOfSaleMandatory: true,
    odometerIntegrated: true,
    specialNotes: 'Bill of sale required for registration.'
  },
  'NJ': {
    schemaVersion: '1.0',
    lastUpdated: '2025-01-18',
    requiresNotary: false,
    billOfSaleMandatory: true,
    odometerIntegrated: true,
    specialNotes: 'Bill of sale required for registration.'
  },
  'NM': {
    schemaVersion: '1.0',
    lastUpdated: '2025-01-18',
    requiresNotary: true,
    billOfSaleMandatory: true,
    odometerIntegrated: true,
    specialNotes: 'Notarization required for vehicles over certain value.'
  },
  'NY': {
    schemaVersion: '1.0',
    lastUpdated: '2025-01-18',
    requiresNotary: false,
    billOfSaleMandatory: true,
    odometerIntegrated: true,
    specialNotes: 'Bill of sale required for registration.'
  },
  'NC': {
    schemaVersion: '1.0',
    lastUpdated: '2025-01-18',
    requiresNotary: true,
    billOfSaleMandatory: true,
    odometerIntegrated: true,
    specialNotes: 'Notarization required for all vehicle sales.'
  },
  'ND': {
    schemaVersion: '1.0',
    formVersion: '2024.1',
    lastUpdated: '2025-01-18',
    requiresNotary: true,
    officialForm: 'SFN-2888',
    billOfSaleMandatory: true,
    odometerIntegrated: true,
    specialNotes: 'Must use official SFN-2888 form. Notarization required.',
    localFormPath: '/forms/vehicle-bill-of-sale/north-dakota/SFN-2888.pdf'
  },
  'OH': {
    schemaVersion: '1.0',
    lastUpdated: '2025-01-18',
    requiresNotary: true,
    billOfSaleMandatory: true,
    odometerIntegrated: true,
    specialNotes: 'Notarization required for all vehicle sales.'
  },
  'OK': {
    schemaVersion: '1.0',
    lastUpdated: '2025-01-18',
    requiresNotary: true,
    billOfSaleMandatory: true,
    odometerIntegrated: true,
    specialNotes: 'Notarization required. Must include odometer disclosure.'
  },
  'OR': {
    schemaVersion: '1.0',
    lastUpdated: '2025-01-18',
    requiresNotary: false,
    billOfSaleMandatory: true,
    odometerIntegrated: true,
    specialNotes: 'Bill of sale required for registration.'
  },
  'PA': {
    schemaVersion: '1.0',
    lastUpdated: '2025-01-18',
    requiresNotary: true,
    billOfSaleMandatory: true,
    odometerIntegrated: true,
    specialNotes: 'Notarization required for vehicles over certain value.'
  },
  'RI': {
    schemaVersion: '1.0',
    lastUpdated: '2025-01-18',
    requiresNotary: false,
    billOfSaleMandatory: true,
    odometerIntegrated: true,
    specialNotes: 'Bill of sale required for registration.'
  },
  'SC': {
    schemaVersion: '1.0',
    lastUpdated: '2025-01-18',
    requiresNotary: true,
    billOfSaleMandatory: true,
    odometerIntegrated: true,
    specialNotes: 'Notarization required for all vehicle sales.'
  },
  'SD': {
    schemaVersion: '1.0',
    lastUpdated: '2025-01-18',
    requiresNotary: false,
    officialForm: 'Online Form',
    billOfSaleMandatory: true,
    odometerIntegrated: true,
    specialNotes: 'Uses online form system. Bill of sale required for registration.'
  },
  'TN': {
    schemaVersion: '1.0',
    lastUpdated: '2025-01-18',
    requiresNotary: true,
    billOfSaleMandatory: true,
    odometerIntegrated: true,
    specialNotes: 'Notarization required for all vehicle sales.'
  },
  'TX': {
    schemaVersion: '1.0',
    lastUpdated: '2025-01-18',
    requiresNotary: false,
    billOfSaleMandatory: true,
    odometerIntegrated: true,
    specialNotes: 'Bill of sale required for registration. No notarization needed.'
  },
  'UT': {
    schemaVersion: '1.0',
    lastUpdated: '2025-01-18',
    requiresNotary: true,
    billOfSaleMandatory: true,
    odometerIntegrated: true,
    specialNotes: 'Notarization required for vehicles over certain value.'
  },
  'VT': {
    schemaVersion: '1.0',
    lastUpdated: '2025-01-18',
    requiresNotary: false,
    billOfSaleMandatory: true,
    odometerIntegrated: true,
    specialNotes: 'Bill of sale required for registration.'
  },
  'VA': {
    schemaVersion: '1.0',
    lastUpdated: '2025-01-18',
    requiresNotary: true,
    billOfSaleMandatory: true,
    odometerIntegrated: true,
    specialNotes: 'Notarization required for all vehicle sales.'
  },
  'WA': {
    schemaVersion: '1.0',
    lastUpdated: '2025-01-18',
    requiresNotary: false,
    billOfSaleMandatory: true,
    odometerIntegrated: true,
    specialNotes: 'Bill of sale required for registration.'
  },
  'WV': {
    schemaVersion: '1.0',
    formVersion: '2024.1',
    lastUpdated: '2025-01-18',
    requiresNotary: true,
    officialForm: 'DMV-7-TR',
    billOfSaleMandatory: true,
    odometerIntegrated: true,
    specialNotes: 'Must use official DMV-7-TR form. Notarization required.',
    localFormPath: '/forms/vehicle-bill-of-sale/west-virginia/DMV-7-TR.pdf'
  },
  'WI': {
    schemaVersion: '1.0',
    lastUpdated: '2025-01-18',
    requiresNotary: false,
    billOfSaleMandatory: true,
    odometerIntegrated: true,
    specialNotes: 'Bill of sale required for registration.'
  },
  'WY': {
    schemaVersion: '1.0',
    lastUpdated: '2025-01-18',
    requiresNotary: true,
    billOfSaleMandatory: true,
    odometerIntegrated: true,
    specialNotes: 'Notarization required for vehicles over certain value.'
  }
};