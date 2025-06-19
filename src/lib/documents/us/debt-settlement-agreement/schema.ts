import { z } from 'zod';
import { usStates } from '@/lib/usStates';

export const DebtSettlementAgreementSchema = z.object({
  date: z.string().min(1).regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  creditorName: z.string().min(1),
  creditorAddress: z.string().min(1),
  debtorName: z.string().min(1),
  debtorAddress: z.string().min(1),
  originalDebtAmount: z.coerce.number().positive(),
  settlementAmount: z.coerce.number().positive(),
  accountNumber: z.string().min(1),
  settlementType: z.enum(['Lump Sum', 'Payment Plan']),
  paymentAmount: z.coerce.number().positive(),
  paymentDate: z.string().min(1).regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  numberOfPayments: z.coerce.number().int().positive().optional(),
  paymentFrequency: z.enum(['Monthly', 'Bi-weekly', 'Weekly']).optional(),
  finalPaymentDate: z.string().min(1).regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format').optional(),
  governingLaw: z.enum(usStates.map((s) => s.value) as [string, ...string[]]),
  creditReportingClause: z.boolean(),
  releaseTerm: z.enum(['Upon Final Payment', 'Upon First Payment', 'Immediate']),
  defaultConsequences: z.string().min(10),
  witnessRequired: z.boolean().optional(),
});

export type DebtSettlementAgreementData = z.infer<typeof DebtSettlementAgreementSchema>;
