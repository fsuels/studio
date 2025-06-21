// src/lib/documents/us/copyright-license-agreement/schema.ts
import { z } from 'zod';

export const CopyrightlicenseagreementSchema = z.object({
  party1Name: z.string().min(1, 'Party 1 name is required.'),
  party1Address: z.string().min(1, 'Party 1 address is required.'),
  party2Name: z.string().min(1, 'Party 2 name is required.'),
  party2Address: z.string().min(1, 'Party 2 address is required.'),
  effectiveDate: z
    .string()
    .min(1, 'Effective date is required.')
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  purpose: z.string().min(1, 'Purpose is required.'),
  consideration: z.string().optional(),
  duration: z.string().optional(),
});

export type CopyrightlicenseagreementData = z.infer<
  typeof CopyrightlicenseagreementSchema
>;
