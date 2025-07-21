import type { LegalDocument } from '@/types/documents';
import { prenuptialAgreementMeta } from './metadata';
import { prenuptialAgreementQuestions } from './questions';
import { prenuptialAgreementSchema } from './schema';

export const prenuptialAgreement: LegalDocument = {
  id: 'prenuptial-agreement',
  ...prenuptialAgreementMeta,
  schema: prenuptialAgreementSchema,
  questions: prenuptialAgreementQuestions,
};
