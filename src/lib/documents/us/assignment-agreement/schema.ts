// src/lib/documents/us/assignment-agreement/schema.ts
import { z } from 'zod';

export const assignmentAgreementSchema = z.object({
  // Assignor Information
  assignorName: z.string().min(1, 'Assignor name is required'),
  assignorAddress: z.string().min(1, 'Assignor address is required'),
  assignorType: z.enum(['individual', 'corporation', 'llc', 'partnership']),
  assignorTitle: z.string().optional(),

  // Assignee Information
  assigneeName: z.string().min(1, 'Assignee name is required'),
  assigneeAddress: z.string().min(1, 'Assignee address is required'),
  assigneeType: z.enum(['individual', 'corporation', 'llc', 'partnership']),
  assigneeTitle: z.string().optional(),

  // Original Contract Information
  originalContractTitle: z
    .string()
    .min(1, 'Original contract title is required'),
  originalContractDate: z.string().min(1, 'Original contract date is required'),
  originalContractParties: z
    .string()
    .min(1, 'Original contract parties are required'),
  contractDescription: z.string().min(1, 'Contract description is required'),

  // Assignment Details
  assignmentType: z.enum(['complete', 'partial']),
  rightsAssigned: z.string().min(1, 'Rights being assigned must be specified'),
  obligationsAssigned: z
    .string()
    .min(1, 'Obligations being assigned must be specified'),
  assignmentDate: z.string().min(1, 'Assignment date is required'),
  assignmentConsideration: z.string().min(1, 'Consideration is required'),

  // Warranties and Representations
  assignorWarranties: z.boolean(),
  validContract: z.boolean(),
  noBreachExists: z.boolean(),
  rightToAssign: z.boolean(),

  // Consent and Notice
  consentRequired: z.boolean(),
  consentObtained: z.boolean().optional(),
  noticeRequired: z.boolean(),
  noticeGiven: z.boolean().optional(),

  // Liabilities
  liabilityRelease: z.boolean(),
  liabilityRetention: z.string().optional(),
  indemnificationClause: z.boolean(),

  // Governing Law
  governingState: z.string().min(1, 'Governing state is required'),
  disputeResolution: z.enum(['courts', 'arbitration', 'mediation']),

  // Additional Terms
  additionalTerms: z.string().optional(),
  specialConditions: z.string().optional(),

  // Execution
  executionDate: z.string().min(1, 'Execution date is required'),
  assignorSignature: z.string().min(1, 'Assignor signature is required'),
  assigneeSignature: z.string().min(1, 'Assignee signature is required'),
  witnessRequired: z.boolean(),
  witnessName: z.string().optional(),
  witnessSignature: z.string().optional(),
  notaryRequired: z.boolean(),
  notaryName: z.string().optional(),
  notaryCommission: z.string().optional(),
});
