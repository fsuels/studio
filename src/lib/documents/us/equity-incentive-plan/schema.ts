import { z } from 'zod';

export const schema = z.object({
  // Company Information
  companyName: z.string().min(1, 'Company name is required'),
  companyAddress: z.string().min(1, 'Company address is required'),
  companyCity: z.string().min(1, 'Company city is required'),
  companyState: z.string().min(1, 'Company state is required'),
  companyZip: z.string().min(1, 'Company ZIP code is required'),
  
  // Plan Details
  planName: z.string().min(1, 'Plan name is required'),
  planType: z.enum(['Stock Option Plan', 'Restricted Stock Plan', 'ESPP', 'Combined Plan']),
  effectiveDate: z.string().min(1, 'Effective date is required'),
  planTerm: z.string().min(1, 'Plan term is required'),
  
  // Share Authorization
  totalSharesAuthorized: z.string().min(1, 'Total shares authorized is required'),
  shareClass: z.string().min(1, 'Share class is required'),
  parValue: z.string().optional(),
  
  // Eligibility
  eligibleParticipants: z.string().min(1, 'Eligible participants is required'),
  employmentRequirement: z.string().min(1, 'Employment requirement is required'),
  
  // Stock Options
  optionExercisePrice: z.string().optional(),
  pricingMethod: z.enum(['Fair Market Value', 'Board Determined', 'Formula Based']).optional(),
  vestingSchedule: z.string().min(1, 'Vesting schedule is required'),
  vestingCliff: z.string().optional(),
  
  // Exercise Terms
  exercisePeriod: z.string().min(1, 'Exercise period is required'),
  exerciseMethod: z.string().min(1, 'Exercise method is required'),
  
  // Restricted Stock
  restrictedStockGrants: z.boolean(),
  restrictionPeriod: z.string().optional(),
  forfeitureConditions: z.string().optional(),
  
  // Plan Administration
  planAdministrator: z.string().min(1, 'Plan administrator is required'),
  boardAuthority: z.string().min(1, 'Board authority is required'),
  
  // Termination Events
  terminationProvisions: z.string().min(1, 'Termination provisions are required'),
  changeInControlProvisions: z.string().min(1, 'Change in control provisions are required'),
  
  // Tax Implications
  taxTreatment: z.string().min(1, 'Tax treatment is required'),
  section409aCompliance: z.boolean(),
  
  // Amendment and Termination
  amendmentRights: z.string().min(1, 'Amendment rights are required'),
  planTermination: z.string().min(1, 'Plan termination provisions are required'),
  
  // Legal Terms
  governingState: z.string().min(1, 'Governing state is required'),
  
  // Signatures
  signatureDate: z.string().min(1, 'Signature date is required'),
});