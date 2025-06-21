// src/lib/documents/us/contract-amendment/schema.ts
import { z } from 'zod';

export const ContractAmendmentSchema = z.object({
  // Original Contract Information
  originalContractTitle: z
    .string()
    .min(1, 'Original contract title is required'),
  originalContractDate: z.string().min(1, 'Original contract date is required'),
  originalContractParties: z
    .string()
    .min(1, 'Original contract parties are required'),
  contractReference: z.string().optional(),

  // Amendment Information
  amendmentNumber: z.string().min(1, 'Amendment number is required'),
  amendmentDate: z.string().min(1, 'Amendment date is required'),
  amendmentEffectiveDate: z
    .string()
    .min(1, 'Amendment effective date is required'),

  // Parties Information
  partyOneName: z.string().min(1, 'First party name is required'),
  partyOneAddress: z.string().min(1, 'First party address is required'),
  partyOneType: z.enum(['individual', 'corporation', 'llc', 'partnership']),

  partyTwoName: z.string().min(1, 'Second party name is required'),
  partyTwoAddress: z.string().min(1, 'Second party address is required'),
  partyTwoType: z.enum(['individual', 'corporation', 'llc', 'partnership']),

  // Amendment Details
  amendmentType: z.enum([
    'modification',
    'addition',
    'deletion',
    'clarification',
    'extension',
    'termination_date_change',
  ]),

  sectionsAmended: z
    .string()
    .min(1, 'Sections being amended must be specified'),
  originalLanguage: z.string().min(1, 'Original contract language is required'),
  amendedLanguage: z.string().min(1, 'New amended language is required'),
  reasonForAmendment: z.string().min(1, 'Reason for amendment is required'),

  // Additional Changes
  priceAdjustment: z.boolean(),
  newPrice: z.string().optional(),
  priceChangeReason: z.string().optional(),

  timelineAdjustment: z.boolean(),
  newDeadline: z.string().optional(),
  timelineChangeReason: z.string().optional(),

  scopeChange: z.boolean(),
  scopeChangeDescription: z.string().optional(),

  // Legal Provisions
  severabilityClause: z.boolean(),
  remainingTermsValid: z.boolean(),
  amendmentPrecedence: z.boolean(),

  // Approval and Authority
  partyOneAuthorizedRepresentative: z
    .string()
    .min(1, 'Party one representative is required'),
  partyOneTitle: z.string().optional(),
  partyTwoAuthorizedRepresentative: z
    .string()
    .min(1, 'Party two representative is required'),
  partyTwoTitle: z.string().optional(),

  // Governing Law
  governingState: z.string().min(1, 'Governing state is required'),
  disputeResolution: z.enum(['courts', 'arbitration', 'mediation']),

  // Additional Terms
  additionalTerms: z.string().optional(),
  specialConditions: z.string().optional(),

  // Execution
  executionDate: z.string().min(1, 'Execution date is required'),
  witnessRequired: z.boolean(),
  witnessName: z.string().optional(),
  notaryRequired: z.boolean(),
});
