// src/lib/documents/us/articles-of-incorporation-biz/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { ArticlesOfIncorporationBizSchema } from './schema';
import { articlesOfIncorporationBizQuestions } from './questions';

export const articlesOfIncorporationBizMeta: LegalDocument = {
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
    en: '/templates/en/us/articles-of-incorporation-biz.md',
    es: '/templates/es/us/articles-of-incorporation-biz.md',
  },
  schema: ArticlesOfIncorporationBizSchema,
  questions: articlesOfIncorporationBizQuestions,
  upsellClauses: [],
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
};