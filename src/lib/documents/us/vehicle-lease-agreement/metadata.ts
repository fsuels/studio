// src/lib/documents/us/vehicle-lease-agreement/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { VehicleLeaseAgreementSchema } from './schema';
import { vehicleLeaseAgreementQuestions } from './questions';

export const vehicleLeaseAgreementMeta: LegalDocument = {
  id: 'vehicle-lease-agreement',
  jurisdiction: 'US',
  category: 'Transportation & Automotive',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 14.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/vehicle-lease-agreement.md',
    es: '/templates/es/vehicle-lease-agreement.md',
  },
  schema: VehicleLeaseAgreementSchema,
  questions: vehicleLeaseAgreementQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Vehicle Lease Agreement',
      description: 'Agreement for leasing vehicles between lessor and lessee.',
      aliases: [
        'car lease agreement',
        'auto lease contract',
        'vehicle rental agreement',
      ],
    },
    es: {
      name: 'Acuerdo de Arrendamiento de Vehículo',
      description:
        'Acuerdo para arrendamiento de vehículos entre arrendador y arrendatario.',
      aliases: [
        'contrato de arrendamiento de auto',
        'acuerdo de alquiler de vehículo',
      ],
    },
  },
};
