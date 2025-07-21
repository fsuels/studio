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
      description:
        'Protect your personal wealth from business liabilities and gain credibility with customers. Open doors to business financing and tax advantages.',
      aliases: [
        'business incorporation',
        'corporate charter',
        'incorporation documents',
        'company formation',
      ],
    },
    es: {
      name: 'Acta Constitutiva',
      description:
        'Protege tu patrimonio personal de demandas comerciales y obtén credibilidad empresarial. Abre puertas a financiamiento y beneficios fiscales.',
      aliases: [
        'incorporación de negocio',
        'estatutos corporativos',
        'documentos de incorporación',
      ],
    },
  },
};
