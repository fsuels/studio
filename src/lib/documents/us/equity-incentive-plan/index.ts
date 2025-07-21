import type { LegalDocument } from '@/types/documents';
import { equityIncentivePlanMeta } from './metadata';
import { schema } from './schema';
import { questions } from './questions';

export const equityIncentivePlan: LegalDocument = {
  ...equityIncentivePlanMeta,
  schema,
  questions,
};
