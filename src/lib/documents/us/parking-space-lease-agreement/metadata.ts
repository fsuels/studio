// src/lib/documents/us/parking-space-lease-agreement/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { ParkingSpaceLeaseAgreementSchema } from './schema';
import { parkingSpaceLeaseAgreementQuestions } from './questions';

export const parkingSpaceLeaseAgreementMeta: LegalDocument = {
  id: 'parking-space-lease-agreement',
  jurisdiction: 'US',
  category: 'Real Estate & Property',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 12.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/parking-space-lease-agreement.md',
    es: '/templates/es/parking-space-lease-agreement.md',
  },
  schema: ParkingSpaceLeaseAgreementSchema,
  questions: parkingSpaceLeaseAgreementQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Parking Space Lease Agreement',
      description: 'Lease agreement for parking spaces and garages',
      aliases: [],
    },
    es: {
      name: 'Contrato de arrendamiento de estacionamiento',
      description: 'Contrato de arrendamiento para espacios de estacionamiento y garajes.',
      aliases: [],
    },
  },
};
