import type { LegalDocument } from '@/types/documents';
import { employmentTerminationLetterMeta } from './metadata';
import { schema } from './schema';
import { questions } from './questions';

export const employmentTerminationLetter: LegalDocument = {
  ...employmentTerminationLetterMeta,  
  schema,
  questions,
};