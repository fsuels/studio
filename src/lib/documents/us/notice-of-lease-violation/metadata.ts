// src/lib/documents/us/notice-of-lease-violation/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { NoticeOfLeaseViolationSchema } from './schema';
import { noticeOfLeaseViolationQuestions } from './questions';

export const noticeOfLeaseViolationMeta: LegalDocument = {
  id: 'notice-of-lease-violation',
  jurisdiction: 'US',
  category: 'Real Estate & Property',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 14.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/notice-of-lease-violation.md',
    es: '/templates/es/notice-of-lease-violation.md',
  },
  schema: NoticeOfLeaseViolationSchema,
  questions: noticeOfLeaseViolationQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Notice of Lease Violation',
      description: 'Official notice to tenants for lease agreement violations',
      aliases: [],
    },
    es: {
      name: 'Notice of Lease Violation', // TODO: Add Spanish translation
      description: 'Official notice to tenants for lease agreement violations', // TODO: Add Spanish translation
      aliases: [],
    },
  },
};
