import { z } from 'zod';

export const schema = z.object({
  // Placeholder - needs to be expanded with actual fields
  declarantName: z.string().min(1),
  declarantAddress: z.string().min(1),
  lifeSustainPreference: z.enum(['withdraw', 'continue', 'limited']),
  nutritionHydrationPreference: z.enum(['withdraw', 'continue', 'limited']),
  painManagementPreference: z.string().min(1),
  organDonation: z.enum(['yes', 'no', 'specific']).optional(),
  organDonationDetails: z.string().optional(),
  additionalWishes: z.string().optional(),
});