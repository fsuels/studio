// src/lib/documents/us/personal-care-agreement/schema.ts
import { z } from 'zod';

export const PersonalCareAgreementSchema = z.object({
  // Care Recipient Information
  recipientName: z.string().min(1, 'Recipient name is required'),
  recipientAddress: z.string().min(1, 'Recipient address is required'),
  recipientPhone: z.string().optional(),
  recipientAge: z.string().optional(),
  recipientEmergencyContact: z.string().optional(),
  
  // Caregiver Information
  caregiverName: z.string().min(1, 'Caregiver name is required'),
  caregiverAddress: z.string().min(1, 'Caregiver address is required'),
  caregiverPhone: z.string().min(1, 'Caregiver phone is required'),
  caregiverQualifications: z.string().optional(),
  caregiverReferences: z.array(z.string()).default([]),
  
  // Agreement Details
  agreementDate: z.string().min(1, 'Agreement date is required'),
  effectiveDate: z.string().min(1, 'Effective date is required'),
  
  // Care Services
  personalCareServices: z.boolean().default(false),
  companionshipServices: z.boolean().default(false),
  housekeepingServices: z.boolean().default(false),
  mealPreparation: z.boolean().default(false),
  medicationAssistance: z.boolean().default(false),
  transportationServices: z.boolean().default(false),
  
  // Specific Care Duties
  bathingAssistance: z.boolean().default(false),
  dressingAssistance: z.boolean().default(false),
  mobilityAssistance: z.boolean().default(false),
  toiletingAssistance: z.boolean().default(false),
  groomingAssistance: z.boolean().default(false),
  exerciseAssistance: z.boolean().default(false),
  
  // Household Services
  lightHousekeeping: z.boolean().default(false),
  laundryServices: z.boolean().default(false),
  shoppingServices: z.boolean().default(false),
  petCare: z.boolean().default(false),
  plantCare: z.boolean().default(false),
  
  // Medical and Health Services
  medicationReminders: z.boolean().default(false),
  medicationAdministration: z.boolean().default(false),
  vitalSigns: z.boolean().default(false),
  appointmentReminders: z.boolean().default(false),
  medicalTransportation: z.boolean().default(false),
  
  // Schedule and Hours
  scheduleType: z.enum(['live-in', 'hourly', 'daily', 'weekly', 'as-needed']),
  hoursPerWeek: z.string().optional(),
  specificSchedule: z.string().optional(),
  overnightCare: z.boolean().default(false),
  weekendCare: z.boolean().default(false),
  holidayCare: z.boolean().default(false),
  
  // Compensation
  compensationType: z.enum(['hourly-wage', 'daily-rate', 'weekly-salary', 'monthly-salary', 'live-in-rate']),
  compensationAmount: z.string().min(1, 'Compensation amount is required'),
  paymentFrequency: z.enum(['weekly', 'bi-weekly', 'monthly']),
  overtimeRate: z.string().optional(),
  
  // Benefits and Expenses
  mealProvision: z.boolean().default(false),
  transportationAllowance: z.boolean().default(false),
  healthInsurance: z.boolean().default(false),
  paidTimeOff: z.boolean().default(false),
  sickLeave: z.boolean().default(false),
  
  // Living Arrangements (for live-in care)
  liveInArrangement: z.boolean().default(false),
  privateRoom: z.boolean().default(false),
  privateBathroom: z.boolean().default(false),
  mealInclusion: z.boolean().default(false),
  utilitiesInclusion: z.boolean().default(false),
  
  // Professional Requirements
  backgroundCheck: z.boolean().default(true),
  licensureRequired: z.boolean().default(false),
  insuranceRequired: z.boolean().default(false),
  bondingRequired: z.boolean().default(false),
  cprCertification: z.boolean().default(false),
  
  // Emergency Procedures
  emergencyContacts: z.array(z.string()).default([]),
  emergencyProcedures: z.string().optional(),
  medicalEmergencyProtocol: z.string().optional(),
  hospitalInformation: z.string().optional(),
  
  // Confidentiality and Privacy
  confidentialityClause: z.boolean().default(true),
  privacyProtections: z.string().optional(),
  mediaRestrictions: z.boolean().default(true),
  visitorPolicy: z.string().optional(),
  
  // Substitution and Backup Care
  substituteCaregiver: z.boolean().default(false),
  backupCareArrangements: z.string().optional(),
  agencyBackup: z.boolean().default(false),
  
  // Performance Standards
  performanceExpectations: z.string().optional(),
  performanceReviews: z.boolean().default(false),
  reviewFrequency: z.enum(['monthly', 'quarterly', 'semi-annually', 'annually']).optional(),
  
  // Communication Requirements
  dailyReports: z.boolean().default(false),
  weeklyReports: z.boolean().default(false),
  familyCommunication: z.string().optional(),
  emergencyNotification: z.string().optional(),
  
  // Restrictions and Limitations
  smokingPolicy: z.enum(['prohibited', 'designated-areas', 'allowed']).default('prohibited'),
  alcoholPolicy: z.enum(['prohibited', 'off-duty-only', 'allowed']).default('prohibited'),
  visitorRestrictions: z.string().optional(),
  personalPhoneUse: z.enum(['prohibited', 'limited', 'emergency-only', 'allowed']).default('limited'),
  
  // Supplies and Equipment
  suppliesProvision: z.enum(['caregiver-provides', 'recipient-provides', 'shared']).default('recipient-provides'),
  equipmentProvision: z.enum(['caregiver-provides', 'recipient-provides', 'shared']).default('recipient-provides'),
  uniformRequirements: z.boolean().default(false),
  
  // Liability and Insurance
  liabilityInsurance: z.boolean().default(false),
  workersCompensation: z.boolean().default(false),
  liabilityLimitations: z.string().optional(),
  indemnificationClause: z.boolean().default(false),
  
  // Termination
  terminationNotice: z.string().optional(),
  terminationReasons: z.array(z.string()).default([]),
  severancePay: z.boolean().default(false),
  finalPayment: z.string().optional(),
  
  // Legal Compliance
  employmentLawCompliance: z.boolean().default(true),
  taxResponsibilities: z.string().optional(),
  workEligibility: z.boolean().default(true),
  
  // Modification and Amendments
  modificationClause: z.boolean().default(true),
  writtenAmendments: z.boolean().default(true),
  
  // Signatures
  requireRecipientSignature: z.boolean().default(true),
  requireCaregiverSignature: z.boolean().default(true),
  requireFamilySignature: z.boolean().default(false),
  requireNotarization: z.boolean().default(false),
});