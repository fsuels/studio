import type { LegalDocument } from '@/types/documents';
import { partnershipAmendmentMeta } from './metadata';
import { partnershipAmendmentQuestions } from './questions';
import { partnershipAmendmentSchema } from './schema';

export const partnershipAmendment: LegalDocument = {
  id: 'partnership-amendment',
  ...partnershipAmendmentMeta,
  schema: partnershipAmendmentSchema,
  questions: partnershipAmendmentQuestions,
};
