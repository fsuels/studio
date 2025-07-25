import { z } from 'zod';

export const schema = z.object({
  trustorName: z.string().min(1, 'Trustor name is required'),
  trustorAddress: z.string().min(1, 'Trustor address is required'),
  trustName: z.string().min(1, 'Trust name is required'),
  trustDate: z.string().min(1, 'Trust date is required'),
  trusteeName: z.string().min(1, 'Trustee name is required'),
  trusteeAddress: z.string().min(1, 'Trustee address is required'),
  successorTrusteeName: z.string().optional(),
  successorTrusteeAddress: z.string().optional(),
  primaryBeneficiary: z.string().min(1, 'Primary beneficiary is required'),
  primaryBeneficiaryAge: z
    .string()
    .min(1, 'Primary beneficiary age is required'),
  primaryBeneficiaryRelation: z
    .string()
    .min(1, 'Relationship to primary beneficiary is required'),
  additionalBeneficiaries: z.string().optional(),
  educationalPurpose: z.string().min(1, 'Educational purpose is required'),
  eligibleExpenses: z
    .string()
    .min(1, 'Eligible expenses definition is required'),
  initialFunding: z.string().min(1, 'Initial funding amount is required'),
  additionalContributions: z.string().optional(),
  investmentGuidelines: z.string().min(1, 'Investment guidelines are required'),
  distributionTriggers: z.string().min(1, 'Distribution triggers are required'),
  distributionLimitations: z
    .string()
    .min(1, 'Distribution limitations are required'),
  ageRestrictions: z.string().optional(),
  academicRequirements: z.string().optional(),
  institutionRequirements: z
    .string()
    .min(1, 'Educational institution requirements are required'),
  surplusFundsDisposition: z
    .string()
    .min(1, 'Surplus funds disposition is required'),
  terminationConditions: z
    .string()
    .min(1, 'Trust termination conditions are required'),
  reportingRequirements: z
    .string()
    .min(1, 'Reporting requirements are required'),
  specialProvisions: z.string().optional(),
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
