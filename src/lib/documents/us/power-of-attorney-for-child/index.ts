import type { LegalDocument } from '@/types/documents';
import { metadata } from './metadata';
import { schema } from './schema';
import { questions } from './questions';

export const powerOfAttorneyForChild: LegalDocument = {
  ...metadata,
  schema,
  questions,
};
