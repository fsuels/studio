import type { LegalDocument } from '@/types/documents';
import { webDevelopmentAgreementMeta } from './metadata';
import { webDevelopmentAgreementQuestions } from './questions';
import { webDevelopmentAgreementSchema } from './schema';

export const webDevelopmentAgreement: LegalDocument = {
  id: 'web-development-agreement',
  ...webDevelopmentAgreementMeta,
  schema: webDevelopmentAgreementSchema,
  questions: webDevelopmentAgreementQuestions,
};