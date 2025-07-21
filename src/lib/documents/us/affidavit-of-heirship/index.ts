import type { LegalDocument } from '@/types/documents';
import { affidavitOfHeirshipMeta } from './metadata';
import { schema } from './schema';
import { questions } from './questions';

export const affidavitOfHeirship: LegalDocument = {
  ...affidavitOfHeirshipMeta,
  schema,
  questions,
};
