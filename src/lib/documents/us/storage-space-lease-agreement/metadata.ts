// src/lib/documents/us/storage-space-lease-agreement/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { StorageSpaceLeaseAgreementSchema } from './schema';
import { storageSpaceLeaseAgreementQuestions } from './questions';

export const storageSpaceLeaseAgreementMeta: LegalDocument = {
  id: 'storage-space-lease-agreement',
  jurisdiction: 'US',
  category: 'Real Estate & Property',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 16.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/storage-space-lease-agreement.md',
    es: '/templates/es/storage-space-lease-agreement.md',
  },
  schema: StorageSpaceLeaseAgreementSchema,
  questions: storageSpaceLeaseAgreementQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Storage Space Lease Agreement',
      description:
        'Lease agreement for storage units and self-storage facilities',
      aliases: [],
    },
    es: {
      name: 'Contrato de arrendamiento de espacio de almacenamiento',
      description:
        'Contrato de arrendamiento para unidades de almacenamiento y bodegas de auto-servicio.',
      aliases: [],
    },
  },
};
