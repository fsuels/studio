// src/lib/documents/us/notice-to-enter/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { NoticeToEnterSchema } from './schema';
import { noticeToEnterQuestions } from './questions';

export const noticeToEnterMeta: LegalDocument = {
  id: 'notice-to-enter',
  jurisdiction: 'US',
  category: 'Real Estate & Property',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 11.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/notice-to-enter.md',
    es: '/templates/es/notice-to-enter.md',
  },
  schema: NoticeToEnterSchema,
  questions: noticeToEnterQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Notice to Enter',
      description:
        'Landlord notice to enter rental property for inspections or repairs',
      aliases: [],
    },
    es: {
      name: 'Notice to Enter', // TODO: Add Spanish translation
      description:
        'Landlord notice to enter rental property for inspections or repairs', // TODO: Add Spanish translation
      aliases: [],
    },
  },
};
