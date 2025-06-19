import type { LegalDocument } from '@/types/documents';
import { employeeWarningNoticeMeta } from './metadata';
import { schema } from './schema';
import { questions } from './questions';

export const employeeWarningNotice: LegalDocument = {
  ...employeeWarningNoticeMeta,
  schema,
  questions,
};
