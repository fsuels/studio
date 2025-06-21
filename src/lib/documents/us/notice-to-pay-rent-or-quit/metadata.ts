// src/lib/documents/us/notice-to-pay-rent-or-quit/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { NoticeToPayRentOrQuitSchema } from './schema';
import { noticeToPayRentOrQuitQuestions } from './questions';

export const noticeToPayRentOrQuitMeta: LegalDocument = {
  id: 'notice-to-pay-rent-or-quit',
  jurisdiction: 'US',
  category: 'Real Estate & Property',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 19.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/notice-to-pay-rent-or-quit.md',
    es: '/templates/es/notice-to-pay-rent-or-quit.md',
  },
  schema: NoticeToPayRentOrQuitSchema,
  questions: noticeToPayRentOrQuitQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Notice to Pay Rent or Quit',
      description:
        'Legal notice for unpaid rent requiring payment or vacating premises',
      aliases: [],
    },
    es: {
      name: 'Notice to Pay Rent or Quit', // TODO: Add Spanish translation
      description:
        'Legal notice for unpaid rent requiring payment or vacating premises', // TODO: Add Spanish translation
      aliases: [],
    },
  },
};
