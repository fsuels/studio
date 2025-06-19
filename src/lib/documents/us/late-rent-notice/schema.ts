// src/lib/documents/us/late-rent-notice/schema.ts
import { z } from 'zod';

export const LateRentNoticeSchema = z.object({
  // Document will be implemented with proper schema
  documentType: z.literal('late-rent-notice'),
  createdDate: z.string().default(new Date().toISOString()),
  
  // Basic required fields - will be expanded
  title: z.string().min(1, 'Title is required'),
  
  // Signatures
  signatureDate: z.string().optional(),
});