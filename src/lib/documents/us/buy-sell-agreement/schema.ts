import { z } from 'zod';

export const buySellAgreementSchema = z.object({
  companyName: z.string().min(1),
  companyType: z.enum(['llc', 'corporation', 'partnership', 'other']),
  companyAddress: z.string().min(1),
  owner1Name: z.string().min(1),
  owner1Address: z.string().min(1),
  owner1Ownership: z.string().min(1),
  owner2Name: z.string().min(1),
  owner2Address: z.string().min(1),
  owner2Ownership: z.string().min(1),
  additionalOwners: z.string().optional(),
  triggeringEvents: z.array(z.string()).min(1),
  valuationMethod: z.enum(['fair_market_value', 'book_value', 'formula', 'appraisal', 'multiple']),
  valuationDetails: z.string().min(1),
  paymentTerms: z.string().min(1),
  fundingMechanism: z.enum(['installments', 'life_insurance', 'company_funds', 'external_financing']),
  rightOfFirstRefusal: z.boolean(),
  restrictionsOnTransfer: z.string().optional(),
  disputeResolution: z.enum(['mediation', 'arbitration', 'litigation']),
  effectiveDate: z.string().min(1), // Date
  state: z.string().length(2),
});