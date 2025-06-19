import type { LegalDocument } from '@/types/documents';
import { directDepositFormMeta } from './metadata';
import { schema } from './schema';
import { questions } from './questions';

export const directDepositForm: LegalDocument = {
  ...directDepositFormMeta,
  schema,
  questions,
};
