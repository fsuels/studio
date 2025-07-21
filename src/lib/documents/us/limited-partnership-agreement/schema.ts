import { z } from 'zod';

export const limitedPartnershipAgreementSchema = z.object({
  partnershipName: z.string().min(1),
  partnershipAddress: z.string().min(1),
  businessPurpose: z.string().min(1),
  generalPartnerName: z.string().min(1),
  generalPartnerAddress: z.string().min(1),
  generalPartnerContribution: z.string().min(1),
  limitedPartner1Name: z.string().min(1),
  limitedPartner1Address: z.string().min(1),
  limitedPartner1Contribution: z.string().min(1),
  limitedPartner1Percentage: z.string().min(1),
  additionalLimitedPartners: z.string().optional(),
  managementStructure: z.string().min(1),
  profitDistribution: z.string().min(1),
  lossAllocation: z.string().min(1),
  capitalAccounts: z.string().min(1),
  withdrawalRestrictions: z.string().optional(),
  transferRestrictions: z.string().optional(),
  dissolutionEvents: z.string().min(1),
  term: z.string().min(1),
  effectiveDate: z.string().min(1), // Date
  state: z.string().length(2),
});
