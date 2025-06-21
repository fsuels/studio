// src/lib/documents/us/memorandum-of-agreement/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { MemorandumOfAgreementSchema } from './schema';
import { memorandumOfAgreementQuestions } from './questions';

export const memorandumOfAgreementMeta: LegalDocument = {
  id: 'memorandum-of-agreement',
  jurisdiction: 'US',
  category: 'Business',
  languageSupport: ['en', 'es'],
  requiresNotarization: true,
  canBeRecorded: false,
  offerNotarization: true,
  offerRecordingHelp: false,
  basePrice: 16.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/memorandum-of-agreement.md',
    es: '/templates/es/memorandum-of-agreement.md',
  },
  schema: MemorandumOfAgreementSchema,
  questions: memorandumOfAgreementQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Memorandum of Agreement (MOA)',
      description:
        'Create a formal MOA establishing binding obligations and agreements between parties.',
      aliases: ['MOA', 'memorandum of agreement', 'formal agreement'],
    },
    es: {
      name: 'Memorando de Acuerdo (MOA)',
      description:
        'Crea un MOA formal que establece obligaciones y acuerdos vinculantes entre partes.',
      aliases: ['MOA', 'memorando de acuerdo', 'acuerdo formal'],
    },
  },
};
