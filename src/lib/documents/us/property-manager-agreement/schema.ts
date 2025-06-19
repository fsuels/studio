// src/lib/documents/us/property-manager-agreement/schema.ts
import { z } from 'zod';

export const PropertyManagerAgreementSchema = z.object({
  // Document will be implemented with proper schema
  documentType: z.literal('property-manager-agreement'),
  createdDate: z.string().default(new Date().toISOString()),
  
  // Basic required fields - will be expanded
  title: z.string().min(1, 'Title is required'),
  
  // Signatures
  signatureDate: z.string().optional(),
});