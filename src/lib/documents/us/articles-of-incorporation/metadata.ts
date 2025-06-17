import type { LegalDocument } from '@/types/documents';
import { articlesOfIncorporationSchema } from './schema';
import { articlesOfIncorporationQuestions } from './questions';

export const articlesOfIncorporationMeta: LegalDocument = {
  id: 'articles-of-incorporation',
  jurisdiction: 'US',
  category: 'Business',
  languageSupport: ['en', 'es'],
  requiresNotarization: true,
  canBeRecorded: true,
  offerNotarization: true,
  offerRecordingHelp: true,
  basePrice: 24.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/articles-of-incorporation.md',
    es: '/templates/es/articles-of-incorporation.md',
  },
  schema: articlesOfIncorporationSchema,
  questions: articlesOfIncorporationQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Articles of Incorporation',
      description: 'Create legally binding articles of incorporation with our easy-to-use template. State-specific requirements included.',
      aliases: [
        'business incorporation',
        'corporate charter',
        'incorporation documents',
        'company formation'
      ],
    },
    es: {
      name: 'Acta Constitutiva',
      description: 'Crea un acta constitutiva legalmente válida con nuestra plantilla fácil de usar. Incluye requisitos específicos del estado.',
      aliases: [
        'incorporación de negocio',
        'estatutos corporativos',
        'documentos de incorporación'
      ],
    },
  },
};
