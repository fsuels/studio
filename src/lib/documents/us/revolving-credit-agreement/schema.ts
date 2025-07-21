import { z } from 'zod';
import { usStates } from '@/lib/usStates';

export const RevolvingCreditAgreementSchema = z.object({
  date: z
    .string()
    .min(1)
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  creditorName: z.string().min(1),
  creditorAddress: z.string().min(1),
  debtorName: z.string().min(1),
  debtorAddress: z.string().min(1),
  creditLimit: z.coerce.number().positive(),
  interestRate: z.coerce.number().nonnegative(),
  minimumPaymentPercentage: z.coerce.number().positive().max(100),
  billingCycle: z.enum(['Monthly', 'Bi-monthly']),
  paymentDueDate: z.coerce.number().int().min(1).max(31),
  gracePerod: z.coerce.number().int().nonnegative(),
  lateFeeAmount: z.coerce.number().nonnegative(),
  overlimitFee: z.coerce.number().nonnegative(),
  cashAdvanceFee: z.coerce.number().nonnegative(),
  cashAdvanceRate: z.coerce.number().nonnegative(),
  governingLaw: z.enum(usStates.map((s) => s.value) as [string, ...string[]]),
  creditReviewFrequency: z.enum(['Quarterly', 'Semi-annually', 'Annually']),
  defaultRate: z.coerce.number().nonnegative().optional(),
  annualFee: z.coerce.number().nonnegative().optional(),
});

export type RevolvingCreditAgreementData = z.infer<
  typeof RevolvingCreditAgreementSchema
>;
