import { z } from 'zod';

export const partnershipDissolutionAgreementSchema = z.object({
  partnershipName: z.string().min(1),
  originalAgreementDate: z.string().min(1), // Date
  partnerNames: z.string().min(1),
  dissolutionReason: z.enum(['mutual_agreement', 'expiration', 'partner_withdrawal', 'breach', 'bankruptcy', 'death', 'other']),
  dissolutionDate: z.string().min(1), // Date
  businessAssets: z.string().min(1),
  businessLiabilities: z.string().min(1),
  assetDistribution: z.string().min(1),
  liabilityAllocation: z.string().min(1),
  liquidationProcess: z.string().min(1),
  continuingObligations: z.string().optional(),
  nonCompeteTerms: z.string().optional(),
  confidentialityTerms: z.string().optional(),
  finalAccounting: z.string().min(1),
  releaseClaims: z.boolean(),
  disputeResolution: z.enum(['mediation', 'arbitration', 'litigation']),
  effectiveDate: z.string().min(1), // Date
  state: z.string().length(2),
});