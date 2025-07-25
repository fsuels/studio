import { z } from 'zod';

export const schema = z.object({
  trustorName: z.string().min(1, 'Trustor name is required'),
  originalTrustName: z.string().min(1, 'Original trust name is required'),
  originalTrustDate: z.string().min(1, 'Original trust date is required'),
  amendmentNumber: z.string().min(1, 'Amendment number is required'),
  amendmentDate: z.string().min(1, 'Amendment date is required'),
  amendmentType: z.enum([
    'beneficiary_change',
    'trustee_change',
    'distribution_change',
    'asset_change',
    'other',
  ]),
  specificChanges: z.string().min(1, 'Specific changes must be described'),
  sectionBeingAmended: z.string().min(1, 'Section being amended is required'),
  newLanguage: z.string().min(1, 'New language/terms are required'),
  replacementClause: z.string().optional(),
  additionalProvisions: z.string().optional(),
  trustorSignature: z.string().min(1, 'Trustor signature is required'),
  witnessOneName: z.string().min(1, 'First witness name is required'),
  witnessOneSignature: z.string().min(1, 'First witness signature is required'),
  witnessTwoName: z.string().min(1, 'Second witness name is required'),
  witnessTwoSignature: z
    .string()
    .min(1, 'Second witness signature is required'),
  notaryName: z.string().optional(),
  notaryCommission: z.string().optional(),
  notaryExpiration: z.string().optional(),
  executionState: z.string().min(1, 'State of execution is required'),
  executionCounty: z.string().min(1, 'County of execution is required'),
});
