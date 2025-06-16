import type { LegalDocument } from '@/types/documents';
import { operatingAgreementMetadata } from './metadata';
import { operatingAgreementQuestions } from './questions';
import { operatingAgreementSchema } from './schema';

export const operatingAgreement: LegalDocument = {
  id: 'operating-agreement',
  ...operatingAgreementMetadata,
  schema: operatingAgreementSchema,
  questions: operatingAgreementQuestions,
};