import { z } from 'zod';

export const residentialLeaseAgreementSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email required').optional(),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(2, 'State is required'),
  zipCode: z.string().min(5, 'Valid ZIP code required'),
  date: z.string().min(1, 'Date is required'),
  propertyAddress: z.string().min(1, 'Property address required'),
  rentAmount: z.number().min(0, 'Rent amount must be positive').optional(),
  leaseTerms: z.string().min(1, 'Lease terms required').optional(),
});

export type ResidentialLeaseAgreementData = z.infer<
  typeof residentialLeaseAgreementSchema
>;
