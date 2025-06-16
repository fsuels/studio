import { z } from 'zod';

export const schema = z
  .object({
    landlord_name: z.string().min(1, 'Landlord name is required.'),
    tenant_name: z.string().min(1, 'Tenant name is required.'),
    property_address: z.string().min(1, 'Property address is required.'),
    lease_start: z.string().min(1, 'Lease start date is required.'),
    lease_term: z.coerce
      .number()
      .int()
      .positive('Lease term must be a positive integer.'),
    monthly_rent: z.coerce
      .number()
      .positive('Monthly rent must be a positive number.'),
    rent_due_date: z.string().min(1, 'Rent due date is required.'),
    security_deposit: z.coerce
      .number()
      .min(0, 'Security deposit must be non-negative.')
      .optional(),
    pets_allowed: z.enum(['yes', 'no', 'specific'], {
      errorMap: () => ({ message: 'Please select if pets are allowed.' }),
    }),
    pet_conditions: z.string().optional(),
    late_fee_policy: z.string().optional(),
    state: z.string().length(2, 'State must be 2 characters.'),
  })
  .refine(
    (data) =>
      data.pets_allowed === 'specific' ? !!data.pet_conditions : true,
    {
      message:
        'Pet conditions are required if pets are allowed with specific conditions',
      path: ['pet_conditions'],
    },
  );