import type { LegalDocument } from '@/types/documents';
import { advanceDirectiveMeta } from './metadata';
import { schema } from './schema';
import { questions } from './questions';

export const advanceDirective: LegalDocument = {
  ...advanceDirectiveMeta,
  schema,
  questions,
};
