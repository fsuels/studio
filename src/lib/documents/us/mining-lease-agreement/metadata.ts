// src/lib/documents/us/mining-lease-agreement/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { MiningLeaseAgreementSchema } from './schema';
import { miningLeaseAgreementQuestions } from './questions';

export const miningLeaseAgreementMeta: LegalDocument = {
  id: 'mining-lease-agreement',
  jurisdiction: 'US',
  category: 'Real Estate & Property',
  languageSupport: ['en', 'es'],
  requiresNotarization: true,
  canBeRecorded: true,
  offerNotarization: true,
  offerRecordingHelp: true,
  basePrice: 49.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/mining-lease-agreement.md',
    es: '/templates/es/mining-lease-agreement.md',
  },
  schema: MiningLeaseAgreementSchema,
  questions: miningLeaseAgreementQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Mining Lease Agreement',
      description:
        'Agreement for leasing land or mineral rights for mining operations.',
      aliases: ['mineral lease', 'mining rights agreement', 'extraction lease'],
    },
    es: {
      name: 'Acuerdo de Arrendamiento Minero',
      description:
        'Acuerdo para arrendar tierras o derechos minerales para operaciones mineras.',
      aliases: ['arrendamiento mineral', 'acuerdo de derechos mineros'],
    },
  },
};
