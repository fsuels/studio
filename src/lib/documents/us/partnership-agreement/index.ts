import type { LegalDocument } from '@/types/documents';
import { partnershipAgreementMetadata } from './metadata';
import { partnershipAgreementQuestions } from './questions';
import { partnershipAgreementSchema } from './schema';

export const partnershipAgreement: LegalDocument = {
  id: 'partnership-agreement',
  ...partnershipAgreementMetadata,
  schema: partnershipAgreementSchema,
  questions: partnershipAgreementQuestions,
};