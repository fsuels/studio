import { z } from 'zod';

export const privatePlacementMemorandumSchema = z.object({
  companyName: z.string().min(1),
  companyAddress: z.string().min(1),
  companyStateOfIncorporation: z.string().length(2),
  offeringType: z.enum(['equity', 'debt', 'convertible', 'preferred_stock']),
  totalOfferingAmount: z.string().min(1),
  minimumInvestment: z.string().min(1),
  useOfProceeds: z.string().min(1),
  businessDescription: z.string().min(1),
  managementTeam: z.string().min(1),
  riskFactors: z.string().min(1),
  financialHighlights: z.string().min(1),
  termsOfOffering: z.string().min(1),
  closingDate: z.string().min(1), // Date
  placementAgent: z.string().optional(),
  transferRestrictions: z.string().min(1),
  exemptionProvision: z.enum(['506b', '506c', '504', '505']),
  accreditedInvestorOnly: z.boolean(),
  state: z.string().length(2),
});
