import type { LegalDocument } from '@/types/documents';
import { boardResolutionMeta } from './metadata';
import { boardResolutionQuestions } from './questions';
import { boardResolutionSchema } from './schema';

export const boardResolution: LegalDocument = {
  id: 'board-resolution',
  ...boardResolutionMeta,
  schema: boardResolutionSchema,
  questions: boardResolutionQuestions,
};
