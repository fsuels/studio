// src/lib/documents/us/residential-rental-inspection-report/schema.ts
import { z } from 'zod';

export const ResidentialRentalInspectionReportSchema = z.object({
  // Document will be implemented with proper schema
  documentType: z.literal('residential-rental-inspection-report'),
  createdDate: z.string().default(new Date().toISOString()),
  
  // Basic required fields - will be expanded
  title: z.string().min(1, 'Title is required'),
  
  // Signatures
  signatureDate: z.string().optional(),
});