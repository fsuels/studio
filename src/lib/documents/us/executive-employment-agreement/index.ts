import type { LegalDocument } from '@/types/documents';
import { executiveEmploymentAgreementMeta } from './metadata';
import { schema } from './schema';
import { questions } from './questions';

export const executiveEmploymentAgreement: LegalDocument = {
  ...executiveEmploymentAgreementMeta,
  schema,
  questions,
};
