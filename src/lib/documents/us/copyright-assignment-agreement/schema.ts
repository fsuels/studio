// src/lib/documents/us/copyright-assignment-agreement/schema.ts
import { z } from 'zod';

export const CopyrightAssignmentAgreementSchema = z.object({
  // Assignor Information (Original Owner)
  assignorName: z.string().min(1, 'Assignor name is required'),
  assignorAddress: z.string().min(1, 'Assignor address is required'),
  assignorType: z.enum([
    'individual',
    'corporation',
    'partnership',
    'llc',
    'other',
  ]),

  // Assignee Information (New Owner)
  assigneeName: z.string().min(1, 'Assignee name is required'),
  assigneeAddress: z.string().min(1, 'Assignee address is required'),
  assigneeType: z.enum([
    'individual',
    'corporation',
    'partnership',
    'llc',
    'other',
  ]),

  // Agreement Details
  assignmentDate: z.string().min(1, 'Assignment date is required'),
  effectiveDate: z.string().min(1, 'Effective date is required'),

  // Work Information
  workTitle: z.string().min(1, 'Work title is required'),
  workDescription: z.string().min(1, 'Work description is required'),
  workType: z.enum([
    'literary',
    'musical',
    'dramatic',
    'choreographic',
    'pictorial',
    'graphic',
    'sculptural',
    'motion-picture',
    'sound-recording',
    'architectural',
    'software',
    'other',
  ]),
  creationDate: z.string().optional(),
  completionDate: z.string().optional(),

  // Copyright Details
  copyrightRegistered: z.boolean().default(false),
  registrationNumber: z.string().optional(),
  registrationDate: z.string().optional(),

  // Assignment Scope
  assignmentType: z.enum([
    'complete',
    'partial',
    'exclusive-license',
    'non-exclusive-license',
  ]),
  territoryScope: z.enum([
    'worldwide',
    'united-states',
    'specific-countries',
    'specific-regions',
  ]),
  specificTerritory: z.string().optional(),

  // Rights Assigned
  rightOfReproduction: z.boolean().default(true),
  rightOfDistribution: z.boolean().default(true),
  rightOfPublicPerformance: z.boolean().default(true),
  rightOfPublicDisplay: z.boolean().default(true),
  rightOfPreparation: z.boolean().default(true),
  rightOfDigitalTransmission: z.boolean().default(true),
  moralRights: z.boolean().default(false),

  // Term and Duration
  assignmentTerm: z.enum([
    'perpetual',
    'life-plus-70',
    'specific-years',
    'specific-date',
  ]),
  specificYears: z.string().optional(),
  terminationDate: z.string().optional(),

  // Consideration
  hasConsideration: z.boolean().default(true),
  considerationType: z
    .enum(['monetary', 'royalty', 'other-works', 'services', 'other'])
    .optional(),
  monetaryAmount: z.string().optional(),
  royaltyPercentage: z.string().optional(),
  otherConsideration: z.string().optional(),

  // Warranties and Representations
  warrantyOfOwnership: z.boolean().default(true),
  warrantyOfOriginality: z.boolean().default(true),
  warrantyNoInfringement: z.boolean().default(true),
  warrantyNoEncumbrances: z.boolean().default(true),
  warrantyAuthorized: z.boolean().default(true),

  // Additional Terms
  creditRequirement: z.boolean().default(false),
  creditText: z.string().optional(),
  approvalRights: z.boolean().default(false),
  reversionRights: z.boolean().default(false),

  // Derivative Works
  allowDerivativeWorks: z.boolean().default(true),
  derivativeWorkRights: z.string().optional(),
  approvalForDerivatives: z.boolean().default(false),

  // Collaboration and Co-ownership
  hasCollaborators: z.boolean().default(false),
  collaboratorConsent: z.boolean().default(false),
  joinOwnership: z.boolean().default(false),

  // Indemnification
  assignorIndemnifies: z.boolean().default(true),
  assigneeIndemnifies: z.boolean().default(false),
  mutualIndemnification: z.boolean().default(false),

  // Governing Law
  governingLaw: z.string().optional(),
  jurisdiction: z.string().optional(),
  disputeResolution: z
    .enum(['litigation', 'arbitration', 'mediation'])
    .optional(),

  // Recordation
  recordWithCopyrightOffice: z.boolean().default(true),
  recordingResponsibility: z
    .enum(['assignor', 'assignee', 'both'])
    .default('assignee'),

  // Future Works
  includeFutureWorks: z.boolean().default(false),
  futureWorksDescription: z.string().optional(),

  // Execution Requirements
  requireAssignorSignature: z.boolean().default(true),
  requireAssigneeSignature: z.boolean().default(true),
  requireNotarization: z.boolean().default(true),
  requireWitnessSignature: z.boolean().default(false),

  // Additional Provisions
  entireAgreement: z.boolean().default(true),
  severability: z.boolean().default(true),
  amendment: z.boolean().default(true),
  bindingEffect: z.boolean().default(true),
});
