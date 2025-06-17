import type { LegalDocument } from '@/types/documents';
import { divorceSettlementAgreementMeta } from './metadata';
import { schema } from './schema';
import { questions } from './questions';

export const divorceSettlementAgreement: LegalDocument = {
  ...divorceSettlementAgreementMeta,
  schema,
  questions,
};