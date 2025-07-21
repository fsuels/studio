// src/lib/documents/us/consulting-agreement/schema.ts
import { z } from 'zod';

export const ConsultingAgreementSchema = z.object({
  // Parties
  consultantName: z.string().min(1, 'Consultant name is required'),
  consultantType: z.enum(['individual', 'corporation', 'llc']),
  consultantAddress: z.string().min(1, 'Consultant address is required'),
  consultantPhone: z.string().optional(),
  consultantEmail: z.string().email().optional(),

  clientName: z.string().min(1, 'Client name is required'),
  clientType: z.enum(['individual', 'corporation', 'llc']),
  clientAddress: z.string().min(1, 'Client address is required'),
  clientContact: z.string().optional(),

  // Engagement Details
  serviceDescription: z.string().min(1, 'Service description is required'),
  consultingType: z.enum([
    'strategic',
    'technical',
    'marketing',
    'financial',
    'hr',
    'legal',
    'other',
  ]),
  projectScope: z.string().min(1, 'Project scope is required'),

  // Term and Schedule
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional(),
  termLength: z.string().optional(),
  timeCommitment: z.enum([
    'full-time',
    'part-time',
    'as-needed',
    'project-based',
  ]),
  workSchedule: z.string().optional(),

  // Deliverables
  deliverables: z.string().optional(),
  deliverySchedule: z.string().optional(),
  milestones: z.string().optional(),

  // Compensation
  compensationType: z.enum([
    'hourly',
    'daily',
    'monthly',
    'project-fee',
    'retainer',
  ]),
  hourlyRate: z.number().optional(),
  projectFee: z.number().optional(),
  retainerAmount: z.number().optional(),
  paymentSchedule: z.enum([
    'weekly',
    'bi-weekly',
    'monthly',
    'upon-completion',
    'milestone-based',
  ]),
  paymentTerms: z.string().optional(),

  // Expenses
  expenseReimbursement: z.boolean().default(false),
  expensePolicy: z.string().optional(),
  expenseApprovalRequired: z.boolean().default(false),

  // Work Arrangement
  workLocation: z.enum(['on-site', 'remote', 'hybrid']),
  clientPremisesAccess: z.boolean().default(false),
  equipmentProvided: z.boolean().default(false),
  equipmentDetails: z.string().optional(),

  // Intellectual Property
  ipOwnership: z.enum(['consultant', 'client', 'shared']),
  ipLicense: z.string().optional(),
  workForHire: z.boolean().default(false),

  // Confidentiality
  confidentialityClause: z.boolean().default(true),
  confidentialityPeriod: z.string().optional(),
  confidentialityTerms: z.string().optional(),

  // Non-Compete and Non-Solicitation
  nonCompeteClause: z.boolean().default(false),
  nonCompetePeriod: z.string().optional(),
  nonSolicitationClause: z.boolean().default(false),

  // Performance Standards
  performanceMetrics: z.string().optional(),
  qualityStandards: z.string().optional(),
  reportingRequirements: z.string().optional(),

  // Termination
  terminationNotice: z.string().default('30 days'),
  terminationCause: z.string().optional(),
  terminationProcedure: z.string().optional(),

  // Liability and Insurance
  liabilityLimitation: z.string().optional(),
  insuranceRequirements: z.string().optional(),
  indemnificationClause: z.string().optional(),

  // Additional Terms
  additionalTerms: z.string().optional(),
  specialProvisions: z.string().optional(),

  // Signatures
  consultantSignatureDate: z.string().optional(),
  clientSignatureDate: z.string().optional(),
});
