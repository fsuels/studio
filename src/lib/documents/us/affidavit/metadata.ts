import type { LegalDocument } from '@/types/documents';
import { affidavitSchema } from './schema';
import { affidavitQuestions } from './questions';

export const affidavitMeta: LegalDocument = {
  id: 'affidavit',
  jurisdiction: 'US',
  category: 'Personal',
  languageSupport: ['en', 'es'],
  requiresNotarization: true,
  canBeRecorded: false,
  offerNotarization: true,
  offerRecordingHelp: false,
  basePrice: 5.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/affidavit-general.md',
    es: '/templates/es/affidavit-general.md',
  },
  schema: affidavitSchema,
  questions: affidavitQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'General Affidavit',
      description: 'Create a legally binding general affidavit with our easy-to-use template. State-specific requirements included.',
      aliases: [
        'sworn statement',
        'sworn declaration',
        'statement under oath',
        'legal affidavit'
      ],
    },
    es: {
      name: 'Declaración Jurada General',
      description: 'Crea una declaración jurada general legalmente válida con nuestra plantilla fácil de usar. Incluye requisitos específicos del estado.',
      aliases: [
        'declaración jurada',
        'declaración bajo juramento',
        'afidávit legal'
      ],
    },
  },
};
