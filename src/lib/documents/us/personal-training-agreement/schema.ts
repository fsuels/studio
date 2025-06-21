// src/lib/documents/us/personal-training-agreement/schema.ts
import { z } from 'zod';

export const PersonalTrainingAgreementSchema = z.object({
  // Trainer Information
  trainerName: z.string().min(1, 'Trainer name is required'),
  trainerAddress: z.string().optional(),
  trainerPhone: z.string().optional(),
  trainerEmail: z.string().email().optional(),
  trainerCertifications: z.string().optional(),

  // Client Information
  clientName: z.string().min(1, 'Client name is required'),
  clientAddress: z.string().optional(),
  clientPhone: z.string().optional(),
  clientEmail: z.string().email().optional(),
  clientAge: z.string().optional(),

  // Training Details
  trainingGoals: z.string().min(1, 'Training goals are required'),
  fitnessLevel: z
    .enum(['beginner', 'intermediate', 'advanced'])
    .default('beginner'),
  trainingType: z.array(z.string()).default([]),
  sessionDuration: z.string().optional(),
  sessionsPerWeek: z.string().optional(),

  // Schedule and Location
  trainingLocation: z.enum(['gym', 'home', 'outdoor', 'online']).default('gym'),
  facilityName: z.string().optional(),
  trainingSchedule: z.string().optional(),
  flexibleScheduling: z.boolean().default(false),

  // Package and Pricing
  packageType: z
    .enum(['single-session', 'package', 'monthly', 'ongoing'])
    .default('package'),
  numberOfSessions: z.string().optional(),
  sessionRate: z.string().optional(),
  packagePrice: z.string().optional(),
  totalCost: z.string().optional(),

  // Payment Terms
  paymentSchedule: z
    .enum(['per-session', 'package-upfront', 'monthly', 'weekly'])
    .default('package-upfront'),
  paymentMethod: z
    .enum(['cash', 'check', 'credit-card', 'bank-transfer'])
    .default('credit-card'),
  latePaymentFees: z.boolean().default(false),

  // Health and Safety
  medicalClearance: z.boolean().default(false),
  healthConditions: z.string().optional(),
  medicationsList: z.string().optional(),
  injuryHistory: z.string().optional(),
  fitnessAssessment: z.boolean().default(true),

  // Services Included
  workoutPlanning: z.boolean().default(true),
  nutritionGuidance: z.boolean().default(false),
  progressTracking: z.boolean().default(true),
  exerciseModifications: z.boolean().default(true),
  equipmentInstruction: z.boolean().default(true),

  // Cancellation Policy
  cancellationNotice: z.string().optional(),
  cancellationFees: z.boolean().default(false),
  noShowPolicy: z.string().optional(),
  reschedulingPolicy: z.string().optional(),

  // Liability and Waivers
  liabilityWaiver: z.boolean().default(true),
  assumptionOfRisk: z.boolean().default(true),
  medicalEmergencyConsent: z.boolean().default(true),
  insuranceInformation: z.string().optional(),

  // Emergency Contact
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
  emergencyContactRelationship: z.string().optional(),

  // Confidentiality
  clientConfidentiality: z.boolean().default(true),
  healthInformationPrivacy: z.boolean().default(true),

  // Termination
  terminationConditions: z.string().optional(),
  refundPolicy: z.string().optional(),
  contractDuration: z.string().optional(),

  // Signature Requirements
  requireTrainerSignature: z.boolean().default(true),
  requireClientSignature: z.boolean().default(true),
  witnessRequired: z.boolean().default(false),
  notarizationRequired: z.boolean().default(false),
  electronicSignatureAccepted: z.boolean().default(true),
});
