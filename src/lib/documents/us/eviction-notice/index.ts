import type { LegalDocument } from '@/types/documents';
import { evictionNoticeMeta } from './metadata';
import { schema } from './schema';
import { questions } from './questions';

export const evictionNotice: LegalDocument = {
  ...evictionNoticeMeta,
  schema,
  questions,
};