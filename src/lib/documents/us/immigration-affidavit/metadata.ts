// src/lib/documents/us/immigration-affidavit/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { ImmigrationAffidavitSchema } from './schema';
import { immigrationAffidavitQuestions } from './questions';

export const immigrationAffidavitMeta: LegalDocument = {
  id: 'immigration-affidavit',
  jurisdiction: 'US',
  category: 'Government & Legal Services',
  languageSupport: ['en', 'es'],
  requiresNotarization: true,
  canBeRecorded: false,
  offerNotarization: true,
  offerRecordingHelp: false,
  basePrice: 9.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/immigration-affidavit.md',
    es: '/templates/es/immigration-affidavit.md',
  },
  schema: ImmigrationAffidavitSchema,
  questions: immigrationAffidavitQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Immigration Affidavit',
      description:
        'Support your immigration case with a professional sworn statement that strengthens your application.',
      aliases: [
        'affidavit of support',
        'immigration statement',
        'sworn immigration declaration',
      ],
    },
    es: {
      name: 'Declaración Jurada de Inmigración',
      description:
        'Declaración jurada para procedimientos y aplicaciones de inmigración.',
      aliases: [
        'declaración de apoyo',
        'declaración de inmigración',
        'declaración de inmigración jurada',
      ],
    },
  },
};
