// src/lib/documents/us/late-rent-notice/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { LateRentNoticeSchema } from './schema';
import { lateRentNoticeQuestions } from './questions';

export const lateRentNoticeMeta: LegalDocument = {
  id: 'late-rent-notice',
  jurisdiction: 'US',
  category: 'Real Estate & Property',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 12.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/late-rent-notice.md',
    es: '/templates/es/late-rent-notice.md',
  },
  schema: LateRentNoticeSchema,
  questions: lateRentNoticeQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Late Rent Notice',
      description: 'Official notice to tenants for overdue rent payments',
      aliases: [],
    },
    es: {
      name: 'Late Rent Notice', // TODO: Add Spanish translation
      description: 'Official notice to tenants for overdue rent payments', // TODO: Add Spanish translation
      aliases: [],
    },
  },
};