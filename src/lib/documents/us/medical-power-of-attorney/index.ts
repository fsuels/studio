import type { LegalDocument } from '@/types/documents';
import { metadata } from './metadata';
import { schema } from './schema';
import { questions } from './questions';

export const medicalPowerOfAttorney: LegalDocument = {
  ...metadata,
  schema,
  questions,
};
