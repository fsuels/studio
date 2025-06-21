import type { LegalDocument } from '@/types/documents';
import { progressiveDisciplinePolicyMeta } from './metadata';
import { schema } from './schema';
import { questions } from './questions';

export const progressiveDisciplinePolicy: LegalDocument = {
  ...progressiveDisciplinePolicyMeta,
  schema,
  questions,
};
