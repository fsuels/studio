// src/lib/documents/us/confidentiality-agreement/schema.ts
import { z } from 'zod';

export const ConfidentialityAgreementSchema = z.object({
  disclosingPartyName: z.string().min(1, 'Disclosing party name is required.'),
  disclosingPartyAddress: z
    .string()
    .min(1, 'Disclosing party address is required.'),
  disclosingPartyTitle: z.string().optional(),
  receivingPartyName: z.string().min(1, 'Receiving party name is required.'),
  receivingPartyAddress: z
    .string()
    .min(1, 'Receiving party address is required.'),
  receivingPartyTitle: z.string().optional(),
  effectiveDate: z
    .string()
    .min(1, 'Effective date is required.')
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  purpose: z.string().min(1, 'Purpose of disclosure is required.'),
  confidentialInfoDescription: z
    .string()
    .min(1, 'Description of confidential information is required.'),
  termYears: z.coerce
    .number()
    .int()
    .min(0, 'Term must be a non-negative integer.')
    .optional(),
  specificExclusions: z.string().optional(),
  returnDate: z.string().optional(),
  remediesClause: z.string().optional(),
  governingState: z.string().min(1, 'Governing state is required.'),
});

export type ConfidentialityAgreementData = z.infer<
  typeof ConfidentialityAgreementSchema
>;
