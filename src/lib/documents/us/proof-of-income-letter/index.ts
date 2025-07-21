import type { LegalDocument } from '@/types/documents';
import { proofOfIncomeLetterMeta } from './metadata';
import { schema } from './schema';
import { questions } from './questions';

export const proofOfIncomeLetter: LegalDocument = {
  ...proofOfIncomeLetterMeta,
  schema,
  questions,
};
