import type { LegalDocument } from '@/types/documents';
import { affidavitOfDeathMeta } from './metadata';
import { schema } from './schema';
import { questions } from './questions';

export const affidavitOfDeath: LegalDocument = {
  ...affidavitOfDeathMeta,
  schema,
  questions,
};
