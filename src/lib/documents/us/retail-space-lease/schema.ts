// src/lib/documents/us/retail-space-lease/schema.ts
import { z } from 'zod';

export const RetailSpaceLeaseSchema = z.object({
  // Document will be implemented with proper schema
  documentType: z.literal('retail-space-lease'),
  createdDate: z.string().default(new Date().toISOString()),

  // Basic required fields - will be expanded
  title: z.string().min(1, 'Title is required'),

  // Signatures
  signatureDate: z.string().optional(),
});
