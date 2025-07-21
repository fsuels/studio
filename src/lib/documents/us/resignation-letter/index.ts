import type { LegalDocument } from '@/types/documents';
import { resignationLetterMeta } from './metadata';
import { schema } from './schema';
import { questions } from './questions';

export const resignationLetter: LegalDocument = {
  ...resignationLetterMeta,
  schema,
  questions,
};
