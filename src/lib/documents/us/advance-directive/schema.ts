// src/lib/documents/us/advance-directive/schema.ts
import { z } from 'zod';

export const AdvanceDirectiveSchema = z.object({
  // Principal Information
  principalName: z.string().min(1, "Principal's name is required."),
  principalAddress: z.string().min(1, "Principal's address is required."),
  principalCity: z.string().min(1, "Principal's city is required."),
  principalState: z.string().length(2, 'State must be 2 characters.'),
  principalZip: z.string().min(5, 'ZIP code must be at least 5 characters.'),
  principalPhone: z.string().min(10, "Principal's phone number is required."),
  principalDateOfBirth: z
    .string()
    .min(1, "Principal's date of birth is required."),

  // Health Care Agent Information
  agentName: z.string().min(1, "Health care agent's name is required."),
  agentAddress: z.string().min(1, "Health care agent's address is required."),
  agentCity: z.string().min(1, "Health care agent's city is required."),
  agentState: z.string().length(2, 'State must be 2 characters.'),
  agentZip: z.string().min(5, 'ZIP code must be at least 5 characters.'),
  agentPhone: z
    .string()
    .min(10, "Health care agent's phone number is required."),
  agentRelationship: z
    .string()
    .min(1, "Agent's relationship to principal is required."),

  // Alternate Agent Information (Optional)
  hasAlternateAgent: z.boolean().default(false),
  alternateAgentName: z.string().optional(),
  alternateAgentAddress: z.string().optional(),
  alternateAgentCity: z.string().optional(),
  alternateAgentState: z.string().optional(),
  alternateAgentZip: z.string().optional(),
  alternateAgentPhone: z.string().optional(),
  alternateAgentRelationship: z.string().optional(),

  // Medical Treatment Preferences
  lifeSustainingTreatment: z
    .enum(['continue', 'discontinue', 'undecided'])
    .default('undecided'),
  artificialNutrition: z
    .enum(['provide', 'withhold', 'undecided'])
    .default('undecided'),
  painMedication: z
    .enum(['provide', 'withhold', 'undecided'])
    .default('provide'),
  comfortCare: z.enum(['provide', 'withhold', 'undecided']).default('provide'),

  // Additional Instructions
  additionalInstructions: z.string().optional(),
  specificMedicalConditions: z.string().optional(),
  religiousBeliefs: z.string().optional(),

  // Organ Donation
  organDonation: z.enum(['yes', 'no', 'undecided']).default('undecided'),
  organDonationSpecific: z.string().optional(),

  // Witness Information
  witness1Name: z.string().min(1, 'First witness name is required.'),
  witness1Address: z.string().min(1, 'First witness address is required.'),
  witness2Name: z.string().min(1, 'Second witness name is required.'),
  witness2Address: z.string().min(1, 'Second witness address is required.'),

  // Legal Information
  state: z.string().length(2, 'State must be 2 characters.'),
  county: z.string().min(1, 'County is required.'),
  dateCreated: z.string().min(1, 'Date created is required.'),
});

export const schema = AdvanceDirectiveSchema;
