// src/lib/documents/us/payment-plan/schema.ts
import { z } from 'zod';

export const paymentPlanSchema = z.object({
  // Parties Information
  creditorName: z.string().min(1, 'Creditor name is required'),
  creditorAddress: z.string().min(1, 'Creditor address is required'),
  creditorType: z.enum(['individual', 'corporation', 'llc', 'partnership']),

  debtorName: z.string().min(1, 'Debtor name is required'),
  debtorAddress: z.string().min(1, 'Debtor address is required'),
  debtorType: z.enum(['individual', 'corporation', 'llc', 'partnership']),

  // Debt Information
  originalDebtAmount: z.string().min(1, 'Original debt amount is required'),
  currentBalanceOwed: z.string().min(1, 'Current balance owed is required'),
  debtOriginDate: z.string().min(1, 'Debt origin date is required'),
  debtDescription: z.string().min(1, 'Debt description is required'),
  interestRate: z.string().optional(),
  lateFeesOwed: z.string().optional(),

  // Payment Plan Details
  totalAmountToPay: z.string().min(1, 'Total amount to pay is required'),
  numberOfPayments: z.string().min(1, 'Number of payments is required'),
  paymentAmount: z.string().min(1, 'Payment amount is required'),
  paymentFrequency: z.enum([
    'weekly',
    'biweekly',
    'monthly',
    'quarterly',
    'annually',
    'other',
  ]),
  paymentFrequencyOther: z.string().optional(),

  firstPaymentDate: z.string().min(1, 'First payment date is required'),
  finalPaymentDate: z.string().min(1, 'Final payment date is required'),
  paymentDueDay: z.string().min(1, 'Payment due day is required'),

  // Payment Method
  paymentMethod: z.enum([
    'check',
    'money_order',
    'electronic_transfer',
    'automatic_deduction',
    'cash',
    'credit_card',
    'other',
  ]),
  paymentMethodDetails: z.string().optional(),
  paymentAddress: z.string().min(1, 'Payment address is required'),

  // Interest and Fees
  ongoingInterest: z.boolean(),
  ongoingInterestRate: z.string().optional(),
  lateFeeAmount: z.string().optional(),
  lateFeeGracePeriod: z.string().optional(),
  defaultInterestRate: z.string().optional(),

  // Early Payment
  earlyPaymentAllowed: z.boolean(),
  earlyPaymentDiscount: z.string().optional(),
  prepaymentPenalty: z.boolean(),
  prepaymentPenaltyAmount: z.string().optional(),

  // Default and Remedies
  defaultDefinition: z.string().min(1, 'Default definition is required'),
  cureperiod: z.string().optional(),
  defaultConsequences: z.string().min(1, 'Default consequences are required'),
  accelerationClause: z.boolean(),

  // Legal Terms
  governingState: z.string().min(1, 'Governing state is required'),
  disputeResolution: z.enum(['courts', 'arbitration', 'mediation']),
  attorneyFeesClause: z.boolean(),

  // Credit Reporting
  creditReporting: z.boolean(),
  creditReportingDetails: z.string().optional(),
  satisfactionReporting: z.boolean(),

  // Additional Terms
  additionalTerms: z.string().optional(),
  specialConditions: z.string().optional(),

  // Execution
  agreementDate: z.string().min(1, 'Agreement date is required'),
  creditorSignature: z.string().min(1, 'Creditor signature is required'),
  debtorSignature: z.string().min(1, 'Debtor signature is required'),
  witnessRequired: z.boolean(),
  witnessName: z.string().optional(),
  notaryRequired: z.boolean(),
});
