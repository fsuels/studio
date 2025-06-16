import type { LegalDocument } from '@/types/documents';
import { prenuptialAgreementMetadata } from './metadata';
import { prenuptialAgreementQuestions } from './questions';
import { prenuptialAgreementSchema } from './schema';

export const prenuptialAgreement: LegalDocument = {
  id: 'prenuptial-agreement',
  ...prenuptialAgreementMetadata,
  schema: prenuptialAgreementSchema,
  questions: prenuptialAgreementQuestions,
};