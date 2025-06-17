import type { LegalDocument } from '@/types/documents';
import { generalInquiryMeta } from './metadata';
import { schema } from './schema';
import { questions } from './questions';

export const generalInquiry: LegalDocument = {
  ...generalInquiryMeta,
  schema,
  questions,
};