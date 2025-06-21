// src/lib/documents/us/simple-will/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { SimpleWillSchema } from './schema';
import { simpleWillQuestions } from './questions';

export const simpleWillMeta: LegalDocument = {
  id: 'simple-will',
  jurisdiction: 'US',
  category: 'Estate Planning',
  languageSupport: ['en', 'es'],
  requiresNotarization: true,
  canBeRecorded: false,
  offerNotarization: true,
  offerRecordingHelp: false,
  basePrice: 19.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/simple-will.md',
    es: '/templates/es/simple-will.md',
  },
  schema: SimpleWillSchema,
  questions: simpleWillQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Simple Will',
      description:
        'Create a basic last will and testament for straightforward estate planning with our easy-to-use template.',
      aliases: ['basic will', 'last will', 'testament', 'simple last will'],
    },
    es: {
      name: 'Testamento Simple',
      description:
        'Crea un testamento básico para planificación patrimonial sencilla con nuestra plantilla fácil de usar.',
      aliases: ['testamento básico', 'última voluntad', 'testamento sencillo'],
    },
  },
};
