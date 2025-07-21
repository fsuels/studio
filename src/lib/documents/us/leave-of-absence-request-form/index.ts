import type { LegalDocument } from '@/types/documents';
import { leaveOfAbsenceRequestFormMeta } from './metadata';
import { schema } from './schema';
import { questions } from './questions';

export const leaveOfAbsenceRequestForm: LegalDocument = {
  ...leaveOfAbsenceRequestFormMeta,
  schema,
  questions,
};
