import { z } from 'zod';

export const schema = z.object({
  clientName: z.string().min(1),
  contractorName: z.string().min(1),
  serviceDescription: z.string().min(1),
  paymentTerms: z.string().min(1),
  startDate: z.string().min(1), // Date
  endDate: z.string().optional(), // Date
});
