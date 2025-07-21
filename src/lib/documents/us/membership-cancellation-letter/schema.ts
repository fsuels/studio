// src/lib/documents/us/membership-cancellation-letter/schema.ts
import { z } from 'zod';

export const MembershipCancellationLetterSchema = z.object({
  // Member Information
  memberName: z.string().min(1, 'Member name is required'),
  memberAddress: z.string().optional(),
  memberPhone: z.string().optional(),
  memberEmail: z.string().email().optional(),
  membershipNumber: z.string().optional(),

  // Organization Information
  organizationName: z.string().optional(),
  organizationAddress: z.string().optional(),
  contactPerson: z.string().optional(),

  // Membership Details
  membershipType: z.string().optional(),
  membershipStartDate: z.string().optional(),
  cancellationDate: z.string().optional(),
  reasonForCancellation: z.string().optional(),

  // Financial Information
  lastPaymentDate: z.string().optional(),
  refundRequested: z.boolean().default(false),
  refundAmount: z.string().optional(),

  // Cancellation Details
  effectiveDate: z.string().optional(),
  immediateTermination: z.boolean().default(false),
  noticePeriod: z.string().optional(),

  // Letter Information
  letterDate: z.string().optional(),
  confirmationRequested: z.boolean().default(true),

  // Signature
  signature: z.boolean().default(true),
});
