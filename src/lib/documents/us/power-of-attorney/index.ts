import type { LegalDocument } from '@/types/documents';
import { powerOfAttorneyMeta } from './metadata';
import { powerOfAttorneyQuestions } from './questions';
import { powerOfAttorneySchema } from './schema';

export const powerOfAttorney: LegalDocument = {
  ...powerOfAttorneyMeta,
  schema: powerOfAttorneySchema,
  questions: powerOfAttorneyQuestions,
};
