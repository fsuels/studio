import type { LegalDocument } from '@/types/documents';
import { twoweeksnoticeletterMeta } from './metadata';
import { schema } from './schema';
import { questions } from './questions';

export const twoweeksnoticeletter: LegalDocument = {
  ...twoweeksnoticeletterMeta,
  schema,
  questions,
};
