import type { LegalDocument } from '@/types/documents';
import { affidavitOfSurvivorshipMeta } from './metadata';
import { schema } from './schema';
import { questions } from './questions';

export const affidavitOfSurvivorship: LegalDocument = {
  ...affidavitOfSurvivorshipMeta,
  schema,
  questions,
};
