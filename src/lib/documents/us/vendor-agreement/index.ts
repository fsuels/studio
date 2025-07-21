import type { LegalDocument } from '@/types/documents';
import { vendorAgreementMeta } from './metadata';
import { vendorAgreementQuestions } from './questions';
import { vendorAgreementSchema } from './schema';

export const vendorAgreement: LegalDocument = {
  id: 'vendor-agreement',
  ...vendorAgreementMeta,
  schema: vendorAgreementSchema,
  questions: vendorAgreementQuestions,
};
