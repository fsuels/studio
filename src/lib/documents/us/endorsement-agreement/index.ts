import type { LegalDocument } from '@/types/documents';
import { endorsementAgreementMeta } from './metadata';
import { endorsementAgreementQuestions } from './questions';
import { endorsementAgreementSchema } from './schema';

export const endorsementAgreement: LegalDocument = {
  id: 'endorsement-agreement',
  ...endorsementAgreementMeta,
  schema: endorsementAgreementSchema,
  questions: endorsementAgreementQuestions,
};