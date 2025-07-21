import type { LegalDocument } from '@/types/documents';
import { contractAmendmentMeta } from './metadata';
import { contractAmendmentQuestions } from './questions';
import { ContractAmendmentSchema } from './schema';

export const contractAmendment: LegalDocument = {
  id: 'contract-amendment',
  ...contractAmendmentMeta,
  schema: ContractAmendmentSchema,
  questions: contractAmendmentQuestions,
};
