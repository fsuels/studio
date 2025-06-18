import type { LegalDocument } from '@/types/documents';
import { operatingAgreementMeta } from './metadata';
import { operatingAgreementQuestions } from './questions';
import { operatingAgreementSchema } from './schema';

export const llcOperatingAgreement: LegalDocument = {
  id: 'llc-operating-agreement',
  ...operatingAgreementMeta,
  schema: operatingAgreementSchema,
  questions: operatingAgreementQuestions,
};