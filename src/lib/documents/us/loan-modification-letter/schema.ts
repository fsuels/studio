import { z } from 'zod';
import { usStates } from '@/lib/usStates';

export const LoanModificationLetterSchema = z.object({
  date: z
    .string()
    .min(1)
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  borrowerName: z.string().min(1),
  borrowerAddress: z.string().min(1),
  lenderName: z.string().min(1),
  lenderAddress: z.string().min(1),
  loanAccountNumber: z.string().min(1),
  originalLoanAmount: z.coerce.number().positive(),
  currentBalance: z.coerce.number().positive(),
  originalPaymentAmount: z.coerce.number().positive(),
  requestedPaymentAmount: z.coerce.number().positive(),
  reasonForModification: z.enum([
    'Job Loss',
    'Income Reduction',
    'Medical Emergency',
    'Divorce',
    'Death in Family',
    'Other Financial Hardship',
  ]),
  detailedExplanation: z.string().min(10),
  monthlyIncome: z.coerce.number().nonnegative(),
  monthlyExpenses: z.coerce.number().nonnegative(),
  proposedTerm: z.enum(['Temporary', 'Permanent']),
  requestedStartDate: z
    .string()
    .min(1)
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  supportingDocuments: z.array(z.string()).optional(),
  contactPhone: z.string().min(1),
  contactEmail: z.string().email().optional(),
});

export type LoanModificationLetterData = z.infer<
  typeof LoanModificationLetterSchema
>;
