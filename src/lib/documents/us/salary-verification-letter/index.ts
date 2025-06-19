import type { LegalDocument } from '@/types/documents';
import { salaryVerificationLetterMeta } from './metadata';
import { schema } from './schema';
import { questions } from './questions';

export const salaryVerificationLetter: LegalDocument = {
  ...salaryVerificationLetterMeta,
  schema,
  questions,
};
