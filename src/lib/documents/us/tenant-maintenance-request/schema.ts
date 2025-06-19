// src/lib/documents/us/tenant-maintenance-request/schema.ts
import { z } from 'zod';

export const TenantMaintenanceRequestSchema = z.object({
  // Document will be implemented with proper schema
  documentType: z.literal('tenant-maintenance-request'),
  createdDate: z.string().default(new Date().toISOString()),
  
  // Basic required fields - will be expanded
  title: z.string().min(1, 'Title is required'),
  
  // Signatures
  signatureDate: z.string().optional(),
});