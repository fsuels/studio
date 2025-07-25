import { z } from 'zod';
import { usStates } from '@/lib/usStates';

export const PromissoryNoteSchema = z.object({
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
  paymentFrequency: z.enum(['Monthly', 'Quarterly', 'Annually', 'Lump Sum']),
  maturityDate: z
    .string()
    .min(1)
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  governingLaw: z.enum(usStates.map((s) => s.value) as [string, ...string[]]),
  lateFeeRate: z.coerce.number().optional(),
});

export type PromissoryNoteData = z.infer<typeof PromissoryNoteSchema>;
