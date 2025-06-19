import type { LegalDocument } from '@/types/documents';
import { employeeNonDisclosureAgreementMeta } from './metadata';
import { schema } from './schema';
import { questions } from './questions';

export const employeeNonDisclosureAgreement: LegalDocument = {
  ...employeeNonDisclosureAgreementMeta,
  schema,
  questions,
};
