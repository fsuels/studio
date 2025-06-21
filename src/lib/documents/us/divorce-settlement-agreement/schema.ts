import { z } from 'zod';

export const schema = z.object({
  spouse1Name: z.string().min(1, 'Spouse 1 name is required.'),
  spouse2Name: z.string().min(1, 'Spouse 2 name is required.'),
  dateOfMarriage: z
    .string()
    .min(1, 'Date of marriage is required.')
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  dateOfSeparation: z
    .string()
    .min(1, 'Date of separation is required.')
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  hasChildren: z.enum(['yes', 'no'], {
    errorMap: () => ({
      message: 'Please specify if there are minor children.',
    }),
  }),
  propertyDivision: z
    .string()
    .min(1, 'Property division details are required.'),
  spousalSupport: z.string().optional(),
  state: z.string().length(2, 'State must be 2 characters.'),
});
