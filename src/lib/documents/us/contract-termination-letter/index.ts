import type { LegalDocument } from '@/types/documents';
import { contractTerminationLetterMeta } from './metadata';
import { contractTerminationLetterQuestions } from './questions';
import { contractTerminationLetterSchema } from './schema';

export const contractTerminationLetter: LegalDocument = {
  id: 'contract-termination-letter',
  ...contractTerminationLetterMeta,
  schema: contractTerminationLetterSchema,
  questions: contractTerminationLetterQuestions,
};
