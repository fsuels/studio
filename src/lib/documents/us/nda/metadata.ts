// src/lib/documents/us/nda/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { NDASchema } from './schema';
import { ndaQuestions } from './questions';

export const ndaMeta: LegalDocument = {
  id: 'nda',
  jurisdiction: 'US',
  category: 'Business',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 5,
  states: 'all',
  templatePaths: {
    en: '/templates/en/non-disclosure-agreement.md',
    es: '/templates/es/non-disclosure-agreement.md',
  },
  schema: NDASchema,
  questions: ndaQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Non-Disclosure Agreement (NDA)',
      description: 'Protect confidential information shared between parties.',
      aliases: ['confidential', 'nda', 'protect idea', 'secret'],
    },
    es: {
      name: 'Acuerdo de Confidencialidad (NDA)',
      description: 'Protege tus ideas de negocio y secretos comerciales. Evita que empleados, socios o contratistas compartan tu información confidencial con competidores.',
      aliases: ['confidencial', 'nda', 'proteger idea', 'secreto'],
    },
  },
};
