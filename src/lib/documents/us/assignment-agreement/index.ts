import type { LegalDocument } from '@/types/documents';
import { assignmentAgreementMeta } from './metadata';
import { assignmentAgreementQuestions } from './questions';
import { assignmentAgreementSchema } from './schema';

export const assignmentAgreement: LegalDocument = {
  id: 'assignment-agreement',
  ...assignmentAgreementMeta,
  schema: assignmentAgreementSchema,
  questions: assignmentAgreementQuestions,
};