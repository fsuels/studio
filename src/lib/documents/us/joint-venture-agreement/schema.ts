import { z } from 'zod';

export const jointVentureAgreementSchema = z.object({
  ventureName: z.string().min(1),
  ventureDescription: z.string().min(1),
  party1Name: z.string().min(1),
  party1Address: z.string().min(1),
  party1Type: z.enum(['individual', 'corporation', 'llc', 'partnership', 'other']),
  party2Name: z.string().min(1),
  party2Address: z.string().min(1),
  party2Type: z.enum(['individual', 'corporation', 'llc', 'partnership', 'other']),
  additionalParties: z.string().optional(),
  ventureObjectives: z.string().min(1),
  contributions: z.string().min(1),
  profitSharing: z.string().min(1),
  lossSharing: z.string().min(1),
  managementStructure: z.string().min(1),
  decisionMaking: z.string().min(1),
  intellectualProperty: z.string().min(1),
  confidentiality: z.string().min(1),
  terminationConditions: z.string().min(1),
  disputeResolution: z.enum(['mediation', 'arbitration', 'litigation']),
  term: z.string().min(1),
  governingLaw: z.string().min(1),
  effectiveDate: z.string().min(1), // Date
  state: z.string().length(2),
});