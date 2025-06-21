// src/lib/documents/us/lease-termination-letter/schema.ts
import { z } from 'zod';

export const LeaseTerminationLetterSchema = z.object({
  // Sender Information
  senderName: z.string().min(1, 'Sender name is required'),
  senderAddress: z.string().min(1, 'Sender address is required'),
  senderPhone: z.string().optional(),
  senderEmail: z.string().email().optional(),

  // Recipient Information
  recipientName: z.string().min(1, 'Recipient name is required'),
  recipientAddress: z.string().min(1, 'Recipient address is required'),

  // Property Information
  propertyAddress: z.string().min(1, 'Property address is required'),
  unitNumber: z.string().optional(),

  // Lease Information
  leaseStartDate: z.string().min(1, 'Lease start date is required'),
  currentLeaseEndDate: z.string().optional(),

  // Termination Details
  terminationDate: z.string().min(1, 'Termination date is required'),
  noticeType: z.enum([
    '30-day',
    '60-day',
    '90-day',
    'end-of-lease',
    'immediate',
  ]),
  terminationReason: z.enum([
    'end-of-lease',
    'moving',
    'purchase',
    'job-relocation',
    'other',
  ]),
  customReason: z.string().optional(),

  // Move-out Details
  moveOutDate: z.string().min(1, 'Move-out date is required'),
  forwardingAddress: z.string().optional(),

  // Security Deposit
  securityDepositAmount: z
    .number()
    .min(0, 'Security deposit cannot be negative'),
  securityDepositReturn: z.string().optional(),

  // Additional Information
  additionalNotes: z.string().optional(),

  // Letter Details
  letterDate: z.string().optional(),
});
