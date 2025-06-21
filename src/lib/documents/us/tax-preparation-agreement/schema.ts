// src/lib/documents/us/tax-preparation-agreement/schema.ts
import { z } from 'zod';

export const TaxPreparationAgreementSchema = z.object({
  // Tax Preparer Information
  preparerName: z.string().min(1, 'Tax preparer name is required'),
  preparerBusinessName: z.string().optional(),
  preparerAddress: z.string().min(1, 'Preparer address is required'),
  preparerPhone: z.string().optional(),
  preparerEmail: z.string().email().optional(),
  preparerPTIN: z.string().optional(),
  preparerCredentials: z.string().optional(),
  preparerLicenseNumber: z.string().optional(),

  // Client Information
  clientName: z.string().min(1, 'Client name is required'),
  clientAddress: z.string().min(1, 'Client address is required'),
  clientPhone: z.string().optional(),
  clientEmail: z.string().email().optional(),
  clientSSN: z.string().optional(),
  spouseName: z.string().optional(),
  spouseSSN: z.string().optional(),

  // Tax Services Scope
  taxYear: z.string().min(1, 'Tax year is required'),
  serviceType: z.enum(['individual', 'business', 'both']).default('individual'),
  returnTypes: z.array(z.string()).default([]),
  businessEntityType: z.string().optional(),
  multipleYears: z.boolean().default(false),
  priorYearAmendments: z.boolean().default(false),

  // Service Details
  includedServices: z.array(z.string()).default([]),
  excludedServices: z.array(z.string()).default([]),
  consultationIncluded: z.boolean().default(true),
  auditSupport: z.boolean().default(false),
  bookkeepingServices: z.boolean().default(false),
  quarterlyServices: z.boolean().default(false),
  payrollServices: z.boolean().default(false),

  // Fee Structure
  feeStructure: z
    .enum(['flat-fee', 'hourly', 'per-form', 'complexity-based'])
    .default('flat-fee'),
  baseFee: z.string().optional(),
  hourlyRate: z.string().optional(),
  additionalFormFees: z.boolean().default(false),
  complexityFactors: z.array(z.string()).default([]),
  paymentSchedule: z
    .enum(['upfront', 'completion', 'split'])
    .default('completion'),

  // Additional Fees
  amendmentFee: z.string().optional(),
  extensionFee: z.string().optional(),
  auditRepresentationFee: z.string().optional(),
  consultationFee: z.string().optional(),
  lateSubmissionFee: z.string().optional(),
  rushJobFee: z.string().optional(),

  // Client Responsibilities
  accurateInformation: z.boolean().default(true),
  completeDocuments: z.boolean().default(true),
  timelyProvision: z.boolean().default(true),
  documentRetention: z.boolean().default(true),
  communicateChanges: z.boolean().default(true),
  reviewBeforeSigning: z.boolean().default(true),

  // Document Requirements
  requiredDocuments: z.array(z.string()).default([]),
  w2Forms: z.boolean().default(false),
  form1099: z.boolean().default(false),
  scheduleK1: z.boolean().default(false),
  businessRecords: z.boolean().default(false),
  receiptsRequired: z.boolean().default(false),
  bankStatements: z.boolean().default(false),

  // Preparer Responsibilities
  competentPreparation: z.boolean().default(true),
  dueDiligence: z.boolean().default(true),
  accurateCalculations: z.boolean().default(true),
  timelyFiling: z.boolean().default(true),
  confidentialityMaintenance: z.boolean().default(true),
  professionalStandards: z.boolean().default(true),

  // Filing and Deadlines
  filingDeadline: z.string().optional(),
  extensionRequests: z.boolean().default(false),
  electronicFiling: z.boolean().default(true),
  paperFiling: z.boolean().default(false),
  clientApprovalRequired: z.boolean().default(true),
  signatureRequirement: z.boolean().default(true),

  // IRS Requirements
  irsDisclosures: z.boolean().default(true),
  dueDiligenceRequirements: z.boolean().default(true),
  recordKeepingRequirements: z.boolean().default(true),
  ptinCompliance: z.boolean().default(true),
  continuingEducation: z.boolean().default(true),
  ethicalStandards: z.boolean().default(true),

  // Accuracy and Liability
  accuracyStandard: z
    .enum(['reasonable-care', 'best-efforts', 'professional-standard'])
    .default('professional-standard'),
  clientReviewRequired: z.boolean().default(true),
  preparerLiability: z
    .enum(['limited', 'fee-limitation', 'full-liability'])
    .default('limited'),
  errorsOmissionsInsurance: z.boolean().default(false),
  liabilityLimitation: z.string().optional(),

  // Penalties and Interest
  penaltyResponsibility: z
    .enum(['client', 'preparer', 'case-by-case'])
    .default('client'),
  interestResponsibility: z
    .enum(['client', 'preparer', 'case-by-case'])
    .default('client'),
  preparerPenaltyProtection: z.boolean().default(false),
  accuracyRelatedPenalties: z.string().optional(),
  fraudPenalties: z.string().optional(),

  // Confidentiality
  confidentialityClause: z.boolean().default(true),
  clientPrivilege: z.boolean().default(true),
  thirdPartyDisclosure: z.boolean().default(false),
  irsDisclosure: z.boolean().default(true),
  courtOrderDisclosure: z.boolean().default(true),
  confidentialityDuration: z.string().optional(),

  // Record Retention
  recordRetentionPeriod: z.string().optional(),
  clientRecordReturn: z.boolean().default(true),
  preparerRecordKeeping: z.boolean().default(true),
  documentDestruction: z.string().optional(),
  digitalRecords: z.boolean().default(false),
  backupProcedures: z.boolean().default(false),

  // Communications
  preferredCommunication: z
    .enum(['phone', 'email', 'in-person', 'portal'])
    .default('email'),
  responseTimeframe: z.string().optional(),
  emergencyContact: z.boolean().default(false),
  seasonalAvailability: z.string().optional(),
  clientPortalAccess: z.boolean().default(false),

  // Audit Support
  auditAssistance: z.boolean().default(false),
  auditRepresentation: z.boolean().default(false),
  auditPreparation: z.boolean().default(false),
  correspondenceHandling: z.boolean().default(false),
  auditFees: z.string().optional(),
  auditLimitations: z.string().optional(),

  // Technology and Security
  softwareUsed: z.string().optional(),
  dataEncryption: z.boolean().default(true),
  secureTransmission: z.boolean().default(true),
  cloudStorage: z.boolean().default(false),
  dataBackup: z.boolean().default(true),
  cybersecurityMeasures: z.boolean().default(true),

  // Quality Control
  reviewProcedures: z.boolean().default(true),
  secondReview: z.boolean().default(false),
  qualityAssurance: z.boolean().default(true),
  errorChecking: z.boolean().default(true),
  clientConfirmation: z.boolean().default(true),

  // Continuing Services
  nextYearServices: z.boolean().default(false),
  automaticRenewal: z.boolean().default(false),
  planningServices: z.boolean().default(false),
  quarterlyCheckins: z.boolean().default(false),
  yearRoundAvailability: z.boolean().default(false),

  // Termination
  terminationRights: z.boolean().default(true),
  terminationNotice: z.string().optional(),
  completedWorkPayment: z.boolean().default(true),
  fileTransfer: z.boolean().default(true),
  reasonsForTermination: z.array(z.string()).default([]),

  // Dispute Resolution
  disputeResolution: z
    .enum(['negotiation', 'mediation', 'arbitration', 'litigation'])
    .optional(),
  governingLaw: z.string().optional(),
  jurisdiction: z.string().optional(),
  attorneyFees: z.boolean().default(false),

  // Professional Ethics
  independenceRequirements: z.boolean().default(true),
  conflictOfInterest: z.boolean().default(true),
  professionalJudgment: z.boolean().default(true),
  clientAdvocacy: z.boolean().default(true),
  ethicalGuidelines: z.string().optional(),

  // Special Circumstances
  complexTransactions: z.boolean().default(false),
  foreignIncome: z.boolean().default(false),
  multiStateReturns: z.boolean().default(false),
  businessAcquisitions: z.boolean().default(false),
  estateIssues: z.boolean().default(false),

  // Refund Processing
  refundHandling: z
    .enum(['direct-deposit', 'check', 'client-choice'])
    .default('client-choice'),
  refundAdvance: z.boolean().default(false),
  refundLoan: z.boolean().default(false),
  bankProductFees: z.boolean().default(false),
  refundStatus: z.boolean().default(true),

  // State and Local Taxes
  stateReturns: z.boolean().default(false),
  localReturns: z.boolean().default(false),
  multipleStates: z.boolean().default(false),
  stateSpecificIssues: z.boolean().default(false),
  localTaxKnowledge: z.boolean().default(false),

  // Business Tax Specific
  businessFormSelection: z.boolean().default(false),
  depreciationSchedules: z.boolean().default(false),
  employmentTaxes: z.boolean().default(false),
  salesTaxCompliance: z.boolean().default(false),
  businessDeductions: z.boolean().default(false),

  // International Tax
  foreignAccountReporting: z.boolean().default(false),
  fatcaCompliance: z.boolean().default(false),
  treatyBenefits: z.boolean().default(false),
  foreignTaxCredits: z.boolean().default(false),
  expatTaxation: z.boolean().default(false),

  // Signature Requirements
  requirePreparerSignature: z.boolean().default(true),
  requireClientSignature: z.boolean().default(true),
  electronicSignatureAccepted: z.boolean().default(true),
  witnessRequired: z.boolean().default(false),
  notarizationRequired: z.boolean().default(false),
});
