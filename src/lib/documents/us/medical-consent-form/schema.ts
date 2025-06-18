// src/lib/documents/us/medical-consent-form/schema.ts
import { z } from 'zod';

export const MedicalConsentFormSchema = z.object({
  // Patient Information
  patientName: z.string().min(1, 'Patient name is required'),
  patientDateOfBirth: z.string().min(1, 'Patient date of birth is required'),
  patientAddress: z.string().min(1, 'Patient address is required'),
  patientPhone: z.string().optional(),
  patientEmail: z.string().email().optional(),
  
  // Guardian Information (if minor)
  isMinor: z.boolean().default(false),
  guardianName: z.string().optional(),
  guardianRelationship: z.string().optional(),
  guardianAddress: z.string().optional(),
  guardianPhone: z.string().optional(),
  
  // Healthcare Provider
  providerName: z.string().min(1, 'Provider name is required'),
  facilityName: z.string().optional(),
  providerAddress: z.string().optional(),
  providerPhone: z.string().optional(),
  
  // Medical Information
  treatmentDescription: z.string().min(1, 'Treatment description is required'),
  medicalCondition: z.string().optional(),
  procedureName: z.string().optional(),
  alternativeTreatments: z.string().optional(),
  
  // Consent Details
  consentForTreatment: z.boolean().default(true),
  emergencyTreatment: z.boolean().default(false),
  generalTreatment: z.boolean().default(false),
  specificProcedure: z.boolean().default(false),
  
  // Risks and Benefits
  risksExplained: z.boolean().default(true),
  benefitsExplained: z.boolean().default(true),
  alternativesDiscussed: z.boolean().default(true),
  questionsAnswered: z.boolean().default(true),
  
  // Authorization
  consentDuration: z.string().optional(),
  effectiveDate: z.string().optional(),
  expirationDate: z.string().optional(),
  
  // Special Provisions
  photographyConsent: z.boolean().default(false),
  researchConsent: z.boolean().default(false),
  informationSharing: z.boolean().default(false),
  
  // Signature Requirements
  requirePatientSignature: z.boolean().default(true),
  requireGuardianSignature: z.boolean().default(false),
  requireWitnessSignature: z.boolean().default(false),
  notarizationRequired: z.boolean().default(false),
  electronicSignatureAccepted: z.boolean().default(true),
});