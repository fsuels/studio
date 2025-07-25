import { z } from 'zod';

export const schema = z.object({
  testatorName: z.string().min(1, 'Testator name is required'),
  testatorAddress: z.string().min(1, 'Testator address is required'),
  trustName: z.string().min(1, 'Trust name is required'),
  trustDate: z.string().min(1, 'Trust date is required'),
  executor: z.string().min(1, 'Executor name is required'),
  executorAddress: z.string().min(1, 'Executor address is required'),
  backupExecutor: z.string().optional(),
  backupExecutorAddress: z.string().optional(),
  guardianOfMinorChildren: z.string().optional(),
  guardianAddress: z.string().optional(),
  specificBequests: z.string().optional(),
  residualClause: z.string().min(1, 'Residual clause is required'),
  witnessOneName: z.string().min(1, 'First witness name is required'),
  witnessOneAddress: z.string().min(1, 'First witness address is required'),
  witnessTwoName: z.string().min(1, 'Second witness name is required'),
  witnessTwoAddress: z.string().min(1, 'Second witness address is required'),
  notaryName: z.string().optional(),
  notaryCommission: z.string().optional(),
  executionDate: z.string().min(1, 'Execution date is required'),
  executionState: z.string().min(1, 'State of execution is required'),
  executionCounty: z.string().min(1, 'County of execution is required'),
});
