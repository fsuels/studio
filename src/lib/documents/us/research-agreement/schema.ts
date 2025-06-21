// src/lib/documents/us/research-agreement/schema.ts
import { z } from 'zod';

export const ResearchAgreementSchema = z.object({
  // Lead Institution/Researcher
  leadInstitution: z.string().min(1, 'Lead institution is required'),
  leadResearcher: z.string().min(1, 'Lead researcher is required'),
  institutionAddress: z.string().optional(),
  institutionContact: z.string().optional(),

  // Collaborating Party
  collaboratorName: z.string().min(1, 'Collaborator name is required'),
  collaboratorInstitution: z.string().optional(),
  collaboratorAddress: z.string().optional(),
  collaboratorContact: z.string().optional(),

  // Research Project
  projectTitle: z.string().min(1, 'Project title is required'),
  researchDescription: z.string().min(1, 'Research description is required'),
  researchObjectives: z.string().optional(),
  expectedOutcomes: z.string().optional(),
  researchDuration: z.string().optional(),

  // Funding and Budget
  fundingSource: z.string().optional(),
  totalBudget: z.string().optional(),
  budgetAllocation: z.string().optional(),
  expenseSharing: z
    .enum(['equal', 'proportional', 'lead-pays', 'separate'])
    .optional(),

  // Data and Materials
  dataSharing: z.boolean().default(true),
  dataOwnership: z.enum(['lead', 'shared', 'separate']).default('shared'),
  materialSharing: z.boolean().default(false),
  sampleProvision: z.boolean().default(false),

  // Intellectual Property
  ipOwnership: z
    .enum(['lead', 'shared', 'proportional', 'separate'])
    .default('shared'),
  patentRights: z.boolean().default(false),
  publicationRights: z.boolean().default(true),
  commercializationRights: z.boolean().default(false),

  // Publications
  publicationPolicy: z.string().optional(),
  authorshipOrder: z.string().optional(),
  acknowledgmentRequirements: z.boolean().default(true),
  prePublicationReview: z.boolean().default(true),

  // Confidentiality
  confidentialityClause: z.boolean().default(true),
  proprietaryInformation: z.boolean().default(true),
  publicationRestrictions: z.string().optional(),

  // Ethical Compliance
  irbApproval: z.boolean().default(false),
  ethicsCompliance: z.boolean().default(true),
  humanSubjects: z.boolean().default(false),
  animalSubjects: z.boolean().default(false),

  // Responsibilities
  leadResponsibilities: z.string().optional(),
  collaboratorResponsibilities: z.string().optional(),
  reportingRequirements: z.string().optional(),

  // Timeline
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  milestones: z.string().optional(),
  deliverables: z.string().optional(),

  // Termination
  terminationConditions: z.string().optional(),
  dataReturnRequirements: z.boolean().default(true),
  postTerminationRights: z.string().optional(),

  // Legal Terms
  governingLaw: z.string().optional(),
  jurisdiction: z.string().optional(),
  disputeResolution: z
    .enum(['negotiation', 'mediation', 'arbitration'])
    .optional(),

  // Signature Requirements
  requireLeadSignature: z.boolean().default(true),
  requireCollaboratorSignature: z.boolean().default(true),
  requireInstitutionalSignature: z.boolean().default(false),
  witnessRequired: z.boolean().default(false),
  notarizationRequired: z.boolean().default(false),
  electronicSignatureAccepted: z.boolean().default(true),
});
