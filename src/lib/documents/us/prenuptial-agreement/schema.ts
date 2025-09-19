import { z } from 'zod';
import { usStates } from '@/lib/usStates';

const stateEnum = z.enum(usStates.map((s) => s.value) as [string, ...string[]]);

export const prenuptialAgreementSchema = z.object({
  spouse1Name: z.string().min(1, 'First spouse name is required.'),
  spouse2Name: z.string().min(1, 'Second spouse name is required.'),
  weddingDate: z
    .string()
    .regex(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/, 'Use YYYY-MM-DD format for the wedding date.'),
  ceremonyState: stateEnum,
  primaryResidenceState: stateEnum,
  separatePropertyList: z.string().optional(),
  maritalPropertyPlan: z.string().optional(),
  debtResponsibilityPlan: z.string().optional(),
  spousalSupportPreference: z.enum(['waived', 'limited', 'custom', 'state-default']),
  spousalSupportDetails: z.string().optional(),
  sunsetClauseDate: z
    .string()
    .regex(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/, 'Use YYYY-MM-DD format for the sunset clause date.')
    .optional(),
  estatePlanningNotes: z.string().optional(),
  childrenFromPriorRelationships: z.boolean().default(false),
  independentCounsel: z.boolean().default(false),
  financialDisclosureComplete: z.boolean().default(true),
  disputeResolution: z.enum(['mediation', 'arbitration', 'litigation']),
  governingLawState: stateEnum,
  witnessRequirement: z
    .enum(['notary-only', 'witnesses-only', 'notary-plus-witnesses'])
    .default('notary-plus-witnesses'),
});

export type PrenuptialAgreementData = z.infer<typeof prenuptialAgreementSchema>;
