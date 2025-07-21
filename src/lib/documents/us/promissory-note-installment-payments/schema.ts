import { z } from 'zod';
import { usStates } from '@/lib/usStates';

export const PromissoryNoteInstallmentPaymentsSchema = z.object({
  date: z
    .string()
    .min(1)
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  placeOfExecution: z.string().min(1),
  lenderName: z.string().min(1),
  lenderAddress: z.string().min(1),
  borrowerName: z.string().min(1),
  borrowerAddress: z.string().min(1),
  principalAmount: z.coerce.number().positive(),
  interestRate: z.coerce.number().nonnegative(),
  numberOfInstallments: z.coerce.number().int().positive(),
  installmentAmount: z.coerce.number().positive(),
  firstPaymentDate: z
    .string()
    .min(1)
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  paymentFrequency: z.enum(['Monthly', 'Bi-weekly', 'Weekly', 'Quarterly']),
  finalPaymentDate: z
    .string()
    .min(1)
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  governingLaw: z.enum(usStates.map((s) => s.value) as [string, ...string[]]),
  lateFeeAmount: z.coerce.number().optional(),
  gracePerod: z.coerce.number().int().optional(),
  defaultInterestRate: z.coerce.number().optional(),
  prepaymentPenalty: z.boolean().optional(),
});

export type PromissoryNoteInstallmentPaymentsData = z.infer<
  typeof PromissoryNoteInstallmentPaymentsSchema
>;
