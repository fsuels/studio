import type { LegalDocument } from '@/types/documents';
import { healthcarePowerOfAttorneyMeta } from './metadata';
import { schema } from './schema';
import { questions } from './questions';

export const healthcarePowerOfAttorney: LegalDocument = {
  ...healthcarePowerOfAttorneyMeta,
  schema,
  questions,
};
