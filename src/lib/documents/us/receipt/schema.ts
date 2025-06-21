import { z } from 'zod';
import { usStates } from '@/lib/usStates';

export const ReceiptSchema = z.object({
  receiptNumber: z.string().min(1),
  date: z
    .string()
    .min(1)
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  payerName: z.string().min(1),
  payerAddress: z.string().min(1),
  payeeName: z.string().min(1),
  payeeAddress: z.string().min(1),
  amount: z.coerce.number().positive(),
  paymentMethod: z.enum([
    'Cash',
    'Check',
    'Credit Card',
    'Debit Card',
    'Bank Transfer',
    'Money Order',
    'Other',
  ]),
  checkNumber: z.string().optional(),
  transactionId: z.string().optional(),
  purposeOfPayment: z.string().min(1),
  taxAmount: z.coerce.number().nonnegative().optional(),
  totalAmount: z.coerce.number().positive(),
  balanceDue: z.coerce.number().nonnegative().optional(),
  receiptType: z.enum([
    'Payment Receipt',
    'Deposit Receipt',
    'Rental Receipt',
    'Service Receipt',
    'Purchase Receipt',
  ]),
  paymentFor: z.enum([
    'Goods',
    'Services',
    'Rent',
    'Loan Payment',
    'Deposit',
    'Other',
  ]),
  accountNumber: z.string().optional(),
  dueDate: z
    .string()
    .min(1)
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
    .optional(),
  notes: z.string().optional(),
});

export type ReceiptData = z.infer<typeof ReceiptSchema>;
