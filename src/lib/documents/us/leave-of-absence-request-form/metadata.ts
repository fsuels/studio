// src/lib/documents/us/leave-of-absence-request-form/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { schema } from './schema';
import { questions } from './questions';

export const leaveOfAbsenceRequestFormMeta: LegalDocument = {
  id: 'leave-of-absence-request-form',
  jurisdiction: 'US',
  category: 'HR',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 6,
  states: 'all',
  templatePaths: {
    en: '/templates/en/leave-of-absence-request-form.md',
    es: '/templates/es/leave-of-absence-request-form.md',
  },
  schema,
  questions: questions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Leave of Absence Request Form',
      description: 'Formal request form for employee leave of absence',
      aliases: [],
    },
    es: {
      name: 'Leave of Absence Request Form',
      description: 'Formal request form for employee leave of absence',
      aliases: [],
    },
  },
};
