import type { LegalDocument } from '@/types/documents';
import { stockPurchaseAgreementMeta } from './metadata';
import { stockPurchaseAgreementQuestions } from './questions';
import { stockPurchaseAgreementSchema } from './schema';

export const stockPurchaseAgreement: LegalDocument = {
  id: 'stock-purchase-agreement',
  ...stockPurchaseAgreementMeta,
  schema: stockPurchaseAgreementSchema,
  questions: stockPurchaseAgreementQuestions,
};