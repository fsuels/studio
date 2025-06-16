import { z } from 'zod';

export const partnershipAgreementSchema = z.object({
  partner1Name: z.string().min(1),
  partner1Address: z.string().min(1),
  partner2Name: z.string().min(1),
  partner2Address: z.string().min(1),
  businessName: z.string().min(1),
  businessAddress: z.string().min(1),
  startDate: z.string().min(1), // Date
  capitalContributions: z.string().min(1),
  profitSplit: z.string().min(1),
  managementRoles: z.string().optional(),
  dissolutionTerms: z.string().optional(),
  state: z.string().length(2),
});