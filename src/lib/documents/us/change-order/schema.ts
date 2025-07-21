// src/lib/documents/us/change-order/schema.ts
import { z } from 'zod';

export const ChangeOrderSchema = z.object({
  // Reference Information
  originalContractNumber: z
    .string()
    .min(1, 'Original contract number is required'),
  originalContractDate: z.string().min(1, 'Original contract date is required'),
  changeOrderNumber: z.string().min(1, 'Change order number is required'),
  changeOrderDate: z.string().min(1, 'Change order date is required'),

  // Parties
  client: z.string().min(1, 'Client name is required'),
  clientAddress: z.string().min(1, 'Client address is required'),
  contractor: z.string().min(1, 'Contractor name is required'),
  contractorAddress: z.string().min(1, 'Contractor address is required'),

  // Change Details
  changeDescription: z.string().min(1, 'Change description is required'),
  reasonForChange: z.string().min(1, 'Reason for change is required'),
  changeType: z.enum([
    'scope',
    'timeline',
    'budget',
    'specifications',
    'resources',
    'other',
  ]),
  urgency: z.enum(['low', 'medium', 'high', 'critical']),

  // Scope Changes
  originalScope: z.string().optional(),
  revisedScope: z.string().optional(),
  addedWork: z.string().optional(),
  deletedWork: z.string().optional(),

  // Timeline Changes
  originalTimeline: z.string().optional(),
  revisedTimeline: z.string().optional(),
  originalDeadline: z.string().optional(),
  revisedDeadline: z.string().optional(),
  timeExtension: z.string().optional(),

  // Financial Impact
  originalContractValue: z.number().optional(),
  changeOrderValue: z.number().min(0, 'Change order value must be positive'),
  revisedContractValue: z.number().optional(),
  costBreakdown: z.string().optional(),
  additionalCosts: z.string().optional(),

  // Resources and Materials
  additionalResources: z.string().optional(),
  materialChanges: z.string().optional(),
  personnelChanges: z.string().optional(),
  equipmentChanges: z.string().optional(),

  // Impact Assessment
  scheduleImpact: z.string().optional(),
  budgetImpact: z.string().optional(),
  qualityImpact: z.string().optional(),
  riskImpact: z.string().optional(),
  stakeholderImpact: z.string().optional(),

  // Approval Process
  requestedBy: z.string().optional(),
  requestDate: z.string().optional(),
  approvedBy: z.string().optional(),
  approvalDate: z.string().optional(),
  approvalStatus: z
    .enum(['pending', 'approved', 'rejected', 'conditional'])
    .optional(),

  // Implementation
  implementationDate: z.string().optional(),
  implementationPlan: z.string().optional(),
  implementationResponsibilities: z.string().optional(),
  communicationPlan: z.string().optional(),

  // Documentation
  supportingDocuments: z.string().optional(),
  drawingsSpecifications: z.string().optional(),
  technicalRequirements: z.string().optional(),
  complianceConsiderations: z.string().optional(),

  // Terms and Conditions
  paymentTerms: z.string().optional(),
  warrantyImpact: z.string().optional(),
  liabilityChanges: z.string().optional(),
  insuranceRequirements: z.string().optional(),

  // Legal Considerations
  contractualBasis: z.string().optional(),
  legalReview: z.boolean().default(false),
  disputeResolution: z.string().optional(),
  governingLaw: z.string().optional(),

  // Additional Information
  assumptions: z.string().optional(),
  constraints: z.string().optional(),
  dependencies: z.string().optional(),
  additionalNotes: z.string().optional(),

  // Signatures
  clientSignatureDate: z.string().optional(),
  contractorSignatureDate: z.string().optional(),
  witnessRequired: z.boolean().default(false),
  effectiveDate: z.string().optional(),
});
