// src/lib/documents/us/demand-letter-payment/schema.ts
import { z } from 'zod';

export const DemandLetterPaymentSchema = z.object({
  senderName: z.string().min(1),
  senderAddress: z.string().min(1),
  recipientName: z.string().min(1),
  recipientAddress: z.string().min(1),
  amountDue: z.coerce.number().positive(),
  originalDueDate: z.string().optional(), // Date
  reasonForDebt: z.string().min(1),
  deadlineForPayment: z.string().min(1), // Date
  consequences: z.string().optional(),
});
