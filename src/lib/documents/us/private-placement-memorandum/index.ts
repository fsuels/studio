import type { LegalDocument } from '@/types/documents';
import { privatePlacementMemorandumMeta } from './metadata';
import { privatePlacementMemorandumQuestions } from './questions';
import { privatePlacementMemorandumSchema } from './schema';

export const privatePlacementMemorandum: LegalDocument = {
  id: 'private-placement-memorandum',
  ...privatePlacementMemorandumMeta,
  schema: privatePlacementMemorandumSchema,
  questions: privatePlacementMemorandumQuestions,
};
