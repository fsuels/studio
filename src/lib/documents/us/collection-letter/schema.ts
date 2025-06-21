import { z } from 'zod';
import { usStates } from '@/lib/usStates';

export const CollectionLetterSchema = z.object({
  date: z
    .string()
    .min(1)
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  creditorName: z.string().min(1),
  creditorAddress: z.string().min(1),
  debtorName: z.string().min(1),
  debtorAddress: z.string().min(1),
  originalDebtAmount: z.coerce.number().positive(),
  currentBalance: z.coerce.number().positive(),
  accountNumber: z.string().min(1),
  dueDate: z
    .string()
    .min(1)
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  daysPastDue: z.coerce.number().int().nonnegative(),
  collectionType: z.enum([
    'First Notice',
    'Second Notice',
    'Final Notice',
    'Pre-Legal',
  ]),
  paymentOptions: z.array(
    z.enum([
      'Full Payment',
      'Payment Plan',
      'Settlement Offer',
      'Contact for Arrangement',
    ]),
  ),
  responseDeadline: z
    .string()
    .min(1)
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  lateFees: z.coerce.number().nonnegative().optional(),
  interestCharges: z.coerce.number().nonnegative().optional(),
  totalAmountDue: z.coerce.number().positive(),
  contactPhone: z.string().min(1),
  contactEmail: z.string().email().optional(),
  legalConsequences: z.string().min(10),
  disputeRights: z.boolean(),
  validationPeriod: z.coerce.number().int().positive().optional(),
});

export type CollectionLetterData = z.infer<typeof CollectionLetterSchema>;
