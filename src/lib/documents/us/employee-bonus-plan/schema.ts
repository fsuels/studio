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
  planYear: z.string().min(1, 'Plan year is required'),
  effectiveDate: z.string().min(1, 'Effective date is required'),
  planObjective: z.string().min(1, 'Plan objective is required'),

  // Eligibility
  eligibilityCriteria: z.string().min(1, 'Eligibility criteria is required'),
  employmentStatus: z.enum(['Full-time', 'Part-time', 'All employees']),
  minimumTenure: z.string().optional(),
  departmentRestrictions: z.string().optional(),

  // Bonus Structure
  bonusType: z.enum([
    'Individual performance',
    'Team performance',
    'Company performance',
    'Combined',
  ]),
  calculationMethod: z.string().min(1, 'Calculation method is required'),
  performanceMetrics: z.string().min(1, 'Performance metrics are required'),
  targetBonusPercentage: z
    .string()
    .min(1, 'Target bonus percentage is required'),
  maximumBonusPercentage: z
    .string()
    .min(1, 'Maximum bonus percentage is required'),

  // Performance Periods
  performancePeriod: z.enum(['Quarterly', 'Semi-annually', 'Annually']),
  evaluationSchedule: z.string().min(1, 'Evaluation schedule is required'),
  paymentSchedule: z.string().min(1, 'Payment schedule is required'),

  // Specific Metrics
  salesTargets: z.string().optional(),
  profitTargets: z.string().optional(),
  qualityMetrics: z.string().optional(),
  customerSatisfactionTargets: z.string().optional(),

  // Payment Terms
  paymentTiming: z.string().min(1, 'Payment timing is required'),
  prorationPolicy: z.string().min(1, 'Proration policy is required'),
  taxImplications: z.string().min(1, 'Tax implications are required'),

  // Plan Administration
  planAdministrator: z.string().min(1, 'Plan administrator is required'),
  appealProcess: z.string().min(1, 'Appeal process is required'),
  planModification: z.string().min(1, 'Plan modification policy is required'),

  // Termination Provisions
  terminationImpact: z.string().min(1, 'Termination impact is required'),
  clawbackProvisions: z.boolean(),
  clawbackDetails: z.string().optional(),

  // Legal Terms
  governingState: z.string().min(1, 'Governing state is required'),

  // Signatures
  signatureDate: z.string().min(1, 'Signature date is required'),
});
