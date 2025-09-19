import { z } from 'zod';
import { usStates } from '@/lib/usStates';

const stateEnum = z.enum(usStates.map((s) => s.value) as [string, ...string[]]);

export const serviceAgreementSchema = z.object({
  providerName: z.string().min(1, 'Service provider name is required.'),
  providerBusinessStructure: z.enum(
    ['sole-proprietor', 'llc', 'corporation', 'partnership', 'nonprofit', 'other'],
    {
      errorMap: () => ({ message: 'Select the provider business structure.' }),
    },
  ),
  providerAddress: z.string().optional(),
  clientName: z.string().min(1, 'Client name is required.'),
  clientBusinessStructure: z
    .enum(['individual', 'sole-proprietor', 'llc', 'corporation', 'partnership', 'nonprofit', 'government', 'other'])
    .optional(),
  clientAddress: z.string().optional(),
  serviceDescription: z.string().min(1, 'Describe the services being provided.'),
  projectScope: z.string().optional(),
  startDate: z
    .string()
    .regex(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/, 'Use YYYY-MM-DD format for the start date.'),
  completionDate: z
    .string()
    .regex(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/, 'Use YYYY-MM-DD format for the completion date.')
    .optional(),
  paymentStructure: z.enum(['flat-fee', 'hourly', 'milestone', 'retainer', 'time-and-materials']),
  paymentAmount: z.number().positive('Payment amount must be greater than zero.').optional(),
  paymentSchedule: z.enum([
    'on-acceptance',
    'weekly',
    'bi-weekly',
    'monthly',
    'upon-completion',
    'per-milestone',
  ]),
  expensesReimbursed: z.boolean().default(false),
  expensePolicy: z.string().optional(),
  deliverables: z.string().optional(),
  acceptanceCriteria: z.string().optional(),
  confidentiality: z.boolean().default(true),
  ipOwnership: z.enum(['service-provider', 'client', 'shared']),
  supportAndMaintenance: z.string().optional(),
  terminationNoticeDays: z.number().int().min(0, 'Notice period cannot be negative.').default(30),
  disputeResolution: z.enum(['negotiation', 'mediation', 'arbitration', 'litigation']),
  governingLawState: stateEnum,
  noticesEmail: z.string().email('Provide a valid email address for notices.').optional(),
});

export type ServiceAgreementData = z.infer<typeof serviceAgreementSchema>;
