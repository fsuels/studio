// src/lib/documents/us/earnest-money-agreement/schema.ts
import { z } from 'zod';

export const EarnestMoneyAgreementSchema = z.object({
  // Document will be implemented with proper schema
  documentType: z.literal('earnest-money-agreement'),
  createdDate: z.string().default(new Date().toISOString()),

  // Basic required fields - will be expanded
  title: z.string().min(1, 'Title is required'),

  // Signatures
  signatureDate: z.string().optional(),
});
