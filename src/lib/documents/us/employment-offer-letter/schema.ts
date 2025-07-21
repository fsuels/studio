import { z } from 'zod';

export const schema = z.object({
  companyName: z.string().min(1, 'Company name is required.'),
  companyAddress: z.string().min(1, 'Company address is required.'),
  candidateName: z.string().min(1, 'Candidate name is required.'),
  candidateAddress: z.string().min(1, 'Candidate address is required.'),
  position: z.string().min(1, 'Position is required.'),
  department: z.string().optional(),
  startDate: z
    .string()
    .min(1, 'Start date is required.')
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  salary: z.string().min(1, 'Salary is required.'),
  payFrequency: z.enum(
    ['hourly', 'weekly', 'bi-weekly', 'monthly', 'annually'],
    {
      errorMap: () => ({ message: 'Please select pay frequency.' }),
    },
  ),
  benefits: z.string().optional(),
  reportingManager: z.string().min(1, 'Reporting manager is required.'),
  workSchedule: z.string().optional(),
  employmentType: z.enum(['full-time', 'part-time', 'contract', 'temporary'], {
    errorMap: () => ({ message: 'Please select employment type.' }),
  }),
  probationPeriod: z.string().optional(),
  signingBonus: z.string().optional(),
});
