import { z } from 'zod';

export const schema = z.object({
  // Company Information
  companyName: z.string().min(1, 'Company name is required'),

  // Employee Information
  employeeName: z.string().min(1, 'Employee name is required'),
  employeeId: z.string().optional(),
  socialSecurityNumber: z.string().min(1, 'Social Security Number is required'),

  // Bank Information
  bankName: z.string().min(1, 'Bank name is required'),
  bankAddress: z.string().min(1, 'Bank address is required'),
  routingNumber: z.string().min(1, 'Routing number is required'),
  accountNumber: z.string().min(1, 'Account number is required'),
  accountType: z.enum(['Checking', 'Savings']),

  // Deposit Instructions
  depositType: z.enum(['Full amount', 'Partial amount', 'Split deposit']),
  depositAmount: z.string().optional(),
  depositPercentage: z.string().optional(),

  // Secondary Account (for split deposits)
  secondaryAccount: z.boolean(),
  secondaryBankName: z.string().optional(),
  secondaryRoutingNumber: z.string().optional(),
  secondaryAccountNumber: z.string().optional(),
  secondaryAccountType: z.enum(['Checking', 'Savings']).optional(),
  secondaryDepositAmount: z.string().optional(),

  // Authorization
  effectiveDate: z.string().min(1, 'Effective date is required'),
  authorizationStatement: z.boolean().default(true),

  // Signatures
  signatureDate: z.string().min(1, 'Signature date is required'),
});
