import type { LegalDocument } from '@/types/documents';
import { shareholderAgreementMeta } from './metadata';
import { shareholderAgreementQuestions } from './questions';
import { shareholderAgreementSchema } from './schema';

export const shareholderAgreement: LegalDocument = {
  id: 'shareholder-agreement',
  ...shareholderAgreementMeta,
  schema: shareholderAgreementSchema,
  questions: shareholderAgreementQuestions,
};
