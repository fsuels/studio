// src/lib/documents/us/general-liability-waiver/schema.ts
import { z } from 'zod';

export const GeneralLiabilityWaiverSchema = z.object({
  // Organization Information
  organizationName: z.string().min(1, 'Organization name is required'),
  organizationAddress: z.string().min(1, 'Organization address is required'),
  organizationPhone: z.string().optional(),
  organizationEmail: z.string().email().optional(),

  // Activity/Event Information
  activityName: z.string().min(1, 'Activity name is required'),
  activityDescription: z.string().min(1, 'Activity description is required'),
  activityLocation: z.string().min(1, 'Activity location is required'),
  activityDate: z.string().optional(),
  activityDuration: z.string().optional(),

  // Participant Information Fields
  collectParticipantName: z.boolean().default(true),
  collectParticipantAddress: z.boolean().default(true),
  collectParticipantPhone: z.boolean().default(true),
  collectParticipantEmail: z.boolean().default(false),
  collectEmergencyContact: z.boolean().default(true),
  collectMedicalInformation: z.boolean().default(false),

  // Age and Capacity
  minimumAge: z.string().optional(),
  minorParticipants: z.boolean().default(false),
  parentGuardianSignature: z.boolean().default(false),
  capacityVerification: z.boolean().default(true),

  // Risk Description
  inherentRisks: z.array(z.string()).default([]),
  specificRisks: z.string().optional(),
  riskAcknowledgment: z.boolean().default(true),
  assumptionOfRisk: z.boolean().default(true),

  // Waiver Scope
  waiverScope: z
    .enum(['negligence-only', 'all-claims', 'specific-claims'])
    .default('all-claims'),
  includeNegligence: z.boolean().default(true),
  includeGrossNegligence: z.boolean().default(false),
  includeIntentionalActs: z.boolean().default(false),
  futureClaimsWaiver: z.boolean().default(true),

  // Released Parties
  releasedParties: z.array(z.string()).default([]),
  includeEmployees: z.boolean().default(true),
  includeVolunteers: z.boolean().default(true),
  includeAgents: z.boolean().default(true),
  includeAffiliates: z.boolean().default(false),
  includeSponsors: z.boolean().default(false),

  // Types of Claims Released
  personalInjuryClaims: z.boolean().default(true),
  propertyDamageClaims: z.boolean().default(true),
  emotionalDistressClaims: z.boolean().default(false),
  economicLossClaims: z.boolean().default(false),
  wrongfulDeathClaims: z.boolean().default(false),

  // Indemnification
  indemnificationClause: z.boolean().default(true),
  indemnifyAgainst: z.array(z.string()).default([]),
  attorneyFeesIndemnity: z.boolean().default(true),

  // Medical Treatment
  medicalTreatmentConsent: z.boolean().default(false),
  emergencyMedicalConsent: z.boolean().default(false),
  medicalInsuranceDisclaimer: z.boolean().default(false),
  medicalExpenseResponsibility: z
    .enum(['participant', 'organization', 'insurance'])
    .optional(),

  // Equipment and Property
  equipmentUse: z.boolean().default(false),
  equipmentRisks: z.string().optional(),
  personalPropertyDisclaimer: z.boolean().default(false),
  equipmentInspection: z.boolean().default(false),

  // Photography and Media
  photographyConsent: z.boolean().default(false),
  mediaUseConsent: z.boolean().default(false),
  publicityRights: z.boolean().default(false),
  socialMediaPolicy: z.boolean().default(false),

  // Alcohol and Substance Policy
  alcoholPolicy: z.boolean().default(false),
  substancePolicy: z.boolean().default(false),
  breathalyzerConsent: z.boolean().default(false),

  // Transportation
  transportationWaiver: z.boolean().default(false),
  vehicleUse: z.boolean().default(false),
  drivingRequirements: z.string().optional(),
  transportationRisks: z.string().optional(),

  // Special Conditions
  weatherConditions: z.boolean().default(false),
  equipmentConditions: z.boolean().default(false),
  facilityConditions: z.boolean().default(false),
  otherParticipants: z.boolean().default(false),

  // Compliance and Rules
  rulesCompliance: z.boolean().default(true),
  safetyInstructions: z.boolean().default(true),
  supervisorInstructions: z.boolean().default(true),
  codeOfConduct: z.boolean().default(false),

  // Insurance Provisions
  insuranceRequirement: z.boolean().default(false),
  insuranceDisclaimer: z.boolean().default(true),
  insuranceCoordination: z.boolean().default(false),

  // Governing Law
  governingLaw: z.string().optional(),
  jurisdiction: z.string().optional(),
  venueSelection: z.string().optional(),
  disputeResolution: z
    .enum(['litigation', 'arbitration', 'mediation'])
    .optional(),

  // Severability and Construction
  severabilityClause: z.boolean().default(true),
  entireAgreement: z.boolean().default(true),
  modificationRequirements: z.boolean().default(true),
  bindingEffect: z.boolean().default(true),

  // Acknowledgment and Understanding
  readAndUnderstood: z.boolean().default(true),
  voluntaryParticipation: z.boolean().default(true),
  competentToSign: z.boolean().default(true),
  noCoercion: z.boolean().default(true),

  // Special Populations
  pregnancyWarning: z.boolean().default(false),
  heartConditionWarning: z.boolean().default(false),
  physicalLimitationWarning: z.boolean().default(false),
  medicationWarning: z.boolean().default(false),

  // Duration and Scope
  waiverDuration: z
    .enum(['single-event', 'multiple-events', 'ongoing', 'specified-period'])
    .default('single-event'),
  eventSeries: z.boolean().default(false),
  membershipWaiver: z.boolean().default(false),

  // Additional Clauses
  assumptionOfRiskClause: z.boolean().default(true),
  primaryAssumptionOfRisk: z.boolean().default(true),
  secondaryAssumptionOfRisk: z.boolean().default(false),

  // Signature Requirements
  requireParticipantSignature: z.boolean().default(true),
  requireParentSignature: z.boolean().default(false),
  requireWitnessSignature: z.boolean().default(false),
  requireNotarization: z.boolean().default(false),
  electronicSignatureAccepted: z.boolean().default(true),
});
