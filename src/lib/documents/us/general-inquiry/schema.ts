import { z } from 'zod';

export const schema = z.object({
  inquiryDetails: z
    .string()
    .min(10, 'Please provide more details about your situation.'),
  desiredOutcome: z.string().optional(),
  state: z.string().length(2).optional(),
});
