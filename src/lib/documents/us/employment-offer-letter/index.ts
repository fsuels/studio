import type { LegalDocument } from '@/types/documents';
import { employmentOfferLetterMeta } from './metadata';
import { schema } from './schema';
import { questions } from './questions';

export const employmentOfferLetter: LegalDocument = {
  ...employmentOfferLetterMeta,
  schema,
  questions,
};
