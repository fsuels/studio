// src/lib/documents/us/notice-to-proceed/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { noticetoproceedSchema } from './schema';
import { noticetoproceedQuestions } from './questions';

export const noticetoproceedMeta: LegalDocument = {
  id: 'notice-to-proceed',
  jurisdiction: 'US',
  category: 'Construction',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 19.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/notice-to-proceed.md',
    es: '/templates/es/notice-to-proceed.md',
  },
  schema: noticetoproceedSchema,
  questions: noticetoproceedQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Notice to Proceed',
      description:
        'Official authorization for contractor to begin construction work on a project.',
      aliases: [
        'commencement notice',
        'start work authorization',
        'proceed order',
      ],
    },
    es: {
      name: 'Aviso para Proceder',
      description:
        'Autorización oficial para que el contratista comience el trabajo de construcción en un proyecto.',
      aliases: [
        'aviso de inicio',
        'autorización de trabajo',
        'orden de proceder',
      ],
    },
  },
};
