// src/lib/documents/us/mutual-non-disclosure-agreement/schema.ts
import { z } from 'zod';

export const MutualNDASchema = z.object({
  party1Name: z.string().min(1, 'Party 1 name is required.'),
  party1Address: z.string().min(1, 'Party 1 address is required.'),
  party1Title: z.string().optional(),
  party2Name: z.string().min(1, 'Party 2 name is required.'),
  party2Address: z.string().min(1, 'Party 2 address is required.'),
  party2Title: z.string().optional(),
  effectiveDate: z
    .string()
    .min(1, 'Effective date is required.')
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  purpose: z.string().min(1, 'Purpose of mutual disclosure is required.'),
  confidentialInfoDescription: z.string().optional(),
  termYears: z.coerce
    .number()
    .int()
    .min(0, 'Term must be a non-negative integer.')
    .optional(),
  specificExclusions: z.string().optional(),
  returnDate: z.string().optional(),
});

export type MutualNDAData = z.infer<typeof MutualNDASchema>;
