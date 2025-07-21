import type { LegalDocument } from '@/types/documents';
import { purchaseOrderMeta } from './metadata';
import { purchaseOrderQuestions } from './questions';
import { purchaseOrderSchema } from './schema';

export const purchaseOrder: LegalDocument = {
  id: 'purchase-order',
  ...purchaseOrderMeta,
  schema: purchaseOrderSchema,
  questions: purchaseOrderQuestions,
};
