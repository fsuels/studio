// src/lib/documents/us/startup-equity-agreement/schema.ts
import { z } from 'zod';

export const StartupEquityAgreementSchema = z.object({
  // Company Information
  companyName: z.string().min(1, 'Company name is required'),
  companyType: z
    .enum(['corporation', 'llc', 'partnership'])
    .default('corporation'),
  incorporationState: z.string().optional(),
  incorporationDate: z.string().optional(),
  federalTaxId: z.string().optional(),
  businessAddress: z.string().optional(),

  // Founder Information
  founder1Name: z.string().min(1, 'Founder 1 name is required'),
  founder1Address: z.string().optional(),
  founder1Email: z.string().email().optional(),
  founder1Role: z.string().optional(),
  founder1Equity: z.string().optional(),

  founder2Name: z.string().optional(),
  founder2Address: z.string().optional(),
  founder2Email: z.string().email().optional(),
  founder2Role: z.string().optional(),
  founder2Equity: z.string().optional(),

  founder3Name: z.string().optional(),
  founder3Address: z.string().optional(),
  founder3Email: z.string().email().optional(),
  founder3Role: z.string().optional(),
  founder3Equity: z.string().optional(),

  // Equity Structure
  totalShares: z.string().optional(),
  shareClass: z.enum(['common', 'preferred', 'mixed']).default('common'),
  parValue: z.string().optional(),
  equityPool: z.string().optional(),
  vestingSchedule: z
    .enum(['4-year-cliff', '3-year-cliff', 'immediate', 'custom'])
    .default('4-year-cliff'),

  // Vesting Terms
  vestingStart: z.string().optional(),
  cliffPeriod: z.string().optional(),
  vestingFrequency: z
    .enum(['monthly', 'quarterly', 'annually'])
    .default('monthly'),
  accelerationTrigger: z
    .enum(['termination', 'acquisition', 'ipo', 'none'])
    .default('none'),

  // Investment Terms
  initialCapital: z.string().optional(),
  capitalContributions: z.string().optional(),
  futureRounds: z.boolean().default(true),
  dilutionProtection: z.boolean().default(false),
  preemptiveRights: z.boolean().default(true),

  // Roles and Responsibilities
  ceoRole: z.string().optional(),
  ctoRole: z.string().optional(),
  cfoRole: z.string().optional(),
  boardComposition: z.string().optional(),
  decisionMaking: z
    .enum(['unanimous', 'majority', 'weighted'])
    .default('majority'),

  // Intellectual Property
  ipAssignment: z.boolean().default(true),
  inventionAssignment: z.boolean().default(true),
  confidentiality: z.boolean().default(true),
  nonCompete: z.boolean().default(false),
  nonSolicit: z.boolean().default(true),

  // Employment Terms
  founderSalary: z.string().optional(),
  benefitsPackage: z.boolean().default(false),
  vacationPolicy: z.string().optional(),
  terminationClauses: z.string().optional(),

  // Transfer Restrictions
  transferRestrictions: z.boolean().default(true),
  rightOfFirstRefusal: z.boolean().default(true),
  tagAlongRights: z.boolean().default(true),
  dragAlongRights: z.boolean().default(true),

  // Death and Disability
  deathProvisions: z.string().optional(),
  disabilityProvisions: z.string().optional(),
  buyoutMechanism: z
    .enum(['fair-value', 'book-value', 'formula', 'appraisal'])
    .optional(),
  insurance: z.boolean().default(false),

  // Dispute Resolution
  disputeResolution: z
    .enum(['mediation', 'arbitration', 'court'])
    .default('mediation'),
  governingLaw: z.string().optional(),
  jurisdiction: z.string().optional(),
  attorneyFees: z.boolean().default(false),

  // Business Operations
  businessPlan: z.boolean().default(false),
  budgetApproval: z.boolean().default(true),
  bankAccounts: z.string().optional(),
  signatoryRights: z.string().optional(),

  // Reporting and Transparency
  financialReporting: z
    .enum(['monthly', 'quarterly', 'annually'])
    .default('quarterly'),
  meetingFrequency: z
    .enum(['weekly', 'monthly', 'quarterly'])
    .default('monthly'),
  informationRights: z.boolean().default(true),
  auditRights: z.boolean().default(false),

  // Exit Strategy
  exitStrategy: z
    .enum(['ipo', 'acquisition', 'buyout', 'dissolution'])
    .optional(),
  exitTimeline: z.string().optional(),
  liquidationPreference: z.string().optional(),
  participationRights: z.boolean().default(false),

  // Competitive Activities
  nonCompetePeriod: z.string().optional(),
  nonSolicitPeriod: z.string().optional(),
  competitiveActivities: z.string().optional(),
  exceptions: z.string().optional(),

  // Amendment and Termination
  amendmentProcess: z.string().optional(),
  terminationTriggers: z.string().optional(),
  windUpProcedure: z.string().optional(),
  finalDistribution: z.string().optional(),

  // Tax Elections
  section83b: z.boolean().default(false),
  taxElections: z.string().optional(),
  taxAdvisor: z.boolean().default(false),
  withholding: z.boolean().default(false),

  // Legal Compliance
  securitiesCompliance: z.boolean().default(true),
  stateCompliance: z.boolean().default(true),
  federalCompliance: z.boolean().default(true),
  internationalCompliance: z.boolean().default(false),

  // Special Provisions
  specialProvisions: z.string().optional(),
  customTerms: z.string().optional(),
  amendments: z.string().optional(),
  schedules: z.string().optional(),

  // Signature Requirements
  founderSignatures: z.boolean().default(true),
  boardApproval: z.boolean().default(false),
  shareholderApproval: z.boolean().default(false),
  notarization: z.boolean().default(false),
  witnessRequired: z.boolean().default(false),
});
