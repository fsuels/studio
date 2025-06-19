// src/lib/documents/us/postnuptial-agreement/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { PostnuptialAgreementSchema } from './schema';
import { postnuptialAgreementQuestions } from './questions';

export const postnuptialAgreementMeta: LegalDocument = {
  id: 'postnuptial-agreement',
  jurisdiction: 'US',
  category: 'Family & Personal',
  languageSupport: ['en', 'es'],
  requiresNotarization: true,
  canBeRecorded: false,
  offerNotarization: true,
  offerRecordingHelp: false,
  basePrice: 39.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/postnuptial-agreement.md',
    es: '/templates/es/postnuptial-agreement.md',
  },
  schema: PostnuptialAgreementSchema,
  questions: postnuptialAgreementQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Postnuptial Agreement',
      description: 'Agreement between married spouses regarding property and financial matters.',
      aliases: ['post-marital agreement', 'marital property agreement'],
    },
    es: {
      name: 'Acuerdo Postnupcial',
      description: 'Acuerdo entre cónyuges casados sobre asuntos de propiedad y financieros.',
      aliases: ['acuerdo post-matrimonial', 'acuerdo de propiedad marital'],
    },
  },
};