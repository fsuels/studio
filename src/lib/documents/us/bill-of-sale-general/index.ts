import type { LegalDocument } from '@/types/documents';
import { billOfSaleGeneralMeta } from './metadata';
import { billOfSaleGeneralQuestions } from './questions';
import { billOfSaleGeneralSchema } from './schema';

export const billOfSaleGeneral: LegalDocument = {
  id: 'bill-of-sale-general',
  ...billOfSaleGeneralMeta,
  schema: billOfSaleGeneralSchema,
  questions: billOfSaleGeneralQuestions,
};
