import { z } from 'zod';

export const schema = z.object({
  testatorName: z.string().min(1, "Testator's name is required."),
  testatorAddress: z.string().min(1, "Testator's address is required."),
  executorName: z.string().min(1, "Executor's name is required."),
  executorAddress: z.string().min(1, "Executor's address is required."),
  alternateExecutorName: z.string().optional(),
  beneficiaries: z.string().min(1, 'Beneficiary details are required.'),
  guardianForMinors: z.string().optional(),
  state: z.string().length(2, 'State must be 2 characters.'),
});
