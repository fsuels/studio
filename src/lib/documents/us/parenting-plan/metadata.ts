// src/lib/documents/us/parenting-plan/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { ParentingPlanSchema } from './schema';
import { parentingPlanQuestions } from './questions';

export const parentingPlanMeta: LegalDocument = {
  id: 'parenting-plan',
  jurisdiction: 'US',
  category: 'Family & Personal',
  languageSupport: ['en', 'es'],
  requiresNotarization: true,
  canBeRecorded: false,
  offerNotarization: true,
  offerRecordingHelp: false,
  basePrice: 39.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/parenting-plan.md',
    es: '/templates/es/parenting-plan.md',
  },
  schema: ParentingPlanSchema,
  questions: parentingPlanQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Parenting Plan',
      description:
        'Put your children first with a detailed plan that ensures their well-being through custody and visitation schedules.',
      aliases: [
        'custody agreement',
        'visitation schedule',
        'co-parenting plan',
      ],
    },
    es: {
      name: 'Plan de Crianza',
      description:
        'Plan integral para custodia infantil, visitación y responsabilidades parentales.',
      aliases: [
        'acuerdo de custodia',
        'horario de visitación',
        'plan de co-crianza',
      ],
    },
  },
};
