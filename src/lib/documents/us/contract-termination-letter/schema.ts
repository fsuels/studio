// src/lib/documents/us/contract-termination-letter/schema.ts
import { z } from 'zod';

export const contractTerminationLetterSchema = z.object({
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
  subject: z.string().min(1, 'Subject line is required'),

  // Contract Information
  contractTitle: z.string().min(1, 'Contract title is required'),
  contractDate: z.string().min(1, 'Contract date is required'),
  contractNumber: z.string().optional(),
  contractDescription: z.string().min(1, 'Contract description is required'),

  // Termination Details
  terminationReason: z.enum([
    'breach',
    'convenience',
    'mutual_agreement',
    'expiration',
    'non_performance',
    'other',
  ]),
  terminationReasonDetails: z
    .string()
    .min(1, 'Termination reason details required'),
  terminationClause: z.string().optional(),

  // Notice Requirements
  noticeRequired: z.boolean(),
  noticePeriod: z.string().optional(),
  effectiveDate: z.string().min(1, 'Effective date is required'),
  immediateTermination: z.boolean(),

  // Obligations and Settlement
  outstandingObligations: z.string().optional(),
  finalPayment: z.string().optional(),
  returnOfProperty: z.boolean(),
  propertyDescription: z.string().optional(),
  confidentialityRemains: z.boolean(),

  // References to Contract Terms
  terminationClauseReference: z.string().optional(),
  governingLaw: z.string().optional(),
  disputeResolution: z.string().optional(),

  // Cure Period (for breach)
  curePeriodOffered: z.boolean(),
  curePeriodDays: z.string().optional(),
  cureDeadline: z.string().optional(),

  // Additional Terms
  additionalTerms: z.string().optional(),
  specialInstructions: z.string().optional(),

  // Delivery Method
  deliveryMethod: z.enum([
    'certified_mail',
    'email',
    'hand_delivery',
    'regular_mail',
    'courier',
  ]),
  deliveryConfirmation: z.boolean(),

  // Professional Tone
  professionalTone: z.boolean(),
  futureRelationship: z.enum(['maintain', 'neutral', 'severance']),

  // Legal Reservations
  reserveRights: z.boolean(),
  legalRightsStatement: z.string().optional(),

  // Signature
  signatureRequired: z.boolean(),
  signerName: z.string().min(1, 'Signer name is required'),
  signerTitle: z.string().optional(),
  signatureDate: z.string().optional(),
});
