// src/lib/documents/us/child-care-contract/schema.ts
import { z } from 'zod';

export const ChildCareContractSchema = z.object({
  // Parent/Guardian Information
  parentName: z.string().min(1, 'Parent/guardian name is required'),
  parentAddress: z.string().optional(),
  parentPhone: z.string().optional(),
  parentEmail: z.string().email().optional(),
  emergencyContact: z.string().optional(),
  emergencyPhone: z.string().optional(),

  // Childcare Provider Information
  providerName: z.string().min(1, 'Childcare provider name is required'),
  providerAddress: z.string().optional(),
  providerPhone: z.string().optional(),
  providerEmail: z.string().email().optional(),
  providerAge: z.string().optional(),
  providerExperience: z.string().optional(),

  // Child Information
  childName: z.string().optional(),
  childAge: z.string().optional(),
  childBirthDate: z.string().optional(),
  childAllergies: z.string().optional(),
  childMedications: z.string().optional(),
  childSpecialNeeds: z.string().optional(),

  // Care Schedule
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  careType: z
    .enum(['ongoing', 'occasional', 'temporary', 'emergency'])
    .default('occasional'),
  regularSchedule: z.string().optional(),
  hoursPerWeek: z.string().optional(),
  specificDates: z.string().optional(),

  // Payment Terms
  hourlyRate: z.string().optional(),
  dailyRate: z.string().optional(),
  weeklyRate: z.string().optional(),
  paymentMethod: z
    .enum(['cash', 'check', 'bank-transfer', 'app'])
    .default('cash'),
  paymentSchedule: z
    .enum(['after-each-session', 'weekly', 'bi-weekly', 'monthly'])
    .default('after-each-session'),
  overtimeRate: z.string().optional(),

  // Duties and Responsibilities
  feedingRequired: z.boolean().default(true),
  diapering: z.boolean().default(false),
  bathing: z.boolean().default(false),
  bedtimeRoutine: z.boolean().default(true),
  educationalActivities: z.boolean().default(true),
  outdoorPlay: z.boolean().default(true),
  homeworkHelp: z.boolean().default(false),
  lightHousekeeping: z.boolean().default(false),

  // House Rules
  disciplinePolicy: z.string().optional(),
  screenTimeRules: z.string().optional(),
  mealPreparation: z.string().optional(),
  napSchedule: z.string().optional(),
  visitorPolicy: z.boolean().default(false),
  phoneUsePolicy: z.string().optional(),

  // Safety and Emergency
  emergencyProcedures: z.string().optional(),
  medicalEmergencyContact: z.string().optional(),
  hospitalPreference: z.string().optional(),
  medicationAdministration: z.boolean().default(false),
  firstAidCertification: z.boolean().default(false),
  cprCertification: z.boolean().default(false),

  // Transportation
  drivingRequired: z.boolean().default(false),
  vehicleProvided: z.enum(['parent', 'provider', 'none']).default('parent'),
  carSeatRequired: z.boolean().default(true),
  drivingInsurance: z.boolean().default(false),
  transportationLocations: z.string().optional(),

  // Meals and Snacks
  mealsProvided: z.enum(['parent', 'provider', 'shared']).default('parent'),
  specialDiet: z.string().optional(),
  snackPolicy: z.string().optional(),
  foodAllergies: z.string().optional(),
  kitchenAccess: z.boolean().default(true),

  // Communication
  dailyReports: z.boolean().default(true),
  photoSharing: z.boolean().default(false),
  socialMediaPolicy: z.boolean().default(false),
  communicationMethod: z
    .enum(['text', 'call', 'app', 'written'])
    .default('text'),
  pickupNotification: z.boolean().default(true),

  // Cancellation Policy
  cancellationNotice: z.string().optional(),
  cancellationFee: z.string().optional(),
  noShowPolicy: z.string().optional(),
  earlyPickupPolicy: z.string().optional(),
  latePickupFee: z.string().optional(),

  // Sick Policy
  sickChildPolicy: z.string().optional(),
  sickProviderPolicy: z.string().optional(),
  feverPolicy: z.string().optional(),
  contagiousIllness: z.string().optional(),
  medicationPolicy: z.string().optional(),

  // Background and References
  backgroundCheck: z.boolean().default(false),
  references: z.boolean().default(true),
  identificationVerification: z.boolean().default(true),
  smokingPolicy: z.boolean().default(false),
  petPolicy: z.string().optional(),

  // Additional Services
  overnightCare: z.boolean().default(false),
  weekendCare: z.boolean().default(false),
  holidayCare: z.boolean().default(false),
  additionalChildren: z.boolean().default(false),
  specialEventCare: z.boolean().default(false),

  // Termination
  terminationNotice: z.string().optional(),
  terminationReasons: z.string().optional(),
  finalPayment: z.string().optional(),
  returnOfKeys: z.boolean().default(false),

  // Legal and Insurance
  liability: z.string().optional(),
  insuranceCoverage: z.boolean().default(false),
  confidentiality: z.boolean().default(true),
  photographyConsent: z.boolean().default(false),

  // Special Instructions
  bedtimeRoutineDetails: z.string().optional(),
  comfortItems: z.string().optional(),
  behaviorManagement: z.string().optional(),
  emergencyContacts: z.string().optional(),
  specialInstructions: z.string().optional(),

  // Signature Requirements
  parentSignature: z.boolean().default(true),
  providerSignature: z.boolean().default(true),
  witnessSignature: z.boolean().default(false),
  notarization: z.boolean().default(false),
  electronicSignature: z.boolean().default(true),
});
