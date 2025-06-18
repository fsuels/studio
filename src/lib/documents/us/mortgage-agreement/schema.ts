// src/lib/documents/us/mortgage-agreement/schema.ts
import { z } from 'zod';

export const MortgageAgreementSchema = z.object({
  // Borrower Information
  borrowerName: z.string().min(1, 'Borrower name is required'),
  borrowerAddress: z.string().optional(),
  borrowerPhone: z.string().optional(),
  borrowerEmail: z.string().email().optional(),
  borrowerSSN: z.string().optional(),
  borrowerEmployment: z.string().optional(),
  borrowerIncome: z.string().optional(),
  coBorrowerName: z.string().optional(),
  coBorrowerAddress: z.string().optional(),
  coBorrowerSSN: z.string().optional(),
  
  // Lender Information
  lenderName: z.string().min(1, 'Lender name is required'),
  lenderAddress: z.string().optional(),
  lenderPhone: z.string().optional(),
  lenderLicense: z.string().optional(),
  loanOfficer: z.string().optional(),
  
  // Property Information
  propertyAddress: z.string().min(1, 'Property address is required'),
  propertyType: z.enum(['single-family', 'condo', 'townhouse', 'multi-family', 'manufactured']).default('single-family'),
  propertyValue: z.string().optional(),
  appraisedValue: z.string().optional(),
  occupancyType: z.enum(['primary', 'secondary', 'investment']).default('primary'),
  
  // Loan Details
  loanAmount: z.string().optional(),
  loanTerm: z.string().optional(),
  interestRate: z.string().optional(),
  rateType: z.enum(['fixed', 'adjustable', 'hybrid']).default('fixed'),
  paymentAmount: z.string().optional(),
  firstPaymentDate: z.string().optional(),
  maturityDate: z.string().optional(),
  
  // Down Payment
  downPayment: z.string().optional(),
  downPaymentPercent: z.string().optional(),
  downPaymentSource: z.enum(['savings', 'gift', 'sale-proceeds', 'other']).optional(),
  giftLetterRequired: z.boolean().default(false),
  
  // Loan Type
  loanType: z.enum(['conventional', 'fha', 'va', 'usda', 'jumbo', 'non-qm']).default('conventional'),
  governmentBacked: z.boolean().default(false),
  privateInsurance: z.boolean().default(false),
  pmiAmount: z.string().optional(),
  
  // Interest Rate Details
  introductoryRate: z.string().optional(),
  introductoryPeriod: z.string().optional(),
  adjustmentPeriod: z.string().optional(),
  rateCap: z.string().optional(),
  lifetimeCap: z.string().optional(),
  margin: z.string().optional(),
  index: z.string().optional(),
  
  // Payment Structure
  principalAndInterest: z.string().optional(),
  propertyTaxes: z.string().optional(),
  homeInsurance: z.string().optional(),
  hoaFees: z.string().optional(),
  totalMonthlyPayment: z.string().optional(),
  escrowAccount: z.boolean().default(true),
  
  // Prepayment
  prepaymentPenalty: z.boolean().default(false),
  prepaymentTerm: z.string().optional(),
  prepaymentAmount: z.string().optional(),
  partialPrepayment: z.boolean().default(true),
  
  // Closing Costs
  originationFee: z.string().optional(),
  appraisalFee: z.string().optional(),
  creditReportFee: z.string().optional(),
  titleInsurance: z.string().optional(),
  recordingFees: z.string().optional(),
  totalClosingCosts: z.string().optional(),
  closingCostCredits: z.string().optional(),
  
  // Insurance Requirements
  hazardInsurance: z.boolean().default(true),
  floodInsurance: z.boolean().default(false),
  insuranceCarrier: z.string().optional(),
  insuranceAmount: z.string().optional(),
  lifeInsurance: z.boolean().default(false),
  
  // Default and Remedies
  defaultTriggers: z.string().optional(),
  cureperiod: z.string().optional(),
  accelerationClause: z.boolean().default(true),
  foreclosureRights: z.boolean().default(true),
  powerOfSale: z.boolean().default(false),
  
  // Servicing
  servicingRights: z.boolean().default(true),
  servicer: z.string().optional(),
  paymentAddress: z.string().optional(),
  onlinePayments: z.boolean().default(true),
  
  // Legal Terms
  governingLaw: z.string().optional(),
  jurisdiction: z.string().optional(),
  arbitration: z.boolean().default(false),
  juryWaiver: z.boolean().default(false),
  
  // Disclosures
  truthInLending: z.boolean().default(true),
  goodFaithEstimate: z.boolean().default(true),
  respaDisclosures: z.boolean().default(true),
  privacyNotice: z.boolean().default(true),
  
  // Special Programs
  firstTimeBuyer: z.boolean().default(false),
  veteranBenefits: z.boolean().default(false),
  ruralDevelopment: z.boolean().default(false),
  energyEfficiencyProgram: z.boolean().default(false),
  
  // Quality Control
  underwritingConditions: z.string().optional(),
  postClosingConditions: z.string().optional(),
  qualityControlAudit: z.boolean().default(true),
  complianceReview: z.boolean().default(true),
  
  // Electronic Records
  electronicSignatures: z.boolean().default(true),
  digitalDocuments: z.boolean().default(true),
  onlinePortal: z.boolean().default(true),
  paperCopies: z.boolean().default(false),
  
  // Signatures
  borrowerSignature: z.boolean().default(true),
  coBorrowerSignature: z.boolean().default(false),
  lenderSignature: z.boolean().default(true),
  notarization: z.boolean().default(true),
  witnessRequired: z.boolean().default(false),
});