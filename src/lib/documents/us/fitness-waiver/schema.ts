// src/lib/documents/us/fitness-waiver/schema.ts
import { z } from 'zod';

export const FitnessWaiverSchema = z.object({
  // Participant Information
  participantName: z.string().min(1, 'Participant name is required'),
  participantAddress: z.string().min(1, 'Participant address is required'),
  participantPhone: z.string().optional(),
  participantEmail: z.string().email().optional(),
  participantAge: z.string().optional(),
  
  // Guardian Information (if minor)
  isMinor: z.boolean().default(false),
  guardianName: z.string().optional(),
  guardianRelationship: z.string().optional(),
  guardianSignature: z.boolean().default(false),
  
  // Facility Information
  facilityName: z.string().min(1, 'Facility name is required'),
  facilityAddress: z.string().optional(),
  facilityPhone: z.string().optional(),
  facilityEmail: z.string().email().optional(),
  
  // Activity Details
  activityType: z.array(z.string()).default([]),
  activityDescription: z.string().optional(),
  fitnessLevel: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  personalTraining: z.boolean().default(false),
  groupClasses: z.boolean().default(false),
  
  // Health Information
  medicalConditions: z.string().optional(),
  medications: z.string().optional(),
  physicianClearance: z.boolean().default(false),
  pregnancyStatus: z.boolean().default(false),
  recentInjuries: z.string().optional(),
  
  // Assumption of Risk
  assumptionOfRisk: z.boolean().default(true),
  understandsRisks: z.boolean().default(true),
  voluntaryParticipation: z.boolean().default(true),
  physicalCapability: z.boolean().default(true),
  
  // Release of Claims
  releaseOfClaims: z.boolean().default(true),
  waiverOfLiability: z.boolean().default(true),
  indemnificationClause: z.boolean().default(true),
  propertyDamageWaiver: z.boolean().default(true),
  
  // Activities Covered
  weightTraining: z.boolean().default(false),
  cardiovascularEquipment: z.boolean().default(false),
  groupFitnessClasses: z.boolean().default(false),
  personalTrainingServices: z.boolean().default(false),
  swimmingPool: z.boolean().default(false),
  rockClimbing: z.boolean().default(false),
  
  // Emergency Contact
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
  emergencyContactRelationship: z.string().optional(),
  
  // Insurance Information
  hasInsurance: z.boolean().default(true),
  insuranceProvider: z.string().optional(),
  policyNumber: z.string().optional(),
  
  // Photo/Video Release
  photoVideoConsent: z.boolean().default(false),
  mediaUseConsent: z.boolean().default(false),
  
  // Signature Requirements
  requireParticipantSignature: z.boolean().default(true),
  requireGuardianSignature: z.boolean().default(false),
  requireFacilitySignature: z.boolean().default(false),
  witnessRequired: z.boolean().default(false),
  notarizationRequired: z.boolean().default(false),
  electronicSignatureAccepted: z.boolean().default(true),
});