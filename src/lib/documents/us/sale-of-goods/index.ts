import type { LegalDocument } from '@/types/documents';
import { saleOfGoodsMeta } from './metadata';
import { saleOfGoodsQuestions } from './questions';
import { saleOfGoodsSchema } from './schema';

export const saleOfGoods: LegalDocument = {
  id: 'sale-of-goods',
  ...saleOfGoodsMeta,
  schema: saleOfGoodsSchema,
  questions: saleOfGoodsQuestions,
};