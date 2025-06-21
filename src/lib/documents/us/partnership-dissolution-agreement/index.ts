import type { LegalDocument } from '@/types/documents';
import { partnershipDissolutionAgreementMeta } from './metadata';
import { partnershipDissolutionAgreementQuestions } from './questions';
import { partnershipDissolutionAgreementSchema } from './schema';

export const partnershipDissolutionAgreement: LegalDocument = {
  id: 'partnership-dissolution-agreement',
  ...partnershipDissolutionAgreementMeta,
  schema: partnershipDissolutionAgreementSchema,
  questions: partnershipDissolutionAgreementQuestions,
};
