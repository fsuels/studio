// src/lib/documents/us/hipaa-authorization-form/schema.ts
import { z } from 'zod';

export const HipaaAuthorizationFormSchema = z.object({
  // Patient Information
  patientName: z.string().min(1, 'Patient name is required'),
  patientDateOfBirth: z.string().min(1, 'Patient date of birth is required'),
  patientAddress: z.string().min(1, 'Patient address is required'),
  patientPhone: z.string().optional(),
  patientSsn: z.string().optional(),

  // Authorizing Party (if different from patient)
  authorizerName: z.string().optional(),
  authorizerRelationship: z.string().optional(),
  legalAuthority: z.string().optional(),

  // Healthcare Provider Releasing Information
  releasingProviderName: z
    .string()
    .min(1, 'Releasing provider name is required'),
  releasingFacilityName: z.string().optional(),
  releasingAddress: z.string().optional(),
  releasingPhone: z.string().optional(),

  // Recipient of Information
  recipientName: z.string().min(1, 'Recipient name is required'),
  recipientOrganization: z.string().optional(),
  recipientAddress: z.string().optional(),
  recipientPhone: z.string().optional(),
  recipientFax: z.string().optional(),

  // Information to be Disclosed
  medicalRecords: z.boolean().default(false),
  labResults: z.boolean().default(false),
  imagingReports: z.boolean().default(false),
  mentalHealthRecords: z.boolean().default(false),
  substanceAbuseRecords: z.boolean().default(false),
  hivTestResults: z.boolean().default(false),
  entireMedicalRecord: z.boolean().default(false),
  specificRecords: z.string().optional(),

  // Date Range
  dateRangeSpecific: z.boolean().default(false),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  dateRangeDescription: z.string().optional(),

  // Purpose of Disclosure
  purposeDescription: z.string().min(1, 'Purpose description is required'),
  legalProceeding: z.boolean().default(false),
  insuranceClaim: z.boolean().default(false),
  continuedCare: z.boolean().default(false),
  personalUse: z.boolean().default(false),

  // Authorization Details
  authorizationDate: z.string().optional(),
  expirationDate: z.string().optional(),
  oneTimeDisclosure: z.boolean().default(false),
  ongoingDisclosure: z.boolean().default(false),

  // Patient Rights
  rightToRevoke: z.boolean().default(true),
  revocationMethod: z.string().optional(),
  rightToInspect: z.boolean().default(true),
  rightToCopy: z.boolean().default(true),

  // Special Provisions
  redisclosureRestriction: z.boolean().default(true),
  feeForCopies: z.boolean().default(false),
  urgentDisclosure: z.boolean().default(false),

  // Signature Requirements
  requirePatientSignature: z.boolean().default(true),
  requireAuthorizerSignature: z.boolean().default(false),
  requireWitnessSignature: z.boolean().default(false),
  notarizationRequired: z.boolean().default(false),
  electronicSignatureAccepted: z.boolean().default(true),
});
