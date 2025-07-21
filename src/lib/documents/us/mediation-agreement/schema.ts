// src/lib/documents/us/mediation-agreement/schema.ts
import { z } from 'zod';

export const MediationAgreementSchema = z.object({
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
  additionalParties: z.array(z.string()).default([]),

  // Dispute Information
  disputeDescription: z.string().min(1, 'Dispute description is required'),
  disputeType: z
    .enum([
      'contract',
      'employment',
      'family',
      'commercial',
      'personal-injury',
      'property',
      'other',
    ])
    .default('contract'),
  disputeValue: z.string().optional(),
  disputeDate: z.string().optional(),
  relationshipContext: z.string().optional(),

  // Mediation Process
  mediationType: z
    .enum([
      'voluntary',
      'court-ordered',
      'contractual-requirement',
      'pre-litigation',
    ])
    .default('voluntary'),
  mediationGoal: z
    .enum([
      'settlement',
      'communication',
      'relationship-repair',
      'understanding',
    ])
    .default('settlement'),
  mediationFormat: z
    .enum(['in-person', 'virtual', 'hybrid', 'shuttle'])
    .default('in-person'),
  sessionStructure: z
    .enum(['single-session', 'multiple-sessions', 'open-ended'])
    .default('single-session'),

  // Mediator Information
  mediatorSelection: z
    .enum([
      'mutual-agreement',
      'organization-appointment',
      'rotation-list',
      'named-mediator',
    ])
    .default('mutual-agreement'),
  namedMediator: z.string().optional(),
  mediatorQualifications: z.string().optional(),
  mediatorExperience: z.string().optional(),
  mediatorSpecialization: z.string().optional(),

  // Mediation Organization
  mediationOrganization: z.string().optional(),
  organizationRules: z.boolean().default(false),
  administrationFees: z.boolean().default(false),
  organizationFacilities: z.boolean().default(false),

  // Location and Timing
  mediationLocation: z.string().min(1, 'Mediation location is required'),
  locationSelection: z
    .enum([
      'fixed-location',
      'neutral-location',
      'rotating-location',
      'virtual-only',
    ])
    .default('neutral-location'),
  schedulingMethod: z
    .enum([
      'mutual-agreement',
      'mediator-availability',
      'organization-scheduling',
    ])
    .default('mutual-agreement'),
  timeframe: z.string().optional(),
  sessionDuration: z.string().optional(),

  // Participation Requirements
  principalAttendance: z.boolean().default(true),
  attorneyAttendance: z
    .enum(['required', 'optional', 'prohibited', 'advisory-only'])
    .default('optional'),
  decisionMakingAuthority: z.boolean().default(true),
  preparationRequirements: z.string().optional(),
  documentExchange: z.boolean().default(false),

  // Confidentiality
  confidentialityClause: z.boolean().default(true),
  mediatorConfidentiality: z.boolean().default(true),
  partyConfidentiality: z.boolean().default(true),
  documentConfidentiality: z.boolean().default(true),
  communicationConfidentiality: z.boolean().default(true),
  futureDisclosureProhibition: z.boolean().default(true),

  // Privileged Communications
  mediationPrivilege: z.boolean().default(true),
  settlementPrivilege: z.boolean().default(true),
  withoutPrejudice: z.boolean().default(true),
  inadmissibilityClause: z.boolean().default(true),
  exceptionToPrivilege: z.string().optional(),

  // Information Sharing
  caucusConfidentiality: z.boolean().default(true),
  jointSessionSharing: z.boolean().default(false),
  expertInformation: z.boolean().default(false),
  financialDisclosure: z.boolean().default(false),
  documentProduction: z.boolean().default(false),

  // Good Faith Participation
  goodFaithRequirement: z.boolean().default(true),
  preparationStandard: z.string().optional(),
  participationStandard: z.string().optional(),
  communicationStandard: z.string().optional(),
  considerationStandard: z.string().optional(),

  // Mediation Rules
  groundRules: z.array(z.string()).default([]),
  communicationRules: z.string().optional(),
  behaviorStandards: z.string().optional(),
  timeManagement: z.string().optional(),
  breakProcedures: z.string().optional(),

  // Cost and Fee Allocation
  costSharing: z
    .enum([
      'equal-split',
      'proportional',
      'initiating-party',
      'ability-to-pay',
      'other',
    ])
    .default('equal-split'),
  mediatorFees: z
    .enum(['hourly', 'daily', 'flat-fee', 'sliding-scale'])
    .default('hourly'),
  feeAmount: z.string().optional(),
  expenseSharing: z.boolean().default(true),
  paymentSchedule: z.string().optional(),

  // Settlement Authority
  settlementAuthority: z.boolean().default(true),
  approvalRequirements: z.string().optional(),
  ratificationProcess: z.string().optional(),
  bindingCommitments: z.boolean().default(false),
  tentativeAgreements: z.boolean().default(true),

  // Documentation
  sessionRecords: z.boolean().default(false),
  agreementDocumentation: z.boolean().default(true),
  draftingResponsibility: z
    .enum(['mediator', 'parties', 'attorneys', 'mutual'])
    .default('parties'),
  legalReview: z.boolean().default(false),
  executionRequirements: z.string().optional(),

  // Termination
  terminationRights: z.boolean().default(true),
  terminationNotice: z.string().optional(),
  impasseDeclaration: z.boolean().default(true),
  continuationOptions: z.string().optional(),
  alternativeProcesses: z.string().optional(),

  // Follow-up Procedures
  implementationSupport: z.boolean().default(false),
  complianceMonitoring: z.boolean().default(false),
  modificationProcess: z.boolean().default(false),
  disputeResolutionForAgreement: z.string().optional(),

  // Mediation Ethics
  neutralityRequirement: z.boolean().default(true),
  impartialityStandard: z.boolean().default(true),
  conflictOfInterestDisclosure: z.boolean().default(true),
  professionalStandards: z.boolean().default(true),
  ethicalGuidelines: z.string().optional(),

  // External Advisors
  legalCounselConsultation: z.boolean().default(false),
  expertConsultation: z.boolean().default(false),
  technicalAdvisors: z.boolean().default(false),
  financialAdvisors: z.boolean().default(false),
  advisorConfidentiality: z.boolean().default(true),

  // Multi-Party Considerations
  coalitionProhibitions: z.boolean().default(false),
  separateCaucuses: z.boolean().default(true),
  groupDynamicsManagement: z.boolean().default(false),
  votingProcedures: z.string().optional(),
  consensusRequirements: z.boolean().default(false),

  // Technology and Innovation
  virtualPlatform: z.string().optional(),
  documentSharing: z.boolean().default(false),
  realTimeCollaboration: z.boolean().default(false),
  electronicSignatures: z.boolean().default(true),
  recordingProhibition: z.boolean().default(true),

  // Cultural Considerations
  languageNeeds: z.string().optional(),
  culturalSensitivity: z.boolean().default(false),
  interpreterServices: z.boolean().default(false),
  religiousConsiderations: z.boolean().default(false),
  accommodationRequirements: z.string().optional(),

  // Emergency Procedures
  urgentMatters: z.boolean().default(false),
  interimMeasures: z.boolean().default(false),
  emergencyContacts: z.string().optional(),
  preservationOfRights: z.boolean().default(true),

  // Quality Assurance
  feedbackMechanism: z.boolean().default(false),
  evaluationProcess: z.boolean().default(false),
  improvementSuggestions: z.boolean().default(false),
  mediatorEvaluation: z.boolean().default(false),

  // Enforcement and Compliance
  complianceWithAgreement: z.boolean().default(true),
  enforcementMechanism: z.string().optional(),
  breachConsequences: z.string().optional(),
  remediesForBreach: z.string().optional(),
  governingLaw: z.string().optional(),

  // Integration with Legal Process
  stayOfLitigation: z.boolean().default(false),
  courtNotification: z.boolean().default(false),
  statuteOfLimitationsTolling: z.boolean().default(false),
  legalProceedingsSuspension: z.boolean().default(false),

  // Alternative Outcomes
  partialSettlement: z.boolean().default(true),
  issueNarrowing: z.boolean().default(true),
  futureRelationshipStructure: z.boolean().default(false),
  preventiveMeasures: z.boolean().default(false),

  // Signature and Execution
  requireAllPartySignatures: z.boolean().default(true),
  witnessRequirement: z.boolean().default(false),
  notarizationRequirement: z.boolean().default(false),
  electronicSignatureAccepted: z.boolean().default(true),
  executionDate: z.string().optional(),
});
