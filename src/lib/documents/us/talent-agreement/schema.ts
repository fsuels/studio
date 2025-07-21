// src/lib/documents/us/talent-agreement/schema.ts
import { z } from 'zod';

export const TalentAgreementSchema = z.object({
  // Talent Information
  talentName: z.string().min(1, 'Talent name is required'),
  talentStageName: z.string().optional(),
  talentAddress: z.string().min(1, 'Talent address is required'),
  talentPhone: z.string().optional(),
  talentEmail: z.string().email().optional(),
  talentAgent: z.string().optional(),

  // Company/Producer Information
  companyName: z.string().min(1, 'Company name is required'),
  companyAddress: z.string().min(1, 'Company address is required'),
  companyPhone: z.string().optional(),
  companyEmail: z.string().email().optional(),
  producerName: z.string().optional(),

  // Project Details
  projectTitle: z.string().min(1, 'Project title is required'),
  projectType: z
    .enum(['film', 'television', 'commercial', 'music', 'theater', 'digital'])
    .default('film'),
  projectDescription: z.string().optional(),
  productionCompany: z.string().optional(),
  roleDescription: z.string().optional(),

  // Performance Details
  performanceType: z
    .enum(['acting', 'singing', 'dancing', 'modeling', 'voice-over', 'hosting'])
    .default('acting'),
  characterName: z.string().optional(),
  principalRole: z.boolean().default(false),
  speakingRole: z.boolean().default(true),
  stuntsRequired: z.boolean().default(false),

  // Schedule and Timeline
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  productionDates: z.string().optional(),
  rehearsalDates: z.string().optional(),
  availabilityRequired: z.string().optional(),
  exclusivityPeriod: z.string().optional(),

  // Compensation
  compensationType: z
    .enum(['flat-fee', 'daily-rate', 'hourly', 'residuals', 'percentage'])
    .default('flat-fee'),
  totalCompensation: z.string().optional(),
  dailyRate: z.string().optional(),
  hourlyRate: z.string().optional(),
  minimumGuarantee: z.string().optional(),

  // Payment Schedule
  paymentSchedule: z
    .enum(['upfront', 'completion', 'installments', 'per-day'])
    .default('completion'),
  advancePayment: z.string().optional(),
  finalPayment: z.string().optional(),
  expenseReimbursement: z.boolean().default(false),

  // Residuals and Royalties
  residualsIncluded: z.boolean().default(false),
  residualPercentage: z.string().optional(),
  royaltyRights: z.boolean().default(false),
  merchandisingRights: z.boolean().default(false),

  // Rights and Usage
  imageRights: z.boolean().default(true),
  voiceRights: z.boolean().default(true),
  likeness: z.boolean().default(true),
  publicityRights: z.boolean().default(true),
  merchandising: z.boolean().default(false),
  endorsementRights: z.boolean().default(false),

  // Media Usage
  theatricalRights: z.boolean().default(true),
  televisionRights: z.boolean().default(true),
  streamingRights: z.boolean().default(true),
  internationalRights: z.boolean().default(false),
  digitalRights: z.boolean().default(true),

  // Credit and Billing
  creditRequired: z.boolean().default(true),
  creditPosition: z.string().optional(),
  creditSize: z.string().optional(),
  nameAboveTitle: z.boolean().default(false),
  singleCard: z.boolean().default(false),

  // Professional Services
  makeupProvided: z.boolean().default(true),
  wardrobeProvided: z.boolean().default(true),
  transportationProvided: z.boolean().default(false),
  accommodationProvided: z.boolean().default(false),
  meals: z.boolean().default(true),

  // Health and Safety
  medicalExamRequired: z.boolean().default(false),
  insuranceProvided: z.boolean().default(true),
  safetyProtocols: z.boolean().default(true),
  covidProtocols: z.boolean().default(false),

  // Exclusivity and Restrictions
  exclusiveServices: z.boolean().default(false),
  competingProjects: z.boolean().default(true),
  moralityClause: z.boolean().default(true),
  socialMediaRestrictions: z.string().optional(),

  // Intellectual Property
  workForHire: z.boolean().default(true),
  copyrightOwnership: z
    .enum(['company', 'talent', 'shared'])
    .default('company'),
  derivativeWorks: z.boolean().default(true),

  // Confidentiality
  confidentialityClause: z.boolean().default(true),
  ndaRequired: z.boolean().default(true),
  publicityRestrictions: z.string().optional(),

  // Termination
  terminationConditions: z.string().optional(),
  forceMarjeure: z.boolean().default(true),
  replacementRights: z.boolean().default(true),

  // Union and Guild
  unionMember: z.boolean().default(false),
  guildRequirements: z.string().optional(),
  unionScale: z.boolean().default(false),

  // Legal Terms
  governingLaw: z.string().optional(),
  jurisdiction: z.string().optional(),
  disputeResolution: z
    .enum(['negotiation', 'mediation', 'arbitration'])
    .optional(),

  // Signature Requirements
  requireTalentSignature: z.boolean().default(true),
  requireCompanySignature: z.boolean().default(true),
  requireAgentSignature: z.boolean().default(false),
  witnessRequired: z.boolean().default(false),
  notarizationRequired: z.boolean().default(false),
  electronicSignatureAccepted: z.boolean().default(true),
});
