// src/lib/documents/us/notice-of-lease-violation/schema.ts
import { z } from 'zod';

export const NoticeOfLeaseViolationSchema = z.object({
  // Document will be implemented with proper schema
  documentType: z.literal('notice-of-lease-violation'),
  createdDate: z.string().default(new Date().toISOString()),

  // Basic required fields - will be expanded
  title: z.string().min(1, 'Title is required'),

  // Signatures
  signatureDate: z.string().optional(),
});
