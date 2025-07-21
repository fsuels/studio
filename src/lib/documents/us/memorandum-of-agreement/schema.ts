// src/lib/documents/us/memorandum-of-agreement/schema.ts
import { z } from 'zod';

export const MemorandumOfAgreementSchema = z.object({
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

  // Agreement Details
  agreementTitle: z.string().min(1, 'Agreement title is required'),
  agreementPurpose: z.string().min(1, 'Agreement purpose is required'),
  background: z.string().optional(),
  scope: z.string().min(1, 'Scope is required'),

  // Terms and Conditions
  party1Obligations: z.string().min(1, 'First party obligations are required'),
  party2Obligations: z.string().min(1, 'Second party obligations are required'),
  mutualObligations: z.string().optional(),
  performanceStandards: z.string().optional(),

  // Financial Terms
  hasFinancialTerms: z.boolean().default(false),
  paymentTerms: z.string().optional(),
  financialObligations: z.string().optional(),
  costSharing: z.string().optional(),
  budgetAllocation: z.string().optional(),

  // Timeline
  effectiveDate: z.string().min(1, 'Effective date is required'),
  expirationDate: z.string().optional(),
  duration: z.string().optional(),
  milestones: z.string().optional(),
  deliverySchedule: z.string().optional(),

  // Governance and Management
  governanceStructure: z.string().optional(),
  decisionMaking: z.string().optional(),
  communicationProtocol: z.string().optional(),
  meetingRequirements: z.string().optional(),
  reportingRequirements: z.string().optional(),

  // Risk Management
  riskAllocation: z.string().optional(),
  insuranceRequirements: z.string().optional(),
  liabilityLimitation: z.string().optional(),
  indemnificationClause: z.string().optional(),

  // Intellectual Property
  ipOwnership: z.enum(['party1', 'party2', 'shared', 'retained']).optional(),
  ipLicensing: z.string().optional(),
  confidentialityClause: z.boolean().default(false),
  confidentialityTerms: z.string().optional(),

  // Compliance and Legal
  governingLaw: z.string().optional(),
  complianceRequirements: z.string().optional(),
  regulatoryConsiderations: z.string().optional(),
  disputeResolution: z
    .enum(['negotiation', 'mediation', 'arbitration', 'litigation'])
    .optional(),

  // Termination
  terminationClause: z.string().optional(),
  noticePeriod: z.string().default('30 days'),
  terminationReasons: z.string().optional(),
  breachProvisions: z.string().optional(),

  // Amendment and Modification
  amendmentProcess: z.string().optional(),
  modificationProcedure: z.string().optional(),
  approvalRequirements: z.string().optional(),

  // Additional Terms
  forcemajeure: z.string().optional(),
  successorBinding: z.boolean().default(false),
  severabilityClause: z.boolean().default(true),
  additionalTerms: z.string().optional(),

  // Signatures
  party1SignatureDate: z.string().optional(),
  party2SignatureDate: z.string().optional(),
  witnessRequired: z.boolean().default(false),
  notarizationDate: z.string().optional(),
});
