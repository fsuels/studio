import { z } from 'zod';
import { usStates } from '@/lib/usStates';

export const AchAuthorizationFormSchema = z.object({
  date: z
    .string()
    .min(1)
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  customerName: z.string().min(1),
  customerAddress: z.string().min(1),
  customerPhone: z.string().min(1),
  customerEmail: z.string().email().optional(),
  companyName: z.string().min(1),
  companyAddress: z.string().min(1),
  bankName: z.string().min(1),
  bankAddress: z.string().min(1),
  accountHolderName: z.string().min(1),
  routingNumber: z
    .string()
    .min(9)
    .max(9)
    .regex(/^\d{9}$/, 'Routing number must be 9 digits'),
  accountNumber: z.string().min(1),
  accountType: z.enum(['Checking', 'Savings']),
  transactionType: z.enum(['One-time', 'Recurring']),
  paymentAmount: z.coerce.number().positive(),
  paymentFrequency: z
    .enum(['Weekly', 'Bi-weekly', 'Monthly', 'Quarterly'])
    .optional(),
  firstPaymentDate: z
    .string()
    .min(1)
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  finalPaymentDate: z
    .string()
    .min(1)
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
    .optional(),
  purposeOfPayment: z.string().min(1),
  preNotificationRequired: z.boolean(),
  notificationDays: z.coerce.number().int().nonnegative().optional(),
  revocationTerms: z.string().min(10),
  returnedPaymentFee: z.coerce.number().nonnegative().optional(),
});

export type AchAuthorizationFormData = z.infer<
  typeof AchAuthorizationFormSchema
>;
