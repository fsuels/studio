// src/lib/documents/us/elder-care-agreement/schema.ts
import { z } from 'zod';

export const ElderCareAgreementSchema = z.object({
  // Client Information
  clientName: z.string().min(1, 'Client name is required'),
  clientAddress: z.string().optional(),
  clientPhone: z.string().optional(),
  clientEmail: z.string().email().optional(),
  clientAge: z.string().optional(),
  clientBirthDate: z.string().optional(),
  medicalConditions: z.string().optional(),
  medications: z.string().optional(),
  
  // Family Contact Information
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
  emergencyContactRelationship: z.string().optional(),
  primaryFamilyContact: z.string().optional(),
  powerOfAttorney: z.string().optional(),
  
  // Caregiver Information
  caregiverName: z.string().min(1, 'Caregiver name is required'),
  caregiverAddress: z.string().optional(),
  caregiverPhone: z.string().optional(),
  caregiverEmail: z.string().email().optional(),
  caregiverLicense: z.string().optional(),
  caregiverCertifications: z.string().optional(),
  caregiverExperience: z.string().optional(),
  
  // Care Services
  personalCare: z.boolean().default(false),
  medicationAssistance: z.boolean().default(false),
  mealPreparation: z.boolean().default(false),
  housekeeping: z.boolean().default(false),
  transportation: z.boolean().default(false),
  companionship: z.boolean().default(false),
  medicalAppointments: z.boolean().default(false),
  specializedCare: z.string().optional(),
  
  // Schedule
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  schedule: z.enum(['hourly', 'daily', 'live-in', 'overnight', 'part-time', 'full-time']).default('daily'),
  hoursPerDay: z.string().optional(),
  daysPerWeek: z.string().optional(),
  specificTimes: z.string().optional(),
  
  // Compensation
  hourlyRate: z.string().optional(),
  dailyRate: z.string().optional(),
  weeklyRate: z.string().optional(),
  monthlyRate: z.string().optional(),
  paymentSchedule: z.enum(['weekly', 'bi-weekly', 'monthly']).default('weekly'),
  paymentMethod: z.enum(['cash', 'check', 'direct-deposit', 'online']).default('check'),
  
  // Benefits
  healthInsurance: z.boolean().default(false),
  paidTimeOff: z.boolean().default(false),
  sickLeave: z.boolean().default(false),
  holidayPay: z.boolean().default(false),
  overtimePay: z.boolean().default(false),
  
  // Responsibilities
  caregiverDuties: z.string().optional(),
  familyResponsibilities: z.string().optional(),
  communicationRequirements: z.string().optional(),
  reportingRequirements: z.string().optional(),
  
  // Medical Care
  medicationReminders: z.boolean().default(false),
  vitalsMonitoring: z.boolean().default(false),
  doctorAppointments: z.boolean().default(false),
  medicalRecords: z.boolean().default(false),
  emergencyProcedures: z.string().optional(),
  
  // Safety and Security
  backgroundCheck: z.boolean().default(true),
  references: z.boolean().default(true),
  bonding: z.boolean().default(false),
  insurance: z.boolean().default(true),
  emergencyContacts: z.string().optional(),
  
  // Living Arrangements
  livingArrangement: z.enum(['client-home', 'caregiver-home', 'facility', 'other']).default('client-home'),
  roomAndBoard: z.boolean().default(false),
  utilities: z.boolean().default(false),
  foodAllowance: z.boolean().default(false),
  
  // Termination
  terminationNotice: z.string().optional(),
  terminationCause: z.string().optional(),
  finalPay: z.string().optional(),
  returnOfProperty: z.boolean().default(true),
  
  // Confidentiality
  confidentialityAgreement: z.boolean().default(true),
  hipaaCompliance: z.boolean().default(true),
  privacyRights: z.boolean().default(true),
  medicalPrivacy: z.boolean().default(true),
  
  // Legal Compliance
  backgroundChecks: z.boolean().default(true),
  stateRegulations: z.boolean().default(true),
  workerCompensation: z.boolean().default(false),
  taxCompliance: z.boolean().default(true),
  
  // Special Needs
  dementiaCare: z.boolean().default(false),
  alzheimers Care: z.boolean().default(false),
  physicalDisability: z.boolean().default(false),
  mobilityAssistance: z.boolean().default(false),
  specialDiet: z.boolean().default(false),
  
  // Communication
  communicationLanguage: z.enum(['english', 'spanish', 'other']).default('english'),
  interpretationNeeds: z.boolean().default(false),
  familyUpdates: z.enum(['daily', 'weekly', 'as-needed']).default('as-needed'),
  
  // Technology
  medicalAlerts: z.boolean().default(false),
  monitoringSystems: z.boolean().default(false),
  communicationDevices: z.boolean().default(false),
  emergencyDevices: z.boolean().default(false),
  
  // Quality Assurance
  careQuality: z.string().optional(),
  performanceReviews: z.boolean().default(false),
  familyFeedback: z.boolean().default(true),
  improvementPlans: z.boolean().default(false),
  
  // Financial Management
  budgetManagement: z.boolean().default(false),
  billPaying: z.boolean().default(false),
  shoppingServices: z.boolean().default(false),
  financialReporting: z.boolean().default(false),
  
  // Health Monitoring
  healthTracking: z.boolean().default(false),
  weightMonitoring: z.boolean().default(false),
  exerciseAssistance: z.boolean().default(false),
  therapyAssistance: z.boolean().default(false),
  
  // Legal Terms
  governingLaw: z.string().optional(),
  jurisdiction: z.string().optional(),
  disputeResolution: z.enum(['mediation', 'arbitration', 'court']).default('mediation'),
  attorneyFees: z.boolean().default(false),
  
  // Signature Requirements
  clientSignature: z.boolean().default(true),
  caregiverSignature: z.boolean().default(true),
  familySignature: z.boolean().default(false),
  witnessSignature: z.boolean().default(false),
  notarization: z.boolean().default(false),
});