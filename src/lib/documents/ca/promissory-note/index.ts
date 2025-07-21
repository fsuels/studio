import type { LegalDocument } from '@/types/documents';
import { promissoryNoteCAMetadata } from './metadata';
import { promissoryNoteCAQuestions } from './questions';
import { promissoryNoteCASchema } from './schema';

export const promissoryNoteCA: LegalDocument = {
  id: 'promissory-note-ca',
  ...promissoryNoteCAMetadata,
  schema: promissoryNoteCASchema,
  questions: promissoryNoteCAQuestions,
};
