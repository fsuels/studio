import type { LegalDocument } from '@/types/documents';
import { quitclaimDeedMetadata } from './metadata';
import { quitclaimDeedQuestions } from './questions';
import { quitclaimDeedSchema } from './schema';

export const quitclaimDeed: LegalDocument = {
  id: 'quitclaim-deed',
  ...quitclaimDeedMetadata,
  schema: quitclaimDeedSchema,
  questions: quitclaimDeedQuestions,
};