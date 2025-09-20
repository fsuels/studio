// src/lib/documents/us/retirement-plan-agreement/metadata.ts
import type { LegalDocument } from '@/types/documents';
import { RetirementPlanAgreementSchema } from './schema';
import { retirementPlanAgreementQuestions } from './questions';

export const retirementPlanAgreementMeta: LegalDocument = {
  id: 'retirement-plan-agreement',
  jurisdiction: 'US',
  category: 'Finance & Lending',
  languageSupport: ['en', 'es'],
  requiresNotarization: false,
  canBeRecorded: false,
  offerNotarization: false,
  offerRecordingHelp: false,
  basePrice: 24.95,
  states: 'all',
  templatePaths: {
    en: '/templates/en/retirement-plan-agreement.md',
    es: '/templates/es/retirement-plan-agreement.md',
  },
  schema: RetirementPlanAgreementSchema,
  questions: retirementPlanAgreementQuestions,
  upsellClauses: [],
  translations: {
    en: {
      name: 'Retirement Plan Agreement',
      description:
        'Agreement for employer-sponsored retirement plan participation.',
      aliases: [
        '401k agreement',
        'pension plan agreement',
        'retirement benefit plan',
      ],
    },
    es: {
      name: 'Acuerdo de Plan de Jubilación',
      description:
        'Acuerdo para participación en plan de jubilación patrocinado por empleador.',
      aliases: [
        'plan de pensiones',
        'acuerdo de beneficios',
        'plan de beneficios de jubilación',
      ],
    },
  },
};
