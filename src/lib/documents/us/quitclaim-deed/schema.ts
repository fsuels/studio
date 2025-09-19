import { z } from 'zod';
import { usStates } from '@/lib/usStates';

const stateEnum = z.enum(usStates.map((s) => s.value) as [string, ...string[]]);

export const quitclaimDeedSchema = z.object({
  grantorName: z.string().min(1, 'Grantor name is required.'),
  grantorMaritalStatus: z
    .enum(['single', 'married', 'widowed', 'divorced', 'domestic-partnership', 'unknown'])
    .optional(),
  granteeName: z.string().min(1, 'Grantee name is required.'),
  granteeMaritalStatus: z
    .enum(['single', 'married', 'widowed', 'divorced', 'domestic-partnership', 'unknown'])
    .optional(),
  transferDate: z
    .string()
    .regex(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/, 'Use YYYY-MM-DD format for the transfer date.'),
  considerationAmount: z
    .number()
    .min(0, 'Consideration must be zero or greater.'),
  conveyanceType: z.enum(['gift', 'sale', 'divorce', 'estate', 'other']).default('sale'),
  propertyStreetAddress: z.string().min(1, 'Property street address is required.'),
  propertyCity: z.string().min(1, 'Property city is required.'),
  propertyState: stateEnum,
  propertyCounty: z.string().min(1, 'Property county is required.'),
  propertyLegalDescription: z
    .string()
    .min(1, 'Provide a legal description or attach as an exhibit.'),
  parcelNumber: z.string().optional(),
  liensOrEncumbrances: z.string().optional(),
  afterRecordingName: z.string().min(1, 'Provide the name for return of the recorded deed.'),
  afterRecordingAddress: z
    .string()
    .min(1, 'Provide the mailing address for the recorded deed.'),
  taxStatementRecipient: z.string().optional(),
  witnessesRequired: z.boolean().default(false),
  notaryCounty: z.string().optional(),
  specialInstructions: z.string().optional(),
});

export type QuitclaimDeedData = z.infer<typeof quitclaimDeedSchema>;
