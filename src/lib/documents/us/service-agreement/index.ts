import type { LegalDocument } from '@/types/documents';
import { serviceAgreementMeta } from './metadata';
import { serviceAgreementQuestions } from './questions';
import { serviceAgreementSchema } from './schema';

export const serviceAgreement: LegalDocument = {
  id: 'service-agreement',
  ...serviceAgreementMeta,
  schema: serviceAgreementSchema,
  questions: serviceAgreementQuestions,
};
