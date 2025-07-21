// src/lib/documents/us/arbitration-agreement/schema.ts
import { z } from 'zod';

export const ArbitrationAgreementSchema = z.object({
  // Party Information
  party1Name: z.string().min(1, 'Party 1 name is required'),
  party1Address: z.string().min(1, 'Party 1 address is required'),
  party1Type: z
    .enum(['individual', 'business', 'organization'])
    .default('individual'),
  party2Name: z.string().min(1, 'Party 2 name is required'),
  party2Address: z.string().min(1, 'Party 2 address is required'),
  party2Type: z
    .enum(['individual', 'business', 'organization'])
    .default('individual'),

  // Agreement Context
  agreementType: z
    .enum([
      'standalone',
      'part-of-contract',
      'employment',
      'consumer',
      'commercial',
    ])
    .default('standalone'),
  underlyingAgreement: z.string().optional(),
  relationshipType: z.string().optional(),
  effectiveDate: z.string().min(1, 'Effective date is required'),

  // Scope of Arbitration
  disputeScope: z
    .enum([
      'all-disputes',
      'contract-disputes',
      'specific-disputes',
      'excluding-certain-disputes',
    ])
    .default('all-disputes'),
  specificDisputes: z.array(z.string()).default([]),
  excludedDisputes: z.array(z.string()).default([]),
  futureDisputes: z.boolean().default(true),
  existingDisputes: z.boolean().default(false),

  // Types of Claims Covered
  contractClaims: z.boolean().default(true),
  tortClaims: z.boolean().default(true),
  statutoryClaims: z.boolean().default(false),
  employmentClaims: z.boolean().default(false),
  discriminationClaims: z.boolean().default(false),
  intellectualPropertyClaims: z.boolean().default(false),
  consumerProtectionClaims: z.boolean().default(false),

  // Arbitration Rules
  arbitrationRules: z
    .enum([
      'aaa-commercial',
      'aaa-consumer',
      'aaa-employment',
      'jams',
      'cpradr',
      'custom',
      'state-rules',
    ])
    .default('aaa-commercial'),
  customRules: z.string().optional(),
  rulesVersion: z.string().optional(),
  administrationOrganization: z.string().optional(),

  // Arbitrator Selection
  numberOfArbitrators: z.enum(['1', '3', 'panel']).default('1'),
  arbitratorQualifications: z.string().optional(),
  arbitratorSelection: z
    .enum([
      'mutual-agreement',
      'organization-appointment',
      'striking-method',
      'rotation-list',
    ])
    .default('organization-appointment'),
  challengeProcess: z.boolean().default(true),
  neutralArbitrator: z.boolean().default(true),

  // Location and Venue
  arbitrationLocation: z.string().min(1, 'Arbitration location is required'),
  venueSelection: z
    .enum([
      'fixed-location',
      'convenient-location',
      'party-agreement',
      'arbitrator-decision',
    ])
    .default('fixed-location'),
  virtualHearings: z.boolean().default(false),
  documentOnlyArbitration: z.boolean().default(false),

  // Language and Procedures
  arbitrationLanguage: z.string().default('English'),
  procedureRules: z.string().optional(),
  discoveryAllowed: z.boolean().default(true),
  discoveryLimitations: z.string().optional(),
  depositionsAllowed: z.boolean().default(false),
  documentProduction: z.boolean().default(true),

  // Hearing Procedures
  oralHearing: z.boolean().default(true),
  hearingDuration: z.string().optional(),
  evidenceRules: z.string().optional(),
  witnessTestimony: z.boolean().default(true),
  expertWitnesses: z.boolean().default(false),
  recordKeeping: z.boolean().default(true),

  // Costs and Fees
  costAllocation: z
    .enum([
      'each-pays-own',
      'loser-pays',
      'proportional',
      'arbitrator-decision',
    ])
    .default('each-pays-own'),
  arbitratorFees: z
    .enum([
      'shared-equally',
      'initiating-party',
      'losing-party',
      'proportional',
    ])
    .default('shared-equally'),
  administrativeFees: z
    .enum([
      'shared-equally',
      'initiating-party',
      'losing-party',
      'proportional',
    ])
    .default('initiating-party'),
  attorneyFees: z
    .enum(['each-pays-own', 'prevailing-party', 'arbitrator-decision'])
    .default('each-pays-own'),
  costAdvance: z.boolean().default(false),

  // Timing and Deadlines
  initiationDeadline: z.string().optional(),
  responseDeadline: z.string().optional(),
  completionDeadline: z.string().optional(),
  expeditedProcedures: z.boolean().default(false),
  emergencyArbitrator: z.boolean().default(false),

  // Award and Enforcement
  awardType: z
    .enum(['reasoned-award', 'standard-award', 'summary-award'])
    .default('reasoned-award'),
  awardFinality: z.boolean().default(true),
  appealRights: z.boolean().default(false),
  modificationRights: z.boolean().default(false),
  enforcementMethod: z.string().optional(),

  // Remedies Available
  monetaryDamages: z.boolean().default(true),
  equitableRelief: z.boolean().default(false),
  injunctiveRelief: z.boolean().default(false),
  specificPerformance: z.boolean().default(false),
  punitiveDamages: z.boolean().default(false),
  attorneyFeesRecovery: z.boolean().default(false),

  // Confidentiality
  confidentialityClause: z.boolean().default(true),
  hearingConfidentiality: z.boolean().default(true),
  awardConfidentiality: z.boolean().default(true),
  documentConfidentiality: z.boolean().default(true),
  publicDisclosureRestrictions: z.boolean().default(true),

  // Class Action and Collective Actions
  classActionWaiver: z.boolean().default(false),
  collectiveActionWaiver: z.boolean().default(false),
  representativeActionWaiver: z.boolean().default(false),
  consolidationAllowed: z.boolean().default(false),
  joinerAllowed: z.boolean().default(false),

  // Exceptions and Carve-outs
  smallClaimsException: z.boolean().default(false),
  smallClaimsLimit: z.string().optional(),
  emergencyReliefException: z.boolean().default(false),
  intellectualPropertyException: z.boolean().default(false),
  realPropertyException: z.boolean().default(false),

  // Pre-Arbitration Requirements
  mandatoryMediation: z.boolean().default(false),
  goodFaithNegotiation: z.boolean().default(false),
  noticeRequirement: z.boolean().default(true),
  noticeMethod: z.string().optional(),
  noticePeriod: z.string().optional(),

  // Governing Law
  governingLaw: z.string().optional(),
  arbitrationLaw: z.string().optional(),
  federalArbitrationAct: z.boolean().default(true),
  stateArbitrationLaw: z.boolean().default(false),

  // Special Provisions
  unconscionabilityDefense: z.boolean().default(false),
  separabilityClause: z.boolean().default(true),
  severabilityClause: z.boolean().default(true),
  entireAgreementClause: z.boolean().default(true),
  modificationRequirements: z.string().optional(),

  // Consumer Protections
  consumerNotifications: z.boolean().default(false),
  consumerRights: z.string().optional(),
  optOutPeriod: z.string().optional(),
  feeLimitations: z.boolean().default(false),

  // Employment Specific
  voluntaryAgreement: z.boolean().default(false),
  employmentContextNotice: z.string().optional(),
  wageClaims: z.boolean().default(false),
  workersCompensationException: z.boolean().default(false),
  unemploymentBenefitsException: z.boolean().default(false),

  // International Considerations
  internationalDisputes: z.boolean().default(false),
  treatyApplication: z.string().optional(),
  foreignEnforcement: z.boolean().default(false),
  currencySpecification: z.string().optional(),

  // Technology and Innovation
  electronicFiling: z.boolean().default(false),
  onlineDispute: z.boolean().default(false),
  artificialIntelligenceUse: z.boolean().default(false),
  blockchainEnforcement: z.boolean().default(false),

  // Multi-Tiered Dispute Resolution
  negotiationFirst: z.boolean().default(false),
  mediationFirst: z.boolean().default(false),
  arbitrationLast: z.boolean().default(true),
  escalationProcedure: z.string().optional(),

  // Signature and Execution
  requireBothSignatures: z.boolean().default(true),
  witnessRequirement: z.boolean().default(false),
  notarizationRequirement: z.boolean().default(false),
  electronicSignatureAccepted: z.boolean().default(true),
  acknowledgmentOfUnderstanding: z.boolean().default(true),
});
