import type { LegalDocument } from '@/types/documents';
import { metadata } from './metadata';
import { schema } from './schema';
import { questions } from './questions';

export const jointLivingTrust: LegalDocument = {
  ...metadata,
  schema,
  questions,
};
