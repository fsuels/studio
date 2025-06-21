import type { LegalDocument } from '@/types/documents';
import { buySellAgreementMeta } from './metadata';
import { buySellAgreementQuestions } from './questions';
import { buySellAgreementSchema } from './schema';

export const buySellAgreement: LegalDocument = {
  id: 'buy-sell-agreement',
  ...buySellAgreementMeta,
  schema: buySellAgreementSchema,
  questions: buySellAgreementQuestions,
};
