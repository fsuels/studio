// src/lib/documents/us/royalty-agreement/schema.ts
import { z } from 'zod';

export const RoyaltyAgreementSchema = z.object({
  licensorName: z.string().min(1, 'Licensor name is required.'),
  licensorAddress: z.string().min(1, 'Licensor address is required.'),
  licenseeName: z.string().min(1, 'Licensee name is required.'),
  licenseeAddress: z.string().min(1, 'Licensee address is required.'),
  intellectualProperty: z
    .string()
    .min(1, 'Intellectual property description is required.'),
  royaltyRate: z.string().min(1, 'Royalty rate is required.'),
  royaltyBase: z.enum(['net-sales', 'gross-sales', 'units', 'revenue'], {
    errorMap: () => ({ message: 'Royalty base is required.' }),
  }),
  minimumRoyalty: z.string().optional(),
  paymentSchedule: z.enum(['monthly', 'quarterly', 'annually', 'other'], {
    errorMap: () => ({ message: 'Payment schedule is required.' }),
  }),
  territoryScope: z.string().min(1, 'Territory scope is required.'),
  termDuration: z.string().min(1, 'Term duration is required.'),
  effectiveDate: z
    .string()
    .min(1, 'Effective date is required.')
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  exclusiveRights: z.boolean().optional(),
  auditRights: z.boolean().optional(),
  terminationClause: z.string().optional(),
});

export type RoyaltyAgreementData = z.infer<typeof RoyaltyAgreementSchema>;
