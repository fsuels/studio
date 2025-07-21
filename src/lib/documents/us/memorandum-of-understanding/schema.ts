// src/lib/documents/us/memorandum-of-understanding/schema.ts
import { z } from 'zod';

export const MemorandumOfUnderstandingSchema = z.object({
  // Parties
  party1Name: z.string().min(1, 'First party name is required'),
  party1Type: z.enum([
    'individual',
    'corporation',
    'llc',
    'partnership',
    'government',
    'nonprofit',
  ]),
  party1Address: z.string().min(1, 'First party address is required'),
  party1Representative: z.string().optional(),
  party1Title: z.string().optional(),

  party2Name: z.string().min(1, 'Second party name is required'),
  party2Type: z.enum([
    'individual',
    'corporation',
    'llc',
    'partnership',
    'government',
    'nonprofit',
  ]),
  party2Address: z.string().min(1, 'Second party address is required'),
  party2Representative: z.string().optional(),
  party2Title: z.string().optional(),

  // MOU Details
  mouTitle: z.string().min(1, 'MOU title is required'),
  mouPurpose: z.string().min(1, 'MOU purpose is required'),
  background: z.string().optional(),
  objectives: z.string().min(1, 'Objectives are required'),

  // Scope and Responsibilities
  party1Responsibilities: z
    .string()
    .min(1, 'First party responsibilities are required'),
  party2Responsibilities: z
    .string()
    .min(1, 'Second party responsibilities are required'),
  mutualBenefits: z.string().optional(),

  // Resources and Support
  party1Resources: z.string().optional(),
  party2Resources: z.string().optional(),
  financialCommitments: z.string().optional(),
  resourceSharing: z.string().optional(),

  // Timeline
  effectiveDate: z.string().min(1, 'Effective date is required'),
  expirationDate: z.string().optional(),
  duration: z.string().optional(),
  renewalTerms: z.string().optional(),

  // Communication and Coordination
  primaryContact1: z.string().optional(),
  primaryContact2: z.string().optional(),
  meetingSchedule: z.string().optional(),
  reportingRequirements: z.string().optional(),
  communicationProtocols: z.string().optional(),

  // Intellectual Property and Confidentiality
  ipOwnership: z.enum(['party1', 'party2', 'shared', 'retained']).optional(),
  confidentialityClause: z.boolean().default(false),
  confidentialityTerms: z.string().optional(),

  // Legal and Compliance
  governingLaw: z.string().optional(),
  complianceRequirements: z.string().optional(),
  disputeResolution: z
    .enum(['negotiation', 'mediation', 'arbitration'])
    .optional(),

  // Termination
  terminationClause: z.string().optional(),
  noticePeriod: z.string().default('30 days'),
  terminationReasons: z.string().optional(),

  // Additional Terms
  performanceMetrics: z.string().optional(),
  reviewSchedule: z.string().optional(),
  amendmentProcess: z.string().optional(),
  additionalTerms: z.string().optional(),

  // Signatures
  party1SignatureDate: z.string().optional(),
  party2SignatureDate: z.string().optional(),
});
