// src/lib/documents/us/release-of-liability/schema.ts
import { z } from 'zod';

export const ReleaseOfLiabilitySchema = z.object({
  // Releasor Information
  releasorName: z.string().min(1, 'Releasor name is required'),
  releasorAddress: z.string().optional(),
  releasorPhone: z.string().optional(),
  releasorEmail: z.string().email().optional(),
  releasorAge: z.string().optional(),

  // Releasee Information
  releaseeName: z.string().min(1, 'Releasee name is required'),
  releaseeAddress: z.string().optional(),
  releaseeType: z
    .enum(['individual', 'business', 'organization'])
    .default('business'),
  releaseeDescription: z.string().optional(),

  // Activity/Event Details
  activityDescription: z.string().optional(),
  activityDate: z.string().optional(),
  activityLocation: z.string().optional(),
  activityDuration: z.string().optional(),
  activityRisks: z.string().optional(),

  // Release Scope
  releaseType: z.enum(['general', 'specific', 'mutual']).default('general'),
  claimsReleased: z
    .array(
      z.enum([
        'personal-injury',
        'property-damage',
        'emotional-distress',
        'financial-loss',
        'all-claims',
      ]),
    )
    .default(['all-claims']),
  futureClaimsIncluded: z.boolean().default(true),
  knownClaimsOnly: z.boolean().default(false),

  // Consideration
  considerationAmount: z.string().optional(),
  considerationType: z
    .enum(['monetary', 'services', 'participation', 'other'])
    .default('participation'),
  considerationDescription: z.string().optional(),

  // Assumption of Risk
  assumptionOfRisk: z.boolean().default(true),
  acknowledgmentOfRisks: z.string().optional(),
  voluntaryParticipation: z.boolean().default(true),
  physicalConditionAcknowledgment: z.boolean().default(true),

  // Medical Information
  medicalConditionsDisclosed: z.boolean().default(false),
  medicalConditions: z.string().optional(),
  emergencyContact: z.string().optional(),
  emergencyPhone: z.string().optional(),
  medicalInsurance: z.boolean().default(false),

  // Indemnification
  indemnificationClause: z.boolean().default(true),
  defendClause: z.boolean().default(true),
  attorneyFeesClause: z.boolean().default(true),

  // Photography/Media Release
  photoRelease: z.boolean().default(false),
  mediaUsageRights: z.enum(['none', 'limited', 'unlimited']).default('none'),
  commercialUseAllowed: z.boolean().default(false),

  // Minors
  minorParticipant: z.boolean().default(false),
  parentGuardianName: z.string().optional(),
  parentGuardianRelationship: z.string().optional(),

  // Insurance
  insuranceRequired: z.boolean().default(false),
  insuranceAmount: z.string().optional(),
  insuranceProvider: z.string().optional(),

  // Governing Law
  governingLaw: z.string().optional(),
  jurisdiction: z.string().optional(),

  // Additional Provisions
  severabilityClause: z.boolean().default(true),
  entireAgreementClause: z.boolean().default(true),
  modificationRestrictions: z.boolean().default(true),

  // Acknowledgments
  readAndUnderstood: z.boolean().default(true),
  legalAdviceWaived: z.boolean().default(true),
  voluntarilyExecuted: z.boolean().default(true),

  // Effective Date
  effectiveDate: z.string().optional(),
  expirationDate: z.string().optional(),

  // Signature Requirements
  releasorSignature: z.boolean().default(true),
  releaseeSignature: z.boolean().default(false),
  witnessSignature: z.boolean().default(false),
  notarization: z.boolean().default(false),
  electronicSignature: z.boolean().default(true),
});
