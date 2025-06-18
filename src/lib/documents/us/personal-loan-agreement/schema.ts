// src/lib/documents/us/personal-loan-agreement/schema.ts
import { z } from 'zod';

export const PersonalLoanAgreementSchema = z.object({
  // Lender Information
  lenderName: z.string().min(1, 'Lender name is required'),
  lenderAddress: z.string().min(1, 'Lender address is required'),
  lenderPhone: z.string().optional(),
  lenderEmail: z.string().email().optional(),
  
  // Borrower Information
  borrowerName: z.string().min(1, 'Borrower name is required'),
  borrowerAddress: z.string().min(1, 'Borrower address is required'),
  borrowerPhone: z.string().optional(),
  borrowerEmail: z.string().email().optional(),
  borrowerSSN: z.string().optional(),
  
  // Co-borrower Information
  hasCoBorrower: z.boolean().default(false),
  coBorrowerName: z.string().optional(),
  coBorrowerAddress: z.string().optional(),
  coBorrowerSSN: z.string().optional(),
  
  // Loan Details
  loanAmount: z.string().min(1, 'Loan amount is required'),
  loanPurpose: z.string().min(1, 'Loan purpose is required'),
  loanDate: z.string().min(1, 'Loan date is required'),
  
  // Interest and Terms
  interestRate: z.string().min(1, 'Interest rate is required'),
  interestType: z.enum(['fixed', 'variable']),
  compoundingFrequency: z.enum(['daily', 'monthly', 'quarterly', 'annually']),
  
  // Repayment Terms
  loanTerm: z.string().min(1, 'Loan term is required'),
  paymentAmount: z.string().min(1, 'Payment amount is required'),
  paymentFrequency: z.enum(['weekly', 'bi-weekly', 'monthly', 'quarterly']),
  firstPaymentDate: z.string().min(1, 'First payment date is required'),
  maturityDate: z.string().min(1, 'Maturity date is required'),
  
  // Payment Method
  paymentMethod: z.enum(['check', 'bank-transfer', 'automatic-deduction', 'cash', 'other']),
  accountDetails: z.string().optional(),
  
  // Late Fees and Penalties
  lateFee: z.boolean().default(true),
  lateFeeAmount: z.string().optional(),
  gracePeriod: z.string().optional(),
  defaultInterestRate: z.string().optional(),
  
  // Prepayment
  prepaymentAllowed: z.boolean().default(true),
  prepaymentPenalty: z.boolean().default(false),
  prepaymentPenaltyAmount: z.string().optional(),
  
  // Security/Collateral
  isSecured: z.boolean().default(false),
  collateralDescription: z.string().optional(),
  collateralValue: z.string().optional(),
  
  // Guarantor
  hasGuarantor: z.boolean().default(false),
  guarantorName: z.string().optional(),
  guarantorAddress: z.string().optional(),
  guarantorSSN: z.string().optional(),
  
  // Default and Acceleration
  defaultClause: z.boolean().default(true),
  accelerationClause: z.boolean().default(true),
  curePeriod: z.string().optional(),
  
  // Insurance Requirements
  requireInsurance: z.boolean().default(false),
  insuranceType: z.string().optional(),
  insuranceBeneficiary: z.string().optional(),
  
  // Legal Provisions
  governingLaw: z.string().optional(),
  jurisdiction: z.string().optional(),
  attorneyFees: z.boolean().default(true),
  
  // Additional Terms
  creditCheck: z.boolean().default(false),
  incomeVerification: z.boolean().default(false),
  useLimitations: z.string().optional(),
  transferRestrictions: z.boolean().default(true),
  
  // Tax Implications
  taxResponsibility: z.enum(['borrower', 'lender', 'both']).default('borrower'),
  form1099Required: z.boolean().default(false),
  
  // Modification and Assignment
  modificationClause: z.boolean().default(true),
  assignmentAllowed: z.boolean().default(false),
  
  // Notices
  noticeAddress: z.string().optional(),
  noticeMethod: z.enum(['mail', 'email', 'both']).default('mail'),
  
  // Signatures and Notarization
  requireBorrowerSignature: z.boolean().default(true),
  requireLenderSignature: z.boolean().default(true),
  requireNotarization: z.boolean().default(true),
  requireWitnessSignature: z.boolean().default(false),
});