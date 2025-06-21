// src/lib/documents/us/notice-to-pay-rent-or-quit/schema.ts
import { z } from 'zod';

export const NoticeToPayRentOrQuitSchema = z.object({
  // Document will be implemented with proper schema
  documentType: z.literal('notice-to-pay-rent-or-quit'),
  createdDate: z.string().default(new Date().toISOString()),

  // Basic required fields - will be expanded
  title: z.string().min(1, 'Title is required'),

  // Signatures
  signatureDate: z.string().optional(),
});
