// src/lib/documents/us/horse-boarding-agreement/schema.ts
import { z } from 'zod';

export const HorseBoardingAgreementSchema = z.object({
  // Stable Owner Information
  stableOwnerName: z.string().min(1, 'Stable owner name is required'),
  stableOwnerAddress: z.string().optional(),
  stableOwnerPhone: z.string().optional(),
  stableOwnerEmail: z.string().email().optional(),
  stableName: z.string().optional(),
  stableAddress: z.string().optional(),

  // Horse Owner Information
  horseOwnerName: z.string().min(1, 'Horse owner name is required'),
  horseOwnerAddress: z.string().optional(),
  horseOwnerPhone: z.string().optional(),
  horseOwnerEmail: z.string().email().optional(),
  emergencyContact: z.string().optional(),

  // Horse Information
  horseName: z.string().min(1, 'Horse name is required'),
  horseBreed: z.string().optional(),
  horseAge: z.string().optional(),
  horseColor: z.string().optional(),
  horseGender: z.enum(['stallion', 'mare', 'gelding']).optional(),
  horseHeight: z.string().optional(),
  horseWeight: z.string().optional(),
  registrationNumber: z.string().optional(),

  // Boarding Details
  boardingType: z
    .enum(['full-board', 'partial-board', 'pasture-board', 'training-board'])
    .default('full-board'),
  stallType: z
    .enum(['box-stall', 'run-in-shed', 'pasture-only', 'paddock'])
    .default('box-stall'),
  turnoutSchedule: z.string().optional(),
  feedingSchedule: z.string().optional(),
  specialCareNeeds: z.string().optional(),

  // Facility Details
  stallSize: z.string().optional(),
  pastureAccess: z.boolean().default(true),
  arenaAccess: z.boolean().default(false),
  trailAccess: z.boolean().default(false),
  washStallAccess: z.boolean().default(false),
  tackRoomAccess: z.boolean().default(false),

  // Feed and Care
  feedType: z.string().optional(),
  feedQuantity: z.string().optional(),
  supplementsProvided: z.string().optional(),
  wateringSystem: z
    .enum(['automatic', 'manual', 'trough'])
    .default('automatic'),
  blanketing: z.boolean().default(false),
  blanketsProvided: z.boolean().default(false),

  // Health Care
  veterinarianName: z.string().optional(),
  veterinarianPhone: z.string().optional(),
  farrierName: z.string().optional(),
  farrierSchedule: z.string().optional(),
  vaccinationSchedule: z.string().optional(),
  dewormingSchedule: z.string().optional(),

  // Financial Terms
  monthlyBoardingFee: z.string().optional(),
  feedCosts: z.string().optional(),
  beddingCosts: z.string().optional(),
  additionalServices: z.string().optional(),
  paymentDueDate: z.string().optional(),
  lateFee: z.string().optional(),
  securityDeposit: z.string().optional(),

  // Care Responsibilities
  dailyCare: z
    .enum(['full-service', 'self-care', 'partial-care'])
    .default('full-service'),
  stallCleaning: z
    .enum(['daily', 'twice-daily', 'owner', 'stable'])
    .default('daily'),
  feedingResponsibility: z
    .enum(['stable', 'owner', 'shared'])
    .default('stable'),
  turnoutResponsibility: z
    .enum(['stable', 'owner', 'shared'])
    .default('stable'),
  exerciseProvided: z.boolean().default(false),

  // Riding and Training
  ridingPrivileges: z.boolean().default(true),
  riderExperienceLevel: z.string().optional(),
  supervisedRiding: z.boolean().default(false),
  lessonAvailability: z.boolean().default(false),
  trainerAccess: z.boolean().default(false),
  competitionParticipation: z.boolean().default(false),

  // Health and Safety
  healthCertificate: z.boolean().default(true),
  vaccinationRequirements: z.string().optional(),
  cogginsTest: z.boolean().default(true),
  quarantineProcedures: z.string().optional(),
  healthInspections: z.string().optional(),
  firstAidProcedures: z.string().optional(),

  // Insurance and Liability
  horseInsurance: z.boolean().default(false),
  mortalityInsurance: z.boolean().default(false),
  liabilityInsurance: z.boolean().default(true),
  careGiverLiability: z.boolean().default(true),
  ownerLiability: z.string().optional(),
  liabilityWaiver: z.boolean().default(true),

  // Emergency Procedures
  emergencyVetCare: z.string().optional(),
  emergencyContactAuth: z.boolean().default(true),
  medicalTreatmentLimit: z.string().optional(),
  evacuationProcedures: z.string().optional(),
  fireEmergencyPlan: z.string().optional(),

  // Termination
  terminationNotice: z.string().optional(),
  removalTimeframe: z.string().optional(),
  defaultConsequences: z.string().optional(),
  unpaidBoardLien: z.boolean().default(true),
  abandonmentPolicy: z.string().optional(),

  // Facility Rules
  visitorPolicy: z.string().optional(),
  safetyRequirements: z.string().optional(),
  equipmentUse: z.string().optional(),
  facilityHours: z.string().optional(),
  smokingPolicy: z.boolean().default(false),
  alcoholPolicy: z.boolean().default(false),

  // Special Services
  groomingServices: z.boolean().default(false),
  transportationServices: z.boolean().default(false),
  showPreparation: z.boolean().default(false),
  medicationAdministration: z.boolean().default(false),
  reproductiveServices: z.boolean().default(false),

  // Agreement Terms
  agreementStartDate: z.string().optional(),
  agreementEndDate: z.string().optional(),
  renewalTerms: z.string().optional(),
  modificationPolicy: z.string().optional(),
  disputeResolution: z
    .enum(['discussion', 'mediation', 'arbitration', 'court'])
    .default('mediation'),

  // Legal Terms
  governingLaw: z.string().optional(),
  jurisdiction: z.string().optional(),
  entireAgreement: z.boolean().default(true),
  severabilityClause: z.boolean().default(true),

  // Signature Requirements
  requireStableOwnerSignature: z.boolean().default(true),
  requireHorseOwnerSignature: z.boolean().default(true),
  witnessRequired: z.boolean().default(false),
  notarizationRequired: z.boolean().default(false),
  electronicSignatureAccepted: z.boolean().default(true),
});
