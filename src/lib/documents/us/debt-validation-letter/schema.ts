import { z } from 'zod';

export const DebtValidationLetterSchema = z.object({
  date: z
    .string()
    .min(1)
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  debtorName: z.string().min(1),
  debtorAddress: z.string().min(1),
  collectorName: z.string().min(1),
  collectorAddress: z.string().min(1),
  accountNumber: z.string().min(1),
  claimedDebtAmount: z.coerce.number().positive(),
  originalCreditorName: z.string().min(1),
  dateOfLastPayment: z
    .string()
    .min(1)
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
    .optional(),
  requestType: z.enum(['Validation', 'Verification', 'Both']),
  disputeReason: z
    .enum([
      'Not My Debt',
      'Amount Incorrect',
      'Statute of Limitations',
      'Already Paid',
      'Identity Theft',
      'Other',
    ])
    .optional(),
  additionalRequests: z
    .array(
      z.enum([
        'Cease Communication',
        'Validation Only by Mail',
        'Remove from Credit Report',
        'Proof of License',
        'Chain of Title',
      ]),
    )
    .optional(),
  customMessage: z.string().optional(),
  requestCeaseContact: z.boolean(),
  requestWrittenCommunication: z.boolean(),
});

export type DebtValidationLetterData = z.infer<
  typeof DebtValidationLetterSchema
>;
