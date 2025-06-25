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
        'Attract investors and secure funding with a professional business plan. Present your vision convincingly to achieve business success.',
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
        'Aumenta tus posibilidades de obtener financiamiento y atrae inversionistas. Presenta tu visión de negocio de manera profesional y convincente.',
      aliases: [
        'estrategia comercial',
        'plan de inicio',
        'plan de empresa',
        'propuesta de negocio',
      ],
    },
  },
};
