import { z } from 'zod';

export const schema = z
  .object({
    landlordName: z.string().min(1, 'Landlord name is required.'),
    tenantName: z.string().min(1, 'Tenant name is required.'),
    propertyAddress: z.string().min(1, 'Property address is required.'),
    reasonForEviction: z.enum(
      ['nonpayment', 'leaseViolation', 'endOfTerm', 'other'],
      {
        errorMap: () => ({ message: 'Please select a reason for eviction.' }),
      },
    ),
    reasonDetails: z.string().optional(),
    noticeDate: z.string().min(1, 'Notice date is required.').regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
    vacateDate: z.string().min(1, 'Vacate date is required.').regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
    state: z.string().length(2, 'State must be 2 characters.'),
  })
  .refine(
    (data) =>
      data.reasonForEviction === 'leaseViolation' ||
      data.reasonForEviction === 'other'
        ? !!data.reasonDetails
        : true,
    {
      message:
        "Details are required if reason is 'Lease Violation' or 'Other'",
      path: ['reasonDetails'],
    },
  );