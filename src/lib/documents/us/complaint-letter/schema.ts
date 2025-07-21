// src/lib/documents/us/complaint-letter/schema.ts
import { z } from 'zod';

export const ComplaintLetterSchema = z.object({
  // Complainant Information
  complainantName: z.string().min(1, 'Your name is required'),
  complainantAddress: z.string().optional(),
  complainantPhone: z.string().optional(),
  complainantEmail: z.string().email().optional(),

  // Recipient Information
  recipientName: z.string().optional(),
  recipientTitle: z.string().optional(),
  companyName: z.string().optional(),
  companyAddress: z.string().optional(),

  // Complaint Details
  incidentDate: z.string().optional(),
  complaintSubject: z.string().optional(),
  complaintDescription: z.string().optional(),
  damagesIncurred: z.string().optional(),
  evidenceAvailable: z.boolean().default(false),

  // Desired Resolution
  desiredResolution: z.string().optional(),
  compensationRequested: z.string().optional(),
  timeframeExpected: z.string().optional(),

  // Previous Contact
  previousContactAttempts: z.boolean().default(false),
  previousContactDetails: z.string().optional(),

  // Letter Details
  letterDate: z.string().optional(),
  urgencyLevel: z.enum(['low', 'medium', 'high']).default('medium'),

  // Follow-up
  responseRequested: z.boolean().default(true),
  responseTimeframe: z.string().optional(),

  // Signature
  signature: z.boolean().default(true),
});
