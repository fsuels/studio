// src/lib/documents/us/business-plan/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { businessPlanSchema } from './schema';
import { businessPlanQuestions } from './questions';

export const businessPlanMeta: Omit<LegalDocument, 'schema' | 'questions'> = {
  id: 'business-plan',
  jurisdiction: 'US',
  category: 'Business',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 35,
  states: 'all',
  templatePaths: {
    en: '/templates/en/business-plan.md',
    es: '/templates/es/business-plan.md',
  },
  upsellClauses: [],
  translations: {
    en: {
      name: 'Business Plan',
      description:
        'Comprehensive business plan template for startups and established businesses.',
      aliases: [
        'business strategy',
        'startup plan',
        'company plan',
        'business proposal',
      ],
    },
    es: {
      name: 'Plan de Negocios',
      description:
        'Plantilla integral de plan de negocios para empresas nuevas y establecidas.',
      aliases: [
        'estrategia comercial',
        'plan de inicio',
        'plan de empresa',
        'propuesta de negocio',
      ],
    },
  },
};
