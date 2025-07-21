// src/lib/documents/us/rent-increase-letter/schema.ts
import { z } from 'zod';

export const RentIncreaseLetterSchema = z.object({
  // Document will be implemented with proper schema
  documentType: z.literal('rent-increase-letter'),
  createdDate: z.string().default(new Date().toISOString()),

  // Basic required fields - will be expanded
  title: z.string().min(1, 'Title is required'),

  // Signatures
  signatureDate: z.string().optional(),
});
