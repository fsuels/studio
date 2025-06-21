// src/lib/documents/us/employee-non-disclosure-agreement/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { schema } from './schema';
import { questions } from './questions';

export const employeeNonDisclosureAgreementMeta: LegalDocument = {
  id: 'employee-non-disclosure-agreement',
  jurisdiction: 'US',
  category: 'Legal',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 12,
  states: 'all',
  templatePaths: {
    en: '/templates/en/employee-non-disclosure-agreement.md',
    es: '/templates/es/employee-non-disclosure-agreement.md',
  },
  schema,
  questions: questions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Employee Non-Disclosure Agreement',
      description:
        'Employee-specific confidentiality and non-disclosure agreement',
      aliases: [],
    },
    es: {
      name: 'Employee Non-Disclosure Agreement',
      description:
        'Employee-specific confidentiality and non-disclosure agreement',
      aliases: [],
    },
  },
};
