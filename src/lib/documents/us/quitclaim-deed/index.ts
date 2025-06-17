import type { LegalDocument } from '@/types/documents';
import { quitclaimDeedMeta } from './metadata';
import { quitclaimDeedQuestions } from './questions';
import { quitclaimDeedSchema } from './schema';

export const quitclaimDeed: LegalDocument = {
  id: 'quitclaim-deed',
  ...quitclaimDeedMeta,
  schema: quitclaimDeedSchema,
  questions: quitclaimDeedQuestions,
};