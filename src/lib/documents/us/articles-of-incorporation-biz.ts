import { z } from 'zod';
import type { LegalDocument } from '@/types/documents';

export const articlesOfIncorporationBiz: LegalDocument = {
  id: 'articles-of-incorporation-biz',
  jurisdiction: 'US',
  category: 'Business',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: true,
  offerNotarization: false,
  offerRecordingHelp: true,
  basePrice: 5,
  states: 'all',
  templatePaths: {
    // Assuming a template might exist or will be added
    en: 'en/us/articles-of-incorporation-biz.md',
    es: 'es/us/articles-of-incorporation-biz.md',
  },
  translations: {
    en: {
      name: 'Articles of Incorporation',
      description:
        'Formal document filed with the state to create a corporation.',
      aliases: ['form corporation', 'incorporate business'],
    },
    es: {
      name: 'Acta Constitutiva',
      description:
        'Documento formal presentado al estado para crear una corporación.',
      aliases: ['formar corporación', 'incorporar negocio'],
    },
  },
  schema: z.object({}), // Placeholder - Add actual schema fields if defined
  questions: [], // Placeholder - Add actual questions with i18n keys if defined
};
