import type { LegalDocument } from '@/types/documents';
import { marketingAgreementMeta } from './metadata';
import { marketingAgreementQuestions } from './questions';
import { marketingAgreementSchema } from './schema';

export const marketingAgreement: LegalDocument = {
  id: 'marketing-agreement',
  ...marketingAgreementMeta,
  schema: marketingAgreementSchema,
  questions: marketingAgreementQuestions,
};
