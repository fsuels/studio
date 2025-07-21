// src/lib/documents/us/separation-agreement/schema.ts
import { z } from 'zod';

export const SeparationAgreementSchema = z.object({
  // Party Information
  party1Name: z.string().min(1, 'First party name is required'),
  party1Address: z.string().optional(),
  party2Name: z.string().min(1, 'Second party name is required'),
  party2Address: z.string().optional(),

  // Relationship Details
  relationshipType: z
    .enum(['married', 'domestic-partnership', 'cohabitation'])
    .default('married'),
  relationshipStartDate: z.string().optional(),
  separationDate: z.string().optional(),

  // Property Division
  realProperty: z.string().optional(),
  personalProperty: z.string().optional(),
  vehicles: z.string().optional(),
  bankAccounts: z.string().optional(),
  investments: z.string().optional(),

  // Debt Division
  jointDebts: z.string().optional(),
  individualDebts: z.string().optional(),

  // Support Obligations
  financialSupport: z.boolean().default(false),
  supportAmount: z.string().optional(),
  supportDuration: z.string().optional(),

  // Children (if applicable)
  children: z.boolean().default(false),
  custodyArrangements: z.string().optional(),
  childSupport: z.string().optional(),

  // Living Arrangements
  residenceArrangements: z.string().optional(),

  // Signature Requirements
  party1Signature: z.boolean().default(true),
  party2Signature: z.boolean().default(true),
  notarization: z.boolean().default(true),
});
