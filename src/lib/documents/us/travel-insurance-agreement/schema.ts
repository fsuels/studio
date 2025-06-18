// src/lib/documents/us/travel-insurance-agreement/schema.ts
import { z } from 'zod';

export const TravelInsuranceAgreementSchema = z.object({
  // Policyholder Information
  policyholderName: z.string().min(1, 'Policyholder name is required'),
  policyholderAddress: z.string().optional(),
  policyholderPhone: z.string().optional(),
  policyholderEmail: z.string().email().optional(),
  policyholderDateOfBirth: z.string().optional(),
  
  // Insurance Provider Information
  insuranceCompanyName: z.string().min(1, 'Insurance company name is required'),
  insuranceCompanyAddress: z.string().optional(),
  insuranceCompanyContact: z.string().optional(),
  policyNumber: z.string().optional(),
  
  // Travel Details
  travelDestination: z.string().optional(),
  travelStartDate: z.string().optional(),
  travelEndDate: z.string().optional(),
  travelDuration: z.string().optional(),
  travelPurpose: z.enum(['leisure', 'business', 'study', 'medical', 'other']).default('leisure'),
  
  // Travelers Information
  numberOfTravelers: z.string().optional(),
  travelerNames: z.string().optional(),
  travelerAges: z.string().optional(),
  familyPolicy: z.boolean().default(false),
  
  // Coverage Types
  medicalCoverage: z.boolean().default(false),
  medicalCoverageAmount: z.string().optional(),
  emergencyEvacuation: z.boolean().default(false),
  evacuationCoverageAmount: z.string().optional(),
  tripCancellation: z.boolean().default(false),
  tripCancellationAmount: z.string().optional(),
  tripInterruption: z.boolean().default(false),
  tripInterruptionAmount: z.string().optional(),
  baggageCoverage: z.boolean().default(false),
  baggageCoverageAmount: z.string().optional(),
  
  // Additional Coverage
  flightDelay: z.boolean().default(false),
  flightDelayAmount: z.string().optional(),
  rentalCarCoverage: z.boolean().default(false),
  rentalCarAmount: z.string().optional(),
  accidentalDeath: z.boolean().default(false),
  accidentalDeathAmount: z.string().optional(),
  activityCoverage: z.boolean().default(false),
  
  // Pre-existing Conditions
  preExistingConditions: z.boolean().default(false),
  preExistingConditionsCovered: z.boolean().default(false),
  medicalQuestionnaire: z.boolean().default(false),
  medicalExamRequired: z.boolean().default(false),
  
  // Policy Terms
  policyEffectiveDate: z.string().optional(),
  policyExpirationDate: z.string().optional(),
  premiumAmount: z.string().optional(),
  deductibleAmount: z.string().optional(),
  paymentSchedule: z.enum(['one-time', 'monthly', 'quarterly', 'annually']).default('one-time'),
  
  // Exclusions
  alcoholExclusion: z.boolean().default(true),
  drugsExclusion: z.boolean().default(true),
  extremeSportsExclusion: z.boolean().default(true),
  warExclusion: z.boolean().default(true),
  terrorismExclusion: z.boolean().default(false),
  
  // Claims Process
  claimsReportingTime: z.string().optional(),
  claimsProcessingTime: z.string().optional(),
  claimsDocumentation: z.string().optional(),
  emergencyContactNumber: z.string().optional(),
  
  // Travel Assistance
  emergencyAssistance: z.boolean().default(false),
  travelAssistanceHotline: z.string().optional(),
  conciergeServices: z.boolean().default(false),
  translationServices: z.boolean().default(false),
  
  // Cancellation and Refund
  cancellationPolicy: z.string().optional(),
  refundPolicy: z.string().optional(),
  freeLookPeriod: z.string().optional(),
  proRataRefund: z.boolean().default(false),
  
  // High-Risk Activities
  adventureSports: z.boolean().default(false),
  winterSports: z.boolean().default(false),
  waterSports: z.boolean().default(false),
  motorSports: z.boolean().default(false),
  extremeActivities: z.boolean().default(false),
  
  // Geographic Coverage
  worldwideCoverage: z.boolean().default(false),
  regionalCoverage: z.string().optional(),
  countryRestrictions: z.string().optional(),
  highRiskCountries: z.boolean().default(false),
  
  // Technology and Digital
  digitalPolicy: z.boolean().default(true),
  mobileApp: z.boolean().default(false),
  onlineClaimsSubmission: z.boolean().default(false),
  digitalDocuments: z.boolean().default(false),
  
  // Special Provisions
  businessEquipment: z.boolean().default(false),
  businessEquipmentAmount: z.string().optional(),
  cashCoverage: z.boolean().default(false),
  cashCoverageAmount: z.string().optional(),
  identityTheft: z.boolean().default(false),
  
  // Legal Terms
  governingLaw: z.string().optional(),
  jurisdiction: z.string().optional(),
  disputeResolution: z.enum(['mediation', 'arbitration', 'court']).optional(),
  
  // Signature Requirements
  requirePolicyholderSignature: z.boolean().default(true),
  requireInsuranceSignature: z.boolean().default(true),
  witnessRequired: z.boolean().default(false),
  notarizationRequired: z.boolean().default(false),
  electronicSignatureAccepted: z.boolean().default(true),
});