import type { LegalDocument } from '@/types/documents';
import { serviceAgreementMetadata } from './metadata';
import { serviceAgreementQuestions } from './questions';
import { serviceAgreementSchema } from './schema';

export const serviceAgreement: LegalDocument = {
  id: 'service-agreement',
  ...serviceAgreementMetadata,
  schema: serviceAgreementSchema,
  questions: serviceAgreementQuestions,
};