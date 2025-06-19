import type { LegalDocument } from '@/types/documents';
import { jointVentureAgreementMeta } from './metadata';
import { jointVentureAgreementQuestions } from './questions';
import { jointVentureAgreementSchema } from './schema';

export const jointVentureAgreement: LegalDocument = {
  id: 'joint-venture-agreement',
  ...jointVentureAgreementMeta,
  schema: jointVentureAgreementSchema,
  questions: jointVentureAgreementQuestions,
};