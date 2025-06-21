// src/lib/documents/us/hunting-lease-agreement/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { HuntingLeaseAgreementSchema } from './schema';
import { huntingLeaseAgreementQuestions } from './questions';

export const huntingLeaseAgreementMeta: LegalDocument = {
  id: 'hunting-lease-agreement',
  jurisdiction: 'US',
  category: 'Real Estate & Property',
  languageSupport: ['en', 'es'],
  requiresNotarization: true,
  canBeRecorded: false,
  offerNotarization: true,
  offerRecordingHelp: false,
  basePrice: 29.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/hunting-lease-agreement.md',
    es: '/templates/es/hunting-lease-agreement.md',
  },
  schema: HuntingLeaseAgreementSchema,
  questions: huntingLeaseAgreementQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Hunting Lease Agreement',
      description: 'Agreement for leasing hunting rights on private property.',
      aliases: ['hunting rights lease', 'recreational lease', 'game lease'],
    },
    es: {
      name: 'Acuerdo de Arrendamiento de Caza',
      description:
        'Acuerdo para arrendar derechos de caza en propiedad privada.',
      aliases: [
        'arrendamiento de derechos de caza',
        'arrendamiento recreativo',
      ],
    },
  },
};
