import { z } from 'zod';

export const promissoryNoteCASchema = z.object({
  lenderName: z.string().min(1, 'Lender name is required'),
  borrowerName: z.string().min(1, 'Borrower name is required'),
  principalAmount: z.coerce.number().positive('Amount must be positive'),
  interestRate: z.coerce.number().min(0).optional(),
  repaymentTerms: z.string().min(1, 'Repayment terms are required'),
  province: z.string().min(2, 'Province is required'),
});
