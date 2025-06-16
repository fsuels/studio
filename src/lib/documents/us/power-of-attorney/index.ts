import type { LegalDocument } from '@/types/documents';
import { powerOfAttorneyMetadata } from './metadata';
import { powerOfAttorneyQuestions } from './questions';
import { powerOfAttorneySchema } from './schema';

export const powerOfAttorney: LegalDocument = {
  id: 'powerOfAttorney',
  ...powerOfAttorneyMetadata,
  schema: powerOfAttorneySchema,
  questions: powerOfAttorneyQuestions,
};