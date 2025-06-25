// src/lib/documents/us/affidavit-general/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { AffidavitGeneralSchema } from './schema';
import { affidavitGeneralQuestions } from './questions';

export const affidavitGeneralMeta: LegalDocument = {
  id: 'affidavit-general',
  jurisdiction: 'US',
  category: 'Personal',
  languageSupport: ['en', 'es'],
  requiresNotarization: true,
  canBeRecorded: false,
  offerNotarization: true,
  offerRecordingHelp: false,
  basePrice: 5,
  states: 'all',
  templatePaths: {
    en: '/templates/en/us/affidavit-general.md',
    es: '/templates/es/us/affidavit-general.md',
  },
  schema: AffidavitGeneralSchema,
  questions: affidavitGeneralQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Affidavit (General)',
      description:
        'A sworn written statement confirmed by oath, often used as evidence.',
      aliases: [
        'sworn statement',
        'declaration',
        'official statement',
        'statement under oath',
      ],
    },
    es: {
      name: 'Declaración Jurada (General)',
      description:
        'Formato general de declaración jurada para varias situaciones legales. Documento flexible para testimonios y declaraciones de hechos.',
      aliases: [
        'declaración jurada',
        'declaración oficial',
        'declaración bajo juramento',
      ],
    },
  },
};
