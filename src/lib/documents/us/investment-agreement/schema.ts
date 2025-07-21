// src/lib/documents/us/investment-agreement/schema.ts
import { z } from 'zod';

export const InvestmentAgreementSchema = z.object({
  // Investor Information
  investorName: z.string().min(1, 'Investor name is required'),
  investorAddress: z.string().optional(),
  investorPhone: z.string().optional(),
  investorEmail: z.string().email().optional(),
  investorType: z
    .enum(['individual', 'entity', 'fund', 'trust'])
    .default('individual'),
  accreditedInvestor: z.boolean().default(false),
  investorExperience: z
    .enum(['novice', 'intermediate', 'experienced', 'professional'])
    .optional(),

  // Company/Issuer Information
  companyName: z.string().min(1, 'Company name is required'),
  companyAddress: z.string().optional(),
  companyType: z
    .enum(['corporation', 'llc', 'partnership', 'trust'])
    .default('corporation'),
  companyState: z.string().optional(),
  federalTaxId: z.string().optional(),
  businessDescription: z.string().optional(),

  // Investment Details
  investmentAmount: z.string().optional(),
  investmentType: z
    .enum(['equity', 'debt', 'convertible', 'hybrid'])
    .default('equity'),
  securityType: z
    .enum(['common-stock', 'preferred-stock', 'note', 'warrant', 'option'])
    .optional(),
  numberOfShares: z.string().optional(),
  pricePerShare: z.string().optional(),
  totalValuation: z.string().optional(),

  // Terms and Conditions
  investmentPurpose: z.string().optional(),
  useOfFunds: z.string().optional(),
  minimumInvestment: z.string().optional(),
  maximumInvestment: z.string().optional(),
  closingDate: z.string().optional(),

  // Rights and Preferences
  votingRights: z.boolean().default(true),
  liquidationPreference: z.string().optional(),
  dividendRights: z.boolean().default(false),
  preemptiveRights: z.boolean().default(false),
  antiDilutionRights: z.boolean().default(false),
  tagAlongRights: z.boolean().default(false),
  dragAlongRights: z.boolean().default(false),

  // Board and Control
  boardSeat: z.boolean().default(false),
  observerRights: z.boolean().default(false),
  informationRights: z.boolean().default(true),
  inspectionRights: z.boolean().default(false),
  approvalRights: z.string().optional(),

  // Financial Terms
  expectedReturn: z.string().optional(),
  returnType: z
    .enum(['fixed', 'variable', 'profit-sharing', 'appreciation'])
    .optional(),
  paymentSchedule: z
    .enum(['monthly', 'quarterly', 'annually', 'at-exit'])
    .optional(),
  interestRate: z.string().optional(),

  // Exit Strategy
  exitStrategy: z
    .enum(['ipo', 'acquisition', 'buyback', 'dissolution'])
    .optional(),
  exitTimeline: z.string().optional(),
  rightOfFirstRefusal: z.boolean().default(false),
  transferRestrictions: z.boolean().default(true),
  lockupPeriod: z.string().optional(),

  // Risk Factors
  riskDisclosure: z.boolean().default(true),
  riskFactors: z.string().optional(),
  noGuarantee: z.boolean().default(true),
  lossOfInvestment: z.boolean().default(true),

  // Regulatory Compliance
  securitiesExemption: z.string().optional(),
  accreditationVerification: z.boolean().default(false),
  blueSkysCompliance: z.boolean().default(true),
  federalExemption: z.string().optional(),

  // Representations and Warranties
  investorReps: z.boolean().default(true),
  companyReps: z.boolean().default(true),
  dueDiligence: z.boolean().default(true),
  financialStatements: z.boolean().default(true),

  // Conditions Precedent
  legalOpinion: z.boolean().default(false),
  auditedFinancials: z.boolean().default(false),
  boardApproval: z.boolean().default(true),
  shareholderApproval: z.boolean().default(false),
  regulatoryApproval: z.boolean().default(false),

  // Management
  managementTeam: z.string().optional(),
  keyPersonnel: z.string().optional(),
  compensationPlan: z.string().optional(),
  employmentAgreements: z.boolean().default(false),

  // Reporting and Communication
  quarterlyReports: z.boolean().default(true),
  annualReports: z.boolean().default(true),
  meetingRights: z.boolean().default(false),
  communicationMethod: z
    .enum(['email', 'mail', 'online-portal'])
    .default('email'),

  // Intellectual Property
  ipOwnership: z.string().optional(),
  ipLicensing: z.boolean().default(false),
  trademarks: z.string().optional(),
  patents: z.string().optional(),

  // Default and Remedies
  defaultEvents: z.string().optional(),
  cureRights: z.boolean().default(true),
  accelerationRights: z.boolean().default(false),
  specificPerformance: z.boolean().default(true),

  // Legal Terms
  governingLaw: z.string().optional(),
  jurisdiction: z.string().optional(),
  arbitration: z.boolean().default(false),
  attorneyFees: z.boolean().default(false),

  // Tax Considerations
  taxStructure: z.string().optional(),
  taxAdvice: z.boolean().default(false),
  withholding: z.boolean().default(false),
  taxReporting: z.boolean().default(true),

  // Amendments and Modifications
  amendmentProcess: z.string().optional(),
  majorityConsent: z.boolean().default(true),
  unanimousConsent: z.boolean().default(false),
  writtenAmendments: z.boolean().default(true),

  // Signature Requirements
  investorSignature: z.boolean().default(true),
  companySignature: z.boolean().default(true),
  notarization: z.boolean().default(false),
  witnessRequired: z.boolean().default(false),
  electronicSignature: z.boolean().default(true),
});
