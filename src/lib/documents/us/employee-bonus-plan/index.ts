import type { LegalDocument } from '@/types/documents';
import { employeeBonusPlanMeta } from './metadata';
import { schema } from './schema';
import { questions } from './questions';

export const employeeBonusPlan: LegalDocument = {
  ...employeeBonusPlanMeta,
  schema,
  questions,
};