import { z } from 'zod';

export const schema = z.object({
  // Placeholder - needs to be expanded with actual fields
  trustorName: z.string().min(1),
  trusteeName: z.string().min(1),
  successorTrusteeName: z.string().optional(),
  beneficiaryDetails: z.string().min(1),
  assets: z.string().min(1),
  distributionInstructions: z.string().min(1),
});
