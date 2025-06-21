import { z } from 'zod';

export const partnershipAmendmentSchema = z.object({
  originalPartnershipName: z.string().min(1),
  originalAgreementDate: z.string().min(1), // Date
  partnerNames: z.string().min(1),
  amendmentType: z.enum([
    'ownership_change',
    'profit_sharing',
    'management_change',
    'capital_contribution',
    'name_change',
    'other',
  ]),
  amendmentDescription: z.string().min(1),
  specificChanges: z.string().min(1),
  effectiveDate: z.string().min(1), // Date
  newPartnerInfo: z.string().optional(),
  departingPartnerInfo: z.string().optional(),
  capitalAdjustments: z.string().optional(),
  profitSharingChanges: z.string().optional(),
  managementChanges: z.string().optional(),
  otherProvisions: z.string().optional(),
  partnerApproval: z.boolean(),
  state: z.string().length(2),
});
