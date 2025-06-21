// src/lib/documents/us/operating-agreement/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { operatingAgreementSchema } from './schema';
import { operatingAgreementQuestions } from './questions';

export const operatingAgreementMeta: LegalDocument = {
  id: 'llc-operating-agreement',
  jurisdiction: 'US',
  category: 'Business',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 20,
  states: 'all',
  templatePaths: {
    en: '/templates/en/llc-operating-agreement.md',
    es: '/templates/es/llc-operating-agreement.md',
  },
  schema: operatingAgreementSchema,
  questions: operatingAgreementQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Operating Agreement (LLC)',
      description:
        'Outline the ownership structure and operating procedures for an LLC.',
      aliases: ['LLC agreement', 'limited liability company'],
    },
    es: {
      name: 'Acuerdo Operativo (LLC)',
      description:
        'Esbozar la estructura de propiedad y los procedimientos operativos para una LLC.',
      aliases: ['acuerdo de LLC', 'sociedad de responsabilidad limitada'],
    },
  },
};
