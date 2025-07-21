import { z } from 'zod';

export const schema = z.object({
  employerName: z.string().min(1, 'Employer name is required.'),
  employerAddress: z.string().min(1, 'Employer address is required.'),
  employeeName: z.string().min(1, 'Employee name is required.'),
  employeePosition: z.string().optional(),
  terminationDate: z
    .string()
    .min(1, 'Termination date is required.')
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  terminationReason: z.string().optional(),
  finalPaycheckDate: z
    .string()
    .min(1, 'Final paycheck date is required.')
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  supervisorName: z.string().min(1, 'Supervisor name is required.'),
  supervisorTitle: z.string().min(1, 'Supervisor title is required.'),
});
