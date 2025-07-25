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
      name: 'Articles of Incorporation (Business)',
      description:
        'Formal document filed with the state to create a corporation for business entities.',
      aliases: [
        'form corporation',
        'incorporate business',
        'business incorporation',
      ],
    },
    es: {
      name: 'Acta Constitutiva (Empresarial)',
      description:
        'Separa legalmente tu negocio de tus finanzas personales y reduce riesgos. Obten protección legal y credibilidad ante clientes e inversionistas.',
      aliases: [
        'formar corporación',
        'incorporar negocio',
        'incorporación empresarial',
      ],
    },
  },
};
