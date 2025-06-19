import type { LegalDocument } from '@/types/documents';
import { businessPlanMeta } from './metadata';
import { businessPlanQuestions } from './questions';
import { businessPlanSchema } from './schema';

export const businessPlan: LegalDocument = {
  id: 'business-plan',
  ...businessPlanMeta,
  schema: businessPlanSchema,
  questions: businessPlanQuestions,
};