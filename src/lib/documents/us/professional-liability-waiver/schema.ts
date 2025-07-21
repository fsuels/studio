// src/lib/documents/us/professional-liability-waiver/schema.ts
import { z } from 'zod';

export const ProfessionalLiabilityWaiverSchema = z.object({
  // Professional Information
  professionalName: z.string().min(1, 'Professional name is required'),
  professionalTitle: z.string().min(1, 'Professional title is required'),
  businessName: z.string().optional(),
  businessAddress: z.string().min(1, 'Business address is required'),
  businessPhone: z.string().optional(),
  businessEmail: z.string().email().optional(),
  licenseNumber: z.string().optional(),
  certificationNumber: z.string().optional(),

  // Professional Type
  professionalType: z
    .enum([
      'doctor',
      'lawyer',
      'accountant',
      'engineer',
      'architect',
      'consultant',
      'therapist',
      'financial-advisor',
      'real-estate-agent',
      'contractor',
      'other',
    ])
    .default('consultant'),
  specialization: z.string().optional(),
  yearsOfExperience: z.string().optional(),

  // Client Information
  clientType: z
    .enum(['individual', 'business', 'organization', 'government'])
    .default('individual'),
  collectClientName: z.boolean().default(true),
  collectClientAddress: z.boolean().default(true),
  collectClientPhone: z.boolean().default(false),
  collectClientEmail: z.boolean().default(false),

  // Service Information
  serviceType: z.string().min(1, 'Service type is required'),
  serviceDescription: z.string().min(1, 'Service description is required'),
  serviceDuration: z.string().optional(),
  serviceLocation: z.string().optional(),
  serviceStartDate: z.string().optional(),
  serviceEndDate: z.string().optional(),

  // Professional Standards
  standardOfCare: z
    .enum([
      'reasonable-care',
      'industry-standard',
      'best-efforts',
      'specific-standard',
    ])
    .default('reasonable-care'),
  industryStandards: z.boolean().default(true),
  professionalGuidelines: z.boolean().default(true),
  ethicalStandards: z.boolean().default(true),
  continuingEducation: z.boolean().default(false),

  // Waiver Scope
  waiverScope: z
    .enum([
      'negligence-only',
      'malpractice-only',
      'all-professional-claims',
      'specific-services',
    ])
    .default('all-professional-claims'),
  includeMalpracticeClaims: z.boolean().default(true),
  includeNegligenceClaims: z.boolean().default(true),
  includeErrorsOmissionsClaims: z.boolean().default(true),
  includeBreachOfDutyClaims: z.boolean().default(true),
  includeBreachOfContractClaims: z.boolean().default(false),
  includeMisrepresentationClaims: z.boolean().default(false),

  // Types of Professional Errors
  clinicalErrors: z.boolean().default(false),
  diagnosticErrors: z.boolean().default(false),
  treatmentErrors: z.boolean().default(false),
  legalErrors: z.boolean().default(false),
  accountingErrors: z.boolean().default(false),
  designErrors: z.boolean().default(false),
  adviceErrors: z.boolean().default(true),
  communicationErrors: z.boolean().default(false),

  // Released Parties
  releasedParties: z.array(z.string()).default([]),
  includeProfessional: z.boolean().default(true),
  includeFirm: z.boolean().default(true),
  includePartners: z.boolean().default(false),
  includeAssociates: z.boolean().default(false),
  includeEmployees: z.boolean().default(true),
  includeConsultants: z.boolean().default(false),
  includeReferralSources: z.boolean().default(false),

  // Types of Claims Released
  personalInjuryClaims: z.boolean().default(true),
  propertyDamageClaims: z.boolean().default(true),
  economicLossClaims: z.boolean().default(false),
  emotionalDistressClaims: z.boolean().default(false),
  punitiveDamages: z.boolean().default(false),
  consequentialDamages: z.boolean().default(false),
  lossOfProfitsClaims: z.boolean().default(false),

  // Professional Obligations
  confidentialityObligation: z.boolean().default(true),
  fiduciaryDutyObligation: z.boolean().default(false),
  competenceObligation: z.boolean().default(true),
  timelinessObligation: z.boolean().default(true),
  communicationObligation: z.boolean().default(true),
  documentationObligation: z.boolean().default(false),

  // Client Responsibilities
  clientCooperation: z.boolean().default(true),
  provideTruthfulInformation: z.boolean().default(true),
  followRecommendations: z.boolean().default(false),
  timelyPayment: z.boolean().default(true),
  timelyResponse: z.boolean().default(false),
  maintainConfidentiality: z.boolean().default(false),

  // Informed Consent Elements
  risksExplained: z.boolean().default(true),
  alternativesDiscussed: z.boolean().default(false),
  limitationsExplained: z.boolean().default(true),
  noGuaranteeDisclosed: z.boolean().default(true),
  uncertaintyAcknowledged: z.boolean().default(false),

  // Professional Insurance
  malpracticeInsurance: z.boolean().default(false),
  insuranceAmount: z.string().optional(),
  insuranceCarrier: z.string().optional(),
  insuranceExpiration: z.string().optional(),
  claimsHistory: z.boolean().default(false),

  // Scope of Practice
  withinScopeOfPractice: z.boolean().default(true),
  licensureCompliance: z.boolean().default(true),
  practiceRestrictions: z.string().optional(),
  specialtyLimitations: z.string().optional(),
  jurisdictionalLimitations: z.string().optional(),

  // Treatment/Service Limitations
  emergencyServicesLimitation: z.boolean().default(false),
  afterHoursLimitation: z.boolean().default(false),
  scopeLimitation: z.string().optional(),
  referralObligation: z.boolean().default(false),
  followUpLimitation: z.boolean().default(false),

  // Documentation and Records
  recordKeepingStandards: z.boolean().default(true),
  clientAccessToRecords: z.boolean().default(false),
  recordRetentionPeriod: z.string().optional(),
  privacyCompliance: z.boolean().default(true),
  hipaaCompliance: z.boolean().default(false),

  // Communication Protocols
  preferredCommunicationMethod: z.string().optional(),
  emergencyContactProtocol: z.string().optional(),
  responseTimeExpectations: z.string().optional(),
  communicationLimitations: z.string().optional(),

  // Termination of Relationship
  terminationRights: z.boolean().default(true),
  terminationNotice: z.string().optional(),
  terminationObligations: z.string().optional(),
  transitionOfCare: z.boolean().default(false),
  recordTransfer: z.boolean().default(false),

  // Quality Assurance
  peerReview: z.boolean().default(false),
  qualityImprovement: z.boolean().default(false),
  outcomeMonitoring: z.boolean().default(false),
  feedbackMechanism: z.boolean().default(false),

  // Technology and Equipment
  technologyReliance: z.boolean().default(false),
  equipmentLimitations: z.string().optional(),
  technologyFailureDisclaimer: z.boolean().default(false),
  softwareAccuracy: z.boolean().default(false),
  dataSecurityMeasures: z.boolean().default(false),

  // Continuing Professional Development
  continuingEducationRequirement: z.boolean().default(false),
  professionalDevelopment: z.boolean().default(false),
  skillMaintenance: z.boolean().default(false),
  expertiseEvolution: z.boolean().default(false),

  // Regulatory Compliance
  regulatoryCompliance: z.boolean().default(true),
  licensingBoardCompliance: z.boolean().default(true),
  professionalAssociationCompliance: z.boolean().default(false),
  industryRegulationCompliance: z.boolean().default(true),
  ethicalCodeCompliance: z.boolean().default(true),

  // Second Opinions
  secondOpinionRights: z.boolean().default(false),
  consultationRights: z.boolean().default(false),
  referralObligations: z.boolean().default(false),
  collaborationExpectations: z.boolean().default(false),

  // Financial Arrangements
  feeStructure: z.string().optional(),
  paymentTerms: z.string().optional(),
  additionalCosts: z.string().optional(),
  refundPolicy: z.string().optional(),
  collectionRights: z.boolean().default(false),

  // Indemnification
  clientIndemnification: z.boolean().default(false),
  professionalIndemnification: z.boolean().default(false),
  mutualIndemnification: z.boolean().default(false),
  indemnificationScope: z.string().optional(),

  // Limitation of Liability
  liabilityLimitation: z.boolean().default(true),
  damageLimitation: z
    .enum([
      'fee-amount',
      'insurance-coverage',
      'specific-amount',
      'no-limitation',
    ])
    .optional(),
  limitationAmount: z.string().optional(),
  consequentialDamagesExclusion: z.boolean().default(true),
  incidentalDamagesExclusion: z.boolean().default(true),

  // Assumption of Risk
  clientAssumptionOfRisk: z.boolean().default(true),
  treatmentRisks: z.boolean().default(false),
  serviceRisks: z.boolean().default(true),
  decisionRisks: z.boolean().default(false),
  delayRisks: z.boolean().default(false),

  // Acknowledgment and Understanding
  serviceNatureUnderstood: z.boolean().default(true),
  limitationsUnderstood: z.boolean().default(true),
  risksUnderstood: z.boolean().default(true),
  noGuaranteeUnderstood: z.boolean().default(true),
  voluntaryEngagement: z.boolean().default(true),

  // Legal Framework
  governingLaw: z.string().optional(),
  jurisdiction: z.string().optional(),
  venue: z.string().optional(),
  disputeResolution: z
    .enum(['litigation', 'arbitration', 'mediation'])
    .optional(),

  // Special Circumstances
  experimentalTreatment: z.boolean().default(false),
  offLabelUse: z.boolean().default(false),
  investigationalProcedures: z.boolean().default(false),
  researchParticipation: z.boolean().default(false),

  // Documentation Requirements
  writtenConsentRequired: z.boolean().default(true),
  witnessRequired: z.boolean().default(false),
  notarizationRequired: z.boolean().default(false),
  electronicConsentAccepted: z.boolean().default(true),
  recordingConsent: z.boolean().default(false),

  // Contract Terms
  severabilityClause: z.boolean().default(true),
  entireAgreement: z.boolean().default(true),
  modificationRequirements: z.boolean().default(true),
  bindingEffect: z.boolean().default(true),

  // Signature Requirements
  requireProfessionalSignature: z.boolean().default(true),
  requireClientSignature: z.boolean().default(true),
  requireWitnessSignature: z.boolean().default(false),
  requireNotarization: z.boolean().default(false),
  electronicSignatureAccepted: z.boolean().default(true),
});
