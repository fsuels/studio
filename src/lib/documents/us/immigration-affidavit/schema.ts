// src/lib/documents/us/immigration-affidavit/schema.ts
import { z } from 'zod';

export const ImmigrationAffidavitSchema = z.object({
  // Affiant Information
  affiantName: z.string().min(1, 'Affiant name is required'),
  affiantAddress: z.string().min(1, 'Affiant address is required'),
  affiantPhone: z.string().optional(),
  affiantEmail: z.string().email().optional(),
  affiantCitizenship: z.enum(['us-citizen', 'permanent-resident', 'other']).default('us-citizen'),
  
  // Beneficiary Information
  beneficiaryName: z.string().min(1, 'Beneficiary name is required'),
  beneficiaryAddress: z.string().optional(),
  beneficiaryCountryOfOrigin: z.string().optional(),
  beneficiaryDateOfBirth: z.string().optional(),
  relationshipToBeneficiary: z.string().min(1, 'Relationship is required'),
  
  // Affidavit Type
  affidavitType: z.enum(['support', 'relationship', 'character', 'employment', 'financial']).default('support'),
  purpose: z.string().min(1, 'Purpose of affidavit is required'),
  immigrationProcess: z.string().optional(),
  
  // Relationship Details
  relationshipDuration: z.string().optional(),
  howRelationshipBegan: z.string().optional(),
  frequencyOfContact: z.string().optional(),
  sharedActivities: z.string().optional(),
  
  // Financial Support
  willingToProvideSupport: z.boolean().default(false),
  annualIncome: z.string().optional(),
  employmentStatus: z.string().optional(),
  employer: z.string().optional(),
  financialAssets: z.string().optional(),
  
  // Character Witness
  characterAssessment: z.string().optional(),
  moralCharacter: z.boolean().default(true),
  lawAbidingCitizen: z.boolean().default(true),
  specificExamples: z.string().optional(),
  
  // Employment Information
  employmentHistory: z.string().optional(),
  jobOfferDetails: z.string().optional(),
  employerInformation: z.string().optional(),
  workExperience: z.string().optional(),
  
  // Supporting Documents
  documentsAttached: z.boolean().default(false),
  documentsList: z.string().optional(),
  additionalEvidence: z.string().optional(),
  
  // Sworn Statement
  swornStatement: z.string().min(1, 'Sworn statement is required'),
  truthfulnessAffirmation: z.boolean().default(true),
  penaltyOfPerjury: z.boolean().default(true),
  
  // Notarization
  notarizationRequired: z.boolean().default(true),
  notaryDate: z.string().optional(),
  notaryLocation: z.string().optional(),
  
  // Signature Requirements
  requireAffiantSignature: z.boolean().default(true),
  requireNotarySignature: z.boolean().default(true),
  witnessRequired: z.boolean().default(false),
  electronicSignatureAccepted: z.boolean().default(false),
});