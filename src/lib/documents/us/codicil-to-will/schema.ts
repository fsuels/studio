// src/lib/documents/us/codicil-to-will/schema.ts
import { z } from 'zod';

export const CodicilToWillSchema = z.object({
  // Testator Information
  testatorName: z.string().min(1, 'Testator name is required'),
  testatorAddress: z.string().min(1, 'Testator address is required'),
  testatorCounty: z.string().min(1, 'County is required'),
  testatorState: z.string().min(1, 'State is required'),

  // Original Will Information
  originalWillDate: z.string().min(1, 'Original will date is required'),
  originalWillLocation: z.string().optional(),

  // Amendment Type
  amendmentType: z.enum(['addition', 'deletion', 'modification', 'revocation']),

  // Amendment Details
  amendmentDescription: z.string().min(1, 'Amendment description is required'),
  specificClause: z.string().optional(),

  // New Provisions (for additions)
  newProvisions: z.string().optional(),

  // Beneficiary Changes
  beneficiaryChanges: z.string().optional(),
  newBeneficiaryName: z.string().optional(),
  newBeneficiaryRelationship: z.string().optional(),
  newBeneficiaryShare: z.string().optional(),

  // Executor Changes
  executorChanges: z.boolean().default(false),
  newExecutorName: z.string().optional(),
  newExecutorAddress: z.string().optional(),
  newExecutorRelationship: z.string().optional(),

  // Guardian Changes (for minor children)
  guardianChanges: z.boolean().default(false),
  newGuardianName: z.string().optional(),
  newGuardianAddress: z.string().optional(),

  // Revocation of Specific Provisions
  revocationDetails: z.string().optional(),

  // Confirmation
  confirmRemainingTerms: z.boolean().default(true),

  // Witness Information
  witness1Name: z.string().optional(),
  witness1Address: z.string().optional(),
  witness2Name: z.string().optional(),
  witness2Address: z.string().optional(),

  // Execution
  executionDate: z.string().optional(),
  executionLocation: z.string().optional(),
});
