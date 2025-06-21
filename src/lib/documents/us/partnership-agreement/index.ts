import type { LegalDocument } from '@/types/documents';
import { partnershipAgreementMeta } from './metadata';
import { partnershipAgreementQuestions } from './questions';
import { partnershipAgreementSchema } from './schema';

export const partnershipAgreement: LegalDocument = {
  id: 'partnership-agreement',
  ...partnershipAgreementMeta,
  schema: partnershipAgreementSchema,
  questions: partnershipAgreementQuestions,
};
