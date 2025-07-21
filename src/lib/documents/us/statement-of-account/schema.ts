import { z } from 'zod';
import { usStates } from '@/lib/usStates';

export const StatementOfAccountSchema = z.object({
  statementDate: z
    .string()
    .min(1)
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  statementPeriodStart: z
    .string()
    .min(1)
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  statementPeriodEnd: z
    .string()
    .min(1)
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  accountHolderName: z.string().min(1),
  accountHolderAddress: z.string().min(1),
  accountNumber: z.string().min(1),
  companyName: z.string().min(1),
  companyAddress: z.string().min(1),
  previousBalance: z.coerce.number(),
  totalCharges: z.coerce.number().nonnegative(),
  totalPayments: z.coerce.number().nonnegative(),
  totalCredits: z.coerce.number().nonnegative(),
  currentBalance: z.coerce.number(),
  minimumPaymentDue: z.coerce.number().nonnegative(),
  paymentDueDate: z
    .string()
    .min(1)
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  interestRate: z.coerce.number().nonnegative().optional(),
  interestCharges: z.coerce.number().nonnegative().optional(),
  lateFees: z.coerce.number().nonnegative().optional(),
  creditLimit: z.coerce.number().positive().optional(),
  availableCredit: z.coerce.number().nonnegative().optional(),
  accountType: z.enum([
    'Credit Account',
    'Loan Account',
    'Service Account',
    'Business Account',
  ]),
  statementType: z.enum(['Monthly', 'Quarterly', 'Annual', 'Final']),
  paymentInstructions: z.string().min(10),
  contactInformation: z.string().min(1),
  disputePeriod: z.coerce.number().int().positive().optional(),
});

export type StatementOfAccountData = z.infer<typeof StatementOfAccountSchema>;
