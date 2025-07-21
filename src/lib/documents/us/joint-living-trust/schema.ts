import { z } from 'zod';

export const schema = z.object({
  trustorOneName: z.string().min(1, 'First trustor name is required'),
  trustorTwoName: z.string().min(1, 'Second trustor name is required'),
  trustName: z.string().min(1, 'Trust name is required'),
  trustDate: z.string().min(1, 'Trust date is required'),
  marriageDate: z.string().min(1, 'Marriage date is required'),
  marriageState: z.string().min(1, 'Marriage state is required'),
  trustorOneAddress: z.string().min(1, 'Trustor one address is required'),
  trustorTwoAddress: z.string().min(1, 'Trustor two address is required'),
  initialTrustees: z.string().min(1, 'Initial trustees are required'),
  successorTrustee: z.string().min(1, 'Successor trustee is required'),
  successorTrusteeAddress: z
    .string()
    .min(1, 'Successor trustee address is required'),
  backupSuccessorTrustee: z.string().optional(),
  backupSuccessorTrusteeAddress: z.string().optional(),
  trustPurpose: z.string().min(1, 'Trust purpose is required'),
  jointAssets: z.string().min(1, 'Joint assets description is required'),
  separateAssetsSpouseOne: z.string().optional(),
  separateAssetsSpouseTwo: z.string().optional(),
  distributionDuringLifetime: z
    .string()
    .min(1, 'Lifetime distribution terms are required'),
  distributionUponFirstDeath: z
    .string()
    .min(1, 'Distribution upon first death is required'),
  distributionUponSecondDeath: z
    .string()
    .min(1, 'Distribution upon second death is required'),
  primaryBeneficiaries: z.string().min(1, 'Primary beneficiaries are required'),
  contingentBeneficiaries: z.string().optional(),
  specialProvisions: z.string().optional(),
  incapacityProvisions: z.string().min(1, 'Incapacity provisions are required'),
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
