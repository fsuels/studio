// src/lib/documents/us/advance-directive/schema.ts
import { z } from 'zod';
import { usStates } from '@/lib/usStates';

const stateEnum = z.enum(usStates.map((s) => s.value) as [string, ...string[]]);

const lifeSupportPreferenceEnum = z.enum([
  'to continue all available life-sustaining treatments',
  'to limit life-sustaining treatment to comfort-focused care',
  'to let my health care agent decide based on the circumstances',
]);

const cprPreferenceEnum = z.enum([
  'to receive cardiopulmonary resuscitation (CPR)',
  'to decline CPR and allow natural death',
  'to let my health care agent decide at the time',
]);

const nutritionHydrationPreferenceEnum = z.enum([
  'to provide artificial nutrition and hydration',
  'to withhold artificial nutrition and hydration',
  'to let my health care agent decide based on my prognosis',
]);

const organDonationPreferenceEnum = z.enum([
  'wishes to donate any organs or tissues permitted by law',
  'prefers to donate only the organs or tissues described below',
  'does not authorize organ or tissue donation',
]);

export const AdvanceDirectiveSchema = z.object({
  // Principal identity and execution
  principalFullName: z.string().min(3, "Principal's full name is required."),
  principalAddress: z.string().min(5, "Principal's address is required."),
  principalDateOfBirth: z.string().min(1, "Principal's date of birth is required."),
  principalSsnLast4: z
    .string()
    .regex(/^[0-9]{4}$/u, 'Enter the last four digits of the SSN.'),
  principalValuesStatement: z.string().optional(),
  principalSignatureDate: z.string().min(1, 'Signature date is required.'),
  directiveEffectiveDate: z.string().min(1, 'Effective date is required.'),

  // Primary agent
  primaryAgentName: z.string().min(3, "Primary agent's name is required."),
  primaryAgentAddress: z.string().min(5, "Primary agent's address is required."),
  primaryAgentPhone: z.string().min(7, "Primary agent's phone number is required."),
  primaryAgentEmail: z.string().email("Enter a valid email for the primary agent.").optional(),

  // Alternate agents
  alternateAgentOneName: z.string().optional(),
  alternateAgentOneAddress: z.string().optional(),
  alternateAgentOnePhone: z.string().optional(),
  alternateAgentTwoName: z.string().optional(),
  alternateAgentTwoAddress: z.string().optional(),
  alternateAgentTwoPhone: z.string().optional(),

  // Medical preferences
  lifeSupportPreference: lifeSupportPreferenceEnum,
  cprPreference: cprPreferenceEnum,
  nutritionHydrationPreference: nutritionHydrationPreferenceEnum,
  pregnancyDirective: z.string().optional(),
  mentalHealthDirective: z.string().optional(),
  qualityOfLifeStatement: z.string().optional(),\n  religiousOrCulturalRequests: z.string().optional(),

  // Organ donation
  organDonationPreference: organDonationPreferenceEnum,
  organDonationDetails: z.string().optional(),

  // Guardianship
  guardianNomineeName: z.string().optional(),
  disqualifiedGuardians: z.string().optional(),

  // Care coordination & contacts
  primaryPhysicianName: z.string().optional(),
  primaryPhysicianPhone: z.string().optional(),
  preferredHospitalName: z.string().optional(),
  preferredHospitalCity: z.string().optional(),
  spiritualAdvisorName: z.string().optional(),
  spiritualAdvisorPhone: z.string().optional(),
  careCoordinationNotes: z.string().optional(),

  // Distribution & storage
  emergencyDistributionList: z.string().optional(),
  directiveStorageLocation: z.string().optional(),
  reviewFrequency: z.string().optional(),

  // Legal & execution context
  governingState: stateEnum,
  notaryState: stateEnum,
  notaryCounty: z.string().min(1, 'Notary county is required.'),
  notaryDate: z.string().min(1, 'Notary acknowledgement date is required.'),
  notaryCommissionExpiration: z.string().optional(),

  // Witnesses
  witnessOneName: z.string().min(3, 'Witness one name is required.'),
  witnessOneSignatureDate: z.string().min(1, 'Witness one signature date is required.'),
  witnessTwoName: z.string().min(3, 'Witness two name is required.'),
  witnessTwoSignatureDate: z.string().min(1, 'Witness two signature date is required.'),
});

export type AdvanceDirectiveData = z.infer<typeof AdvanceDirectiveSchema>;
export const schema = AdvanceDirectiveSchema;

