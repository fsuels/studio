// src/lib/documents/us/residential-rental-application/schema.ts
import { z } from 'zod';

export const ResidentialRentalApplicationSchema = z.object({
  // Document will be implemented with proper schema
  documentType: z.literal('residential-rental-application'),
  createdDate: z.string().default(new Date().toISOString()),

  // Basic required fields - will be expanded
  title: z.string().min(1, 'Title is required'),

  // Signatures
  signatureDate: z.string().optional(),
});
