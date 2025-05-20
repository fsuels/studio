import type { LegalDocument } from '@/types/documents';
import { FirstSecondSchema } from './schema';
import { firstSecondQuestions } from './questions';

export const firstSecondMeta: LegalDocument = {
  id: 'first-second',
  name: 'First Second Document',
  category: 'Miscellaneous',
  schema: FirstSecondSchema,
  questions: firstSecondQuestions,
};
