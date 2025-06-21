// src/lib/documents/us/bar-agreement/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { BarAgreementSchema } from './schema';
import { barAgreementQuestions } from './questions';

export const barAgreementMeta: LegalDocument = {
  id: 'bar-agreement',
  jurisdiction: 'US',
  category: 'Food & Hospitality',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 17.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/bar-agreement.md',
    es: '/templates/es/bar-agreement.md',
  },
  schema: BarAgreementSchema,
  questions: barAgreementQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Bar Agreement',
      description: 'Agreement for bar operations, partnerships, or management.',
      aliases: ['bar partnership', 'tavern agreement', 'pub agreement'],
    },
    es: {
      name: 'Acuerdo de Bar',
      description: 'Acuerdo para operaciones, asociaciones o gestión de bares.',
      aliases: ['sociedad de bar', 'acuerdo de taberna'],
    },
  },
};
