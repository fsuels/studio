// src/lib/documents/us/employee-warning-notice/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { schema } from './schema';
import { questions } from './questions';

export const employeeWarningNoticeMeta: LegalDocument = {
  id: 'employee-warning-notice',
  jurisdiction: 'US',
  category: 'HR',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 8,
  states: 'all',
  templatePaths: {
    en: '/templates/en/employee-warning-notice.md',
    es: '/templates/es/employee-warning-notice.md',
  },
  schema,
  questions: questions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Employee Warning Notice',
      description: 'Formal disciplinary warning notice for employee misconduct',
      aliases: [],
    },
    es: {
      name: 'Employee Warning Notice',
      description: 'Formal disciplinary warning notice for employee misconduct',
      aliases: [],
    },
  },
};
