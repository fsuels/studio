// src/lib/documents/us/affidavit-of-identity/schema.ts
import { z } from 'zod';

export const AffidavitOfIdentitySchema = z.object({
  // Affiant Information
  affiantName: z.string().min(1, 'Affiant name is required'),
  affiantAddress: z.string().optional(),
  affiantPhone: z.string().optional(),
  affiantEmail: z.string().email().optional(),
  affiantOccupation: z.string().optional(),
  
  // Identity Verification
  dateOfBirth: z.string().optional(),
  placeOfBirth: z.string().optional(),
  socialSecurityNumber: z.string().optional(),
  driversLicenseNumber: z.string().optional(),
  stateOfIssuance: z.string().optional(),
  
  // Alternative Names
  aliasesUsed: z.boolean().default(false),
  formerNames: z.string().optional(),
  nicknamesUsed: z.string().optional(),
  maidenName: z.string().optional(),
  
  // Physical Description
  height: z.string().optional(),
  weight: z.string().optional(),
  eyeColor: z.string().optional(),
  hairColor: z.string().optional(),
  distinguishingMarks: z.string().optional(),
  
  // Purpose of Affidavit
  purposeOfAffidavit: z.string().optional(),
  requestingOrganization: z.string().optional(),
  documentNeeded: z.string().optional(),
  
  // Sworn Statement
  swornStatement: z.string().optional(),
  truthAndAccuracy: z.boolean().default(true),
  underPenaltyOfPerjury: z.boolean().default(true),
  
  // Date and Location
  affidavitDate: z.string().optional(),
  affidavitLocation: z.string().optional(),
  
  // Signature Requirements
  affiantSignature: z.boolean().default(true),
  notarization: z.boolean().default(true),
  notaryCommissionExpiration: z.string().optional(),
});