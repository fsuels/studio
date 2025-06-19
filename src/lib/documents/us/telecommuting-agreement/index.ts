import type { LegalDocument } from '@/types/documents';
import { telecommutingAgreementMeta } from './metadata';
import { schema } from './schema';
import { questions } from './questions';

export const telecommutingAgreement: LegalDocument = {
  ...telecommutingAgreementMeta,
  schema,
  questions,
};