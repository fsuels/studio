import type { LegalDocument } from '@/types/documents';
import { limitedPartnershipAgreementMeta } from './metadata';
import { limitedPartnershipAgreementQuestions } from './questions';
import { limitedPartnershipAgreementSchema } from './schema';

export const limitedPartnershipAgreement: LegalDocument = {
  id: 'limited-partnership-agreement',
  ...limitedPartnershipAgreementMeta,
  schema: limitedPartnershipAgreementSchema,
  questions: limitedPartnershipAgreementQuestions,
};
