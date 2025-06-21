// src/lib/documents/us/retirement-plan-agreement/schema.ts
import { z } from 'zod';

export const RetirementPlanAgreementSchema = z.object({
  // Employee Information
  employeeName: z.string().min(1, 'Employee name is required'),
  employeeAddress: z.string().optional(),
  employeeSSN: z.string().optional(),
  employeeID: z.string().optional(),
  dateOfBirth: z.string().optional(),
  hireDate: z.string().optional(),
  department: z.string().optional(),

  // Employer Information
  employerName: z.string().min(1, 'Employer name is required'),
  employerAddress: z.string().optional(),
  employerTaxID: z.string().optional(),
  planAdministrator: z.string().optional(),
  hrContact: z.string().optional(),

  // Plan Information
  planName: z.string().optional(),
  planType: z
    .enum([
      '401k',
      '403b',
      '457',
      'pension',
      'profit-sharing',
      'sep-ira',
      'simple-ira',
    ])
    .default('401k'),
  planNumber: z.string().optional(),
  planYear: z.string().optional(),
  effectiveDate: z.string().optional(),

  // Eligibility
  eligibilityRequirements: z.string().optional(),
  waitingPeriod: z.string().optional(),
  ageRequirement: z.string().optional(),
  serviceRequirement: z.string().optional(),
  eligibilityDate: z.string().optional(),

  // Contribution Information
  employeeContribution: z.string().optional(),
  employeeContributionPercent: z.string().optional(),
  employerMatch: z.string().optional(),
  employerMatchPercent: z.string().optional(),
  matchingFormula: z.string().optional(),

  // Contribution Limits
  annualLimit: z.string().optional(),
  catchUpContribution: z.string().optional(),
  catchUpEligible: z.boolean().default(false),
  hardshipWithdrawal: z.boolean().default(true),
  loanOption: z.boolean().default(true),

  // Vesting Schedule
  vestingSchedule: z.enum(['immediate', 'graded', 'cliff']).default('graded'),
  vestingPeriod: z.string().optional(),
  cliffVesting: z.string().optional(),
  gradedVesting: z.string().optional(),

  // Investment Options
  investmentOptions: z.string().optional(),
  defaultInvestment: z.string().optional(),
  selfDirected: z.boolean().default(false),
  targetDateFunds: z.boolean().default(true),
  brokerageWindow: z.boolean().default(false),

  // Distribution Options
  retirementAge: z.string().optional(),
  earlyRetirement: z.string().optional(),
  distributionMethods: z.string().optional(),
  minimumDistribution: z.boolean().default(true),
  rolloverOptions: z.boolean().default(true),

  // Beneficiary Information
  primaryBeneficiary: z.string().optional(),
  primaryBeneficiaryPercent: z.string().optional(),
  contingentBeneficiary: z.string().optional(),
  contingentBeneficiaryPercent: z.string().optional(),
  spousalConsent: z.boolean().default(false),

  // Plan Features
  automaticEnrollment: z.boolean().default(false),
  automaticEscalation: z.boolean().default(false),
  roths403b: z.boolean().default(false),
  afterTaxContributions: z.boolean().default(false),

  // Fees and Expenses
  administrativeFees: z.string().optional(),
  investmentFees: z.string().optional(),
  recordkeepingFees: z.string().optional(),
  transactionFees: z.string().optional(),
  feeDisclosure: z.boolean().default(true),

  // Compliance
  erisa: z.boolean().default(true),
  nondiscrimination: z.boolean().default(true),
  topHeavy: z.boolean().default(false),
  auditRequirement: z.boolean().default(false),

  // Plan Administration
  recordkeeper: z.string().optional(),
  trustee: z.string().optional(),
  investmentAdvisor: z.string().optional(),
  thirdPartyAdministrator: z.string().optional(),

  // Communication
  planDocuments: z.boolean().default(true),
  summaryPlanDescription: z.boolean().default(true),
  quarterlyStatements: z.boolean().default(true),
  onlineAccess: z.boolean().default(true),
  mobileApp: z.boolean().default(false),

  // Termination Provisions
  terminationVesting: z.boolean().default(true),
  forfeiture: z.string().optional(),
  distributionOptions: z.string().optional(),
  cashOut: z.boolean().default(true),

  // Special Provisions
  militaryService: z.boolean().default(true),
  qdrp: z.boolean().default(true),
  domesticRelations: z.boolean().default(true),
  bankruptcy: z.string().optional(),

  // Tax Information
  pretaxContributions: z.boolean().default(true),
  rothContributions: z.boolean().default(false),
  taxWithholding: z.boolean().default(true),
  taxReporting: z.boolean().default(true),

  // Rollover Information
  rolloverFrom: z.string().optional(),
  rolloverAmount: z.string().optional(),
  directRollover: z.boolean().default(true),
  indirectRollover: z.boolean().default(false),

  // Plan Amendments
  amendmentRights: z.boolean().default(true),
  amendmentNotice: z.string().optional(),
  participantConsent: z.boolean().default(false),
  retroactiveAmendments: z.boolean().default(false),

  // Dispute Resolution
  claimsProcedure: z.boolean().default(true),
  appeals: z.boolean().default(true),
  arbitration: z.boolean().default(false),
  fiduciaryInsurance: z.boolean().default(true),

  // Electronic Services
  electronicDelivery: z.boolean().default(true),
  onlineEnrollment: z.boolean().default(true),
  mobileDeposits: z.boolean().default(false),
  textNotifications: z.boolean().default(false),

  // Signature Requirements
  employeeSignature: z.boolean().default(true),
  spouseSignature: z.boolean().default(false),
  witnessSignature: z.boolean().default(false),
  notarization: z.boolean().default(false),
  electronicSignature: z.boolean().default(true),
});
