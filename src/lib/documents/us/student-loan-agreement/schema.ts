// src/lib/documents/us/student-loan-agreement/schema.ts
import { z } from 'zod';

export const StudentLoanAgreementSchema = z.object({
  // Student/Borrower Information
  studentName: z.string().min(1, 'Student name is required'),
  studentAddress: z.string().optional(),
  studentPhone: z.string().optional(),
  studentEmail: z.string().email().optional(),
  studentSSN: z.string().optional(),
  dateOfBirth: z.string().optional(),
  citizenship: z
    .enum(['us-citizen', 'permanent-resident', 'international'])
    .default('us-citizen'),

  // Educational Institution
  schoolName: z.string().optional(),
  schoolAddress: z.string().optional(),
  schoolCode: z.string().optional(),
  degreeProgram: z.string().optional(),
  expectedGraduation: z.string().optional(),
  enrollmentStatus: z
    .enum(['full-time', 'part-time', 'less-than-half'])
    .default('full-time'),

  // Lender Information
  lenderName: z.string().min(1, 'Lender name is required'),
  lenderAddress: z.string().optional(),
  lenderPhone: z.string().optional(),
  lenderEmail: z.string().email().optional(),
  lenderLicense: z.string().optional(),

  // Loan Details
  loanAmount: z.string().optional(),
  loanPurpose: z
    .enum(['tuition', 'room-board', 'books', 'expenses', 'all-costs'])
    .default('all-costs'),
  disbursementSchedule: z
    .enum(['semester', 'quarter', 'annual', 'single'])
    .default('semester'),
  firstDisbursement: z.string().optional(),

  // Interest Rates
  interestRate: z.string().optional(),
  rateType: z.enum(['fixed', 'variable', 'hybrid']).default('fixed'),
  rateIndex: z.string().optional(),
  margin: z.string().optional(),
  rateCap: z.string().optional(),
  originationFee: z.string().optional(),

  // Repayment Terms
  repaymentTerm: z.string().optional(),
  graceperiod: z.string().optional(),
  repaymentOptions: z
    .enum(['standard', 'graduated', 'extended', 'income-driven'])
    .default('standard'),
  minimumPayment: z.string().optional(),
  maximumPayment: z.string().optional(),

  // Cosigner Information
  cosignerRequired: z.boolean().default(false),
  cosignerName: z.string().optional(),
  cosignerAddress: z.string().optional(),
  cosignerPhone: z.string().optional(),
  cosignerSSN: z.string().optional(),
  cosignerIncome: z.string().optional(),
  cosignerRelease: z.boolean().default(false),

  // Academic Requirements
  academicProgress: z.boolean().default(true),
  minimumGPA: z.string().optional(),
  enrollmentVerification: z.boolean().default(true),
  degreeCompletion: z.string().optional(),
  withdrawalPolicy: z.string().optional(),

  // Deferment and Forbearance
  inSchoolDeferment: z.boolean().default(true),
  unemploymentDeferment: z.boolean().default(true),
  economicHardship: z.boolean().default(true),
  militaryDeferment: z.boolean().default(true),
  medicalForbearance: z.boolean().default(true),

  // Default and Collections
  defaultDefinition: z.string().optional(),
  cureperiod: z.string().optional(),
  collectionAgency: z.boolean().default(true),
  creditReporting: z.boolean().default(true),
  garnishmentRights: z.boolean().default(true),

  // Prepayment
  prepaymentPenalty: z.boolean().default(false),
  partialPrepayment: z.boolean().default(true),
  prepaymentApplication: z
    .enum(['principal', 'interest-first', 'proportional'])
    .default('principal'),

  // Federal Benefits
  federalLoanComparison: z.boolean().default(true),
  pellGrantEligibility: z.boolean().default(false),
  workStudyEligibility: z.boolean().default(false),
  fafsaRequired: z.boolean().default(true),

  // Income-Driven Repayment
  incomeVerification: z.boolean().default(false),
  annualRecertification: z.boolean().default(false),
  familySizeVerification: z.boolean().default(false),
  paymentCap: z.string().optional(),

  // Death and Disability
  deathDischarge: z.boolean().default(true),
  totalDisabilityDischarge: z.boolean().default(true),
  dischargeProcedures: z.string().optional(),
  beneficiaryRights: z.string().optional(),

  // School Closure
  schoolClosureDischarge: z.boolean().default(true),
  falseRepresentation: z.boolean().default(true),
  unpaidRefunds: z.boolean().default(true),
  transferCredits: z.string().optional(),

  // Loan Servicing
  servicerName: z.string().optional(),
  servicerContact: z.string().optional(),
  servicerTransfer: z.boolean().default(true),
  customerService: z.boolean().default(true),
  onlineAccess: z.boolean().default(true),

  // Communications
  electronicDelivery: z.boolean().default(true),
  contactInformation: z.boolean().default(true),
  notificationMethods: z.string().optional(),
  languagePreferences: z
    .enum(['english', 'spanish', 'other'])
    .default('english'),

  // Credit and Financial
  creditCheck: z.boolean().default(true),
  creditScore: z.string().optional(),
  incomeRequirements: z.string().optional(),
  debtToIncomeRatio: z.string().optional(),
  financialCounseling: z.boolean().default(true),

  // Legal and Regulatory
  truthInLending: z.boolean().default(true),
  rightToCancelPeriod: z.string().optional(),
  stateRegulations: z.boolean().default(true),
  consumerProtections: z.boolean().default(true),

  // Technology and Access
  mobileApp: z.boolean().default(true),
  automaticPaymentDiscount: z.string().optional(),
  paperlessDiscount: z.string().optional(),
  loyaltyBenefits: z.string().optional(),

  // International Students
  visaRequirements: z.string().optional(),
  internationalCosigner: z.boolean().default(false),
  currencyConversion: z.boolean().default(false),
  deportationPolicy: z.string().optional(),

  // Career Services
  jobPlacementAssistance: z.boolean().default(false),
  careerCounseling: z.boolean().default(false),
  internshipSupport: z.boolean().default(false),
  networkingOpportunities: z.boolean().default(false),

  // Refinancing and Consolidation
  refinancingOptions: z.boolean().default(true),
  consolidationEligibility: z.boolean().default(true),
  rateReductionPrograms: z.string().optional(),
  loyaltyDiscounts: z.string().optional(),

  // Emergency Provisions
  pandemicProvisions: z.boolean().default(true),
  naturalDisasterRelief: z.boolean().default(true),
  emergencyContacts: z.string().optional(),
  financialEmergency: z.string().optional(),

  // Tax Implications
  taxDeductibility: z.boolean().default(true),
  form1098e: z.boolean().default(true),
  taxWithholding: z.boolean().default(false),
  internationalTax: z.boolean().default(false),

  // Dispute Resolution
  disputeResolution: z
    .enum(['arbitration', 'mediation', 'court'])
    .default('arbitration'),
  governingLaw: z.string().optional(),
  jurisdiction: z.string().optional(),
  classActionWaiver: z.boolean().default(true),

  // Signature Requirements
  studentSignature: z.boolean().default(true),
  cosignerSignature: z.boolean().default(false),
  parentSignature: z.boolean().default(false),
  witnessSignature: z.boolean().default(false),
  notarization: z.boolean().default(false),
  electronicSignature: z.boolean().default(true),
});
