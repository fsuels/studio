// src/lib/documents/us/letter-of-intent/schema.ts
import { z } from 'zod';

export const LetterOfIntentSchema = z.object({
  // Sender Information
  senderName: z.string().min(1, 'Sender name is required'),
  senderTitle: z.string().optional(),
  senderCompany: z.string().optional(),
  senderAddress: z.string().min(1, 'Sender address is required'),
  senderPhone: z.string().optional(),
  senderEmail: z.string().email().optional(),

  // Recipient Information
  recipientName: z.string().min(1, 'Recipient name is required'),
  recipientTitle: z.string().optional(),
  recipientCompany: z.string().optional(),
  recipientAddress: z.string().min(1, 'Recipient address is required'),

  // Letter Details
  letterDate: z.string().min(1, 'Letter date is required'),
  subject: z.string().min(1, 'Subject is required'),

  // Intent Details
  intentType: z.enum([
    'purchase',
    'partnership',
    'merger',
    'joint-venture',
    'licensing',
    'employment',
    'other',
  ]),
  transactionDescription: z
    .string()
    .min(1, 'Transaction description is required'),

  // Business Terms
  proposedTerms: z.string().optional(),
  timeframe: z.string().optional(),
  conditions: z.string().optional(),

  // Financial Terms
  hasFinancialTerms: z.boolean().default(false),
  proposedPrice: z.number().optional(),
  paymentTerms: z.string().optional(),
  financingConditions: z.string().optional(),

  // Due Diligence
  dueDiligencePeriod: z.string().optional(),
  dueDiligenceConditions: z.string().optional(),

  // Exclusivity
  exclusivityPeriod: z.string().optional(),
  exclusivityTerms: z.string().optional(),

  // Confidentiality
  confidentialityClause: z.boolean().default(false),
  confidentialityTerms: z.string().optional(),

  // Next Steps
  nextSteps: z.string().optional(),
  proposedMeetingDate: z.string().optional(),
  responseDeadline: z.string().optional(),

  // Legal Disclaimers
  bindingStatement: z
    .enum(['binding', 'non-binding', 'partially-binding'])
    .default('non-binding'),
  legalDisclaimer: z.string().optional(),

  // Additional Terms
  additionalTerms: z.string().optional(),
  specialConditions: z.string().optional(),
});
