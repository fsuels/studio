// src/lib/documents/us/simple-will/schema.ts
import { z } from 'zod';

export const SimpleWillSchema = z.object({
  // Testator Information
  testatorName: z.string().min(1, 'Your full name is required'),
  testatorAddress: z.string().min(1, 'Your address is required'),
  testatorCounty: z.string().min(1, 'County is required'),
  testatorState: z.string().min(1, 'State is required'),

  // Executor Information
  executorName: z.string().min(1, 'Executor name is required'),
  executorAddress: z.string().min(1, 'Executor address is required'),
  executorRelationship: z.string().min(1, 'Executor relationship is required'),

  // Alternate Executor
  alternateExecutorName: z.string().optional(),
  alternateExecutorAddress: z.string().optional(),
  alternateExecutorRelationship: z.string().optional(),

  // Guardian for Minor Children (if applicable)
  hasMinorChildren: z.boolean().default(false),
  guardianName: z.string().optional(),
  guardianAddress: z.string().optional(),
  guardianRelationship: z.string().optional(),

  // Alternate Guardian
  alternateGuardianName: z.string().optional(),
  alternateGuardianAddress: z.string().optional(),

  // Beneficiaries
  primaryBeneficiary: z.string().min(1, 'Primary beneficiary is required'),
  primaryBeneficiaryRelationship: z.string().min(1, 'Relationship is required'),
  primaryBeneficiaryShare: z.string().default('100%'),

  // Additional Beneficiaries
  hasAdditionalBeneficiaries: z.boolean().default(false),
  additionalBeneficiaries: z
    .array(
      z.object({
        name: z.string(),
        relationship: z.string(),
        share: z.string(),
      }),
    )
    .default([]),

  // Specific Bequests
  hasSpecificBequests: z.boolean().default(false),
  specificBequests: z
    .array(
      z.object({
        item: z.string(),
        beneficiary: z.string(),
        description: z.string().optional(),
      }),
    )
    .default([]),

  // Residuary Estate
  residuaryBeneficiary: z.string().optional(),
  residuaryBeneficiaryRelationship: z.string().optional(),

  // Debts and Expenses
  debtPaymentInstructions: z.string().default('pay from estate'),

  // Additional Provisions
  additionalProvisions: z.string().optional(),

  // Witness Information
  witness1Name: z.string().optional(),
  witness1Address: z.string().optional(),
  witness2Name: z.string().optional(),
  witness2Address: z.string().optional(),

  // Signing Information
  signingDate: z.string().optional(),
  signingLocation: z.string().optional(),
});
