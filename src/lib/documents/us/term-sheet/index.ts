import type { LegalDocument } from '@/types/documents';
import { termSheetMeta } from './metadata';
import { termSheetQuestions } from './questions';
import { termSheetSchema } from './schema';

export const termSheet: LegalDocument = {
  id: 'term-sheet',
  ...termSheetMeta,
  schema: termSheetSchema,
  questions: termSheetQuestions,
};
