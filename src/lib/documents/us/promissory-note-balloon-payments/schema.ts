import { z } from 'zod';
import { usStates } from '@/lib/usStates';

export const PromissoryNoteBalloonPaymentsSchema = z.object({
  date: z.string().min(1).regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  placeOfExecution: z.string().min(1),
  lenderName: z.string().min(1),
  lenderAddress: z.string().min(1),
  borrowerName: z.string().min(1),
  borrowerAddress: z.string().min(1),
  principalAmount: z.coerce.number().positive(),
  interestRate: z.coerce.number().nonnegative(),
  regularPaymentAmount: z.coerce.number().positive(),
  paymentFrequency: z.enum(['Monthly', 'Quarterly', 'Semi-annually']),
  balloonPaymentAmount: z.coerce.number().positive(),
  balloonPaymentDate: z.string().min(1).regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  firstPaymentDate: z.string().min(1).regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  governingLaw: z.enum(usStates.map((s) => s.value) as [string, ...string[]]),
  lateFeeAmount: z.coerce.number().optional(),
  gracePerod: z.coerce.number().int().optional(),
  balloonPaymentNotice: z.coerce.number().int().optional(),
  refinancingOption: z.boolean().optional(),
});

export type PromissoryNoteBalloonPaymentsData = z.infer<typeof PromissoryNoteBalloonPaymentsSchema>;
