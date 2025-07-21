// src/lib/documents/us/business-contract/schema.ts
import { z } from 'zod';

export const BusinessContractSchema = z.object({
  // Parties
  party1Name: z.string().min(1, 'Party 1 name is required'),
  party1Type: z.enum(['individual', 'corporation', 'llc', 'partnership']),
  party1Address: z.string().min(1, 'Party 1 address is required'),
  party1Contact: z.string().optional(),

  party2Name: z.string().min(1, 'Party 2 name is required'),
  party2Type: z.enum(['individual', 'corporation', 'llc', 'partnership']),
  party2Address: z.string().min(1, 'Party 2 address is required'),
  party2Contact: z.string().optional(),

  // Contract Details
  contractType: z.enum([
    'goods',
    'services',
    'partnership',
    'distribution',
    'consulting',
  ]),
  contractTitle: z.string().min(1, 'Contract title is required'),
  contractDescription: z.string().min(1, 'Contract description is required'),

  // Terms
  effectiveDate: z.string().min(1, 'Effective date is required'),
  expirationDate: z.string().optional(),
  termLength: z.string().optional(),
  autoRenewal: z.boolean().default(false),

  // Financial Terms
  hasPayment: z.boolean().default(false),
  paymentAmount: z.number().optional(),
  paymentSchedule: z
    .enum(['one-time', 'monthly', 'quarterly', 'annually', 'milestone-based'])
    .optional(),
  paymentTerms: z.string().optional(),
  lateFees: z.string().optional(),

  // Deliverables
  deliverables: z.string().optional(),
  deliverySchedule: z.string().optional(),
  performanceStandards: z.string().optional(),

  // Intellectual Property
  ipOwnership: z.enum(['party1', 'party2', 'shared', 'retained']).optional(),
  ipProvisions: z.string().optional(),

  // Confidentiality
  confidentialityClause: z.boolean().default(false),
  confidentialityTerms: z.string().optional(),

  // Termination
  terminationClause: z.string().optional(),
  noticePeriod: z.string().default('30 days'),
  terminationReasons: z.string().optional(),

  // Liability and Indemnification
  liabilityLimitation: z.string().optional(),
  indemnificationClause: z.string().optional(),
  insuranceRequirements: z.string().optional(),

  // Dispute Resolution
  disputeResolution: z
    .enum(['litigation', 'arbitration', 'mediation'])
    .optional(),
  governingLaw: z.string().optional(),
  jurisdiction: z.string().optional(),

  // Additional Terms
  additionalTerms: z.string().optional(),
  specialProvisions: z.string().optional(),

  // Signatures
  party1SignatureDate: z.string().optional(),
  party2SignatureDate: z.string().optional(),
});
