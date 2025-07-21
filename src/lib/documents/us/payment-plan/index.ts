import type { LegalDocument } from '@/types/documents';
import { paymentPlanMeta } from './metadata';
import { paymentPlanQuestions } from './questions';
import { paymentPlanSchema } from './schema';

export const paymentPlan: LegalDocument = {
  id: 'payment-plan',
  ...paymentPlanMeta,
  schema: paymentPlanSchema,
  questions: paymentPlanQuestions,
};
