import type { LegalDocument } from '@/types/documents';
import { operatingAgreementMeta } from './metadata';
import { operatingAgreementQuestions } from './questions';
import { operatingAgreementSchema } from './schema';

export const operatingAgreement: LegalDocument = {
  id: 'operating-agreement',
  ...operatingAgreementMeta,
  schema: operatingAgreementSchema,
  questions: operatingAgreementQuestions,
};