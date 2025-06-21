import type { LegalDocument } from '@/types/documents';
import { advanceDirectiveRevocationMeta } from './metadata';
import { schema } from './schema';
import { questions } from './questions';

export const advanceDirectiveRevocation: LegalDocument = {
  ...advanceDirectiveRevocationMeta,
  schema,
  questions,
};
