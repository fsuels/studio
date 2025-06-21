import { z } from 'zod';

export const loanAgreementSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email required').optional(),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(2, 'State is required'),
  zipCode: z.string().min(5, 'Valid ZIP code required'),
  date: z.string().min(1, 'Date is required'),
  amount: z.number().min(0, 'Amount must be positive'),
  interestRate: z
    .number()
    .min(0)
    .max(100, 'Interest rate must be between 0-100%'),
  paymentTerms: z.string().min(1, 'Payment terms required'),
  dueDate: z.string().min(1, 'Due date required'),
});

export type LoanAgreementData = z.infer<typeof loanAgreementSchema>;
