// src/lib/documents/us/loan-modification-agreement/schema.ts
import { z } from 'zod';

export const LoanModificationAgreementSchema = z.object({
  // Original Loan Information
  originalLoanDate: z.string().min(1, 'Original loan date is required'),
  originalLoanAmount: z.string().min(1, 'Original loan amount is required'),
  originalInterestRate: z.string().min(1, 'Original interest rate is required'),
  currentBalance: z.string().min(1, 'Current balance is required'),
  
  // Lender Information
  lenderName: z.string().min(1, 'Lender name is required'),
  lenderAddress: z.string().min(1, 'Lender address is required'),
  
  // Borrower Information
  borrowerName: z.string().min(1, 'Borrower name is required'),
  borrowerAddress: z.string().min(1, 'Borrower address is required'),
  
  // Modification Details
  modificationDate: z.string().min(1, 'Modification date is required'),
  effectiveDate: z.string().min(1, 'Effective date is required'),
  
  // Payment Modifications
  modifyPaymentAmount: z.boolean().default(false),
  newPaymentAmount: z.string().optional(),
  modifyPaymentSchedule: z.boolean().default(false),
  newPaymentFrequency: z.enum(['weekly', 'bi-weekly', 'monthly', 'quarterly']).optional(),
  
  // Interest Rate Modifications
  modifyInterestRate: z.boolean().default(false),
  newInterestRate: z.string().optional(),
  newInterestType: z.enum(['fixed', 'variable']).optional(),
  
  // Term Modifications
  modifyLoanTerm: z.boolean().default(false),
  newMaturityDate: z.string().optional(),
  extendTerm: z.boolean().default(false),
  termExtension: z.string().optional(),
  
  // Principal Modifications
  modifyPrincipal: z.boolean().default(false),
  principalReduction: z.string().optional(),
  principalIncrease: z.string().optional(),
  principalForgiveness: z.string().optional(),
  
  // Payment Deferrals
  includePaymentDeferral: z.boolean().default(false),
  deferralPeriod: z.string().optional(),
  deferredAmount: z.string().optional(),
  deferralTerms: z.string().optional(),
  
  // Forbearance Terms
  includeForbearance: z.boolean().default(false),
  forbearancePeriod: z.string().optional(),
  forbearanceTerms: z.string().optional(),
  
  // Late Fee Modifications
  modifyLateFees: z.boolean().default(false),
  waiveExistingLateFees: z.boolean().default(false),
  newLateFeeStructure: z.string().optional(),
  
  // Default Cure
  cureExistingDefault: z.boolean().default(false),
  defaultAmount: z.string().optional(),
  cureConditions: z.string().optional(),
  
  // Collateral Modifications
  modifyCollateral: z.boolean().default(false),
  addCollateral: z.string().optional(),
  releaseCollateral: z.string().optional(),
  substituteCollateral: z.string().optional(),
  
  // Additional Terms
  capitalizeInterest: z.boolean().default(false),
  capitalizedAmount: z.string().optional(),
  waivePrepaymentPenalty: z.boolean().default(false),
  
  // Conditions Precedent
  conditionsPrecedent: z.array(z.string()).default([]),
  documentsRequired: z.array(z.string()).default([]),
  
  // Borrower Representations
  currentOnOtherDebts: z.boolean().default(true),
  noMaterialChange: z.boolean().default(true),
  authorizedToModify: z.boolean().default(true),
  
  // Lender Concessions
  lenderConcessions: z.string().optional(),
  concessionConditions: z.string().optional(),
  
  // Compliance Requirements
  remainInCompliance: z.boolean().default(true),
  additionalCovenants: z.array(z.string()).default([]),
  
  // Legal Provisions
  governingLaw: z.string().optional(),
  attorneyFees: z.boolean().default(true),
  entireAgreement: z.boolean().default(true),
  
  // Future Modifications
  noFurtherModifications: z.boolean().default(false),
  additionalModificationRights: z.string().optional(),
  
  // Recording and Filing
  recordModification: z.boolean().default(false),
  filingRequirements: z.string().optional(),
  
  // Ratification
  ratifyOriginalLoan: z.boolean().default(true),
  confirmSecurityInterest: z.boolean().default(true),
  
  // Execution Requirements
  requireBorrowerSignature: z.boolean().default(true),
  requireLenderSignature: z.boolean().default(true),
  requireNotarization: z.boolean().default(true),
  requireWitnessSignature: z.boolean().default(false),
});