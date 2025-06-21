// src/lib/documents/us/telemedicine-agreement/schema.ts
import { z } from 'zod';

export const TelemedicineAgreementSchema = z.object({
  // Healthcare Provider Information
  providerName: z.string().min(1, 'Provider name is required'),
  providerLicense: z.string().optional(),
  providerSpecialty: z.string().optional(),
  clinicName: z.string().optional(),
  providerAddress: z.string().optional(),
  providerPhone: z.string().optional(),
  providerEmail: z.string().email().optional(),

  // Patient Information
  patientName: z.string().min(1, 'Patient name is required'),
  patientDateOfBirth: z.string().optional(),
  patientAddress: z.string().optional(),
  patientPhone: z.string().optional(),
  patientEmail: z.string().email().optional(),
  emergencyContact: z.string().optional(),

  // Telemedicine Services
  serviceType: z
    .enum([
      'consultation',
      'diagnosis',
      'treatment',
      'follow-up',
      'prescription',
      'monitoring',
    ])
    .default('consultation'),
  serviceDescription: z.string().optional(),
  consultationType: z
    .enum(['video', 'phone', 'chat', 'hybrid'])
    .default('video'),
  appointmentDuration: z.string().optional(),

  // Technology Requirements
  platformUsed: z.string().optional(),
  technicalRequirements: z.string().optional(),
  internetRequirements: z.string().optional(),
  deviceRequirements: z.string().optional(),
  backupCommunication: z.string().optional(),

  // Scheduling
  appointmentScheduling: z.string().optional(),
  cancellationPolicy: z.string().optional(),
  reschedulingPolicy: z.string().optional(),
  noShowPolicy: z.string().optional(),
  emergencyProcedures: z.string().optional(),

  // Medical History and Records
  medicalHistoryRequired: z.boolean().default(true),
  recordsAccess: z.boolean().default(true),
  electronicRecords: z.boolean().default(true),
  recordsSharing: z.boolean().default(false),
  priorAuthorizationNeeded: z.boolean().default(false),

  // Clinical Limitations
  serviceLimitations: z.string().optional(),
  physicalExamLimitations: z.string().optional(),
  diagnosticLimitations: z.string().optional(),
  emergencyLimitations: z.string().optional(),
  referralRequirements: z.string().optional(),

  // Prescription Services
  prescriptionServices: z.boolean().default(false),
  controlledSubstances: z.boolean().default(false),
  pharmacyIntegration: z.boolean().default(false),
  prescriptionDelivery: z.boolean().default(false),
  medicationMonitoring: z.boolean().default(false),

  // Privacy and Security
  hipaaCompliance: z.boolean().default(true),
  dataEncryption: z.boolean().default(true),
  recordingConsent: z.boolean().default(false),
  dataStorageLocation: z.string().optional(),
  dataRetentionPeriod: z.string().optional(),

  // Informed Consent
  informedConsentObtained: z.boolean().default(true),
  risksExplained: z.boolean().default(true),
  benefitsExplained: z.boolean().default(true),
  alternativesDiscussed: z.boolean().default(true),
  consentWithdrawal: z.boolean().default(true),

  // Payment and Insurance
  insuranceCoverage: z.boolean().default(false),
  paymentMethod: z
    .enum(['insurance', 'self-pay', 'subscription', 'per-visit'])
    .default('self-pay'),
  consultationFee: z.string().optional(),
  insuranceCopay: z.string().optional(),
  billingProcedures: z.string().optional(),

  // Quality of Care
  standardOfCare: z.string().optional(),
  qualityAssurance: z.boolean().default(true),
  patientSafety: z.string().optional(),
  clinicalGuidelines: z.string().optional(),
  continuityOfCare: z.string().optional(),

  // Emergency Protocols
  emergencyContacts: z.string().optional(),
  localEmergencyServices: z.string().optional(),
  urgentCareReferral: z.string().optional(),
  disconnectionProtocol: z.string().optional(),
  technicalFailure: z.string().optional(),

  // Follow-up Care
  followUpRequired: z.boolean().default(false),
  followUpTimeline: z.string().optional(),
  inPersonReferral: z.boolean().default(false),
  specialistReferral: z.boolean().default(false),
  continuingCare: z.string().optional(),

  // Professional Standards
  licensureCompliance: z.boolean().default(true),
  stateRegulations: z.string().optional(),
  professionalLiability: z.boolean().default(true),
  malpracticeInsurance: z.boolean().default(true),

  // Patient Rights
  patientRights: z.string().optional(),
  accessToRecords: z.boolean().default(true),
  secondOpinion: z.boolean().default(true),
  grievanceProcedures: z.string().optional(),
  patientAdvocacy: z.string().optional(),

  // Technical Support
  technicalSupport: z.boolean().default(true),
  userTraining: z.boolean().default(false),
  troubleshooting: z.string().optional(),
  platformSupport: z.string().optional(),

  // Legal and Regulatory
  stateCompliance: z.boolean().default(true),
  federalCompliance: z.boolean().default(true),
  crossStatePractice: z.boolean().default(false),
  internationalServices: z.boolean().default(false),

  // Termination
  terminationRights: z.string().optional(),
  terminationProcedures: z.string().optional(),
  recordsTransfer: z.boolean().default(true),
  continuingCareArrangements: z.string().optional(),

  // Dispute Resolution
  disputeResolution: z
    .enum(['discussion', 'mediation', 'arbitration', 'state-board'])
    .default('discussion'),
  governingLaw: z.string().optional(),
  jurisdiction: z.string().optional(),
  professionalBoards: z.string().optional(),

  // Signature Requirements
  requireProviderSignature: z.boolean().default(true),
  requirePatientSignature: z.boolean().default(true),
  witnessRequired: z.boolean().default(false),
  notarizationRequired: z.boolean().default(false),
  electronicSignatureAccepted: z.boolean().default(true),
});
