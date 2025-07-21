import type { LegalDocument } from '@/types/documents';
import { singleMemberLlcOperatingAgreementMeta } from './metadata';
import { singleMemberLlcOperatingAgreementQuestions } from './questions';
import { singleMemberLlcOperatingAgreementSchema } from './schema';

export const singleMemberLlcOperatingAgreement: LegalDocument = {
  id: 'single-member-llc-operating-agreement',
  ...singleMemberLlcOperatingAgreementMeta,
  schema: singleMemberLlcOperatingAgreementSchema,
  questions: singleMemberLlcOperatingAgreementQuestions,
};
