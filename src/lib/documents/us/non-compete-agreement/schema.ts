import { z } from 'zod';

export const schema = z.object({
  companyName: z.string().min(1),
  employeeName: z.string().min(1),
  restrictedActivities: z.string().min(1),
  geographicScope: z.string().optional(),
  durationMonths: z.coerce.number().int().positive(),
});
