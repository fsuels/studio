// src/lib/documents/us/notice-to-enter/schema.ts
import { z } from 'zod';

export const NoticeToEnterSchema = z.object({
  // Document will be implemented with proper schema
  documentType: z.literal('notice-to-enter'),
  createdDate: z.string().default(new Date().toISOString()),

  // Basic required fields - will be expanded
  title: z.string().min(1, 'Title is required'),

  // Signatures
  signatureDate: z.string().optional(),
});
