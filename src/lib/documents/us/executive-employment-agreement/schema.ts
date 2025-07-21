import { z } from 'zod';

export const schema = z.object({
  // Company Information
  companyName: z.string().min(1, 'Company name is required'),
  companyAddress: z.string().min(1, 'Company address is required'),
  companyCity: z.string().min(1, 'Company city is required'),
  companyState: z.string().min(1, 'Company state is required'),
  companyZip: z.string().min(1, 'Company ZIP code is required'),

  // Executive Information
  executiveName: z.string().min(1, 'Executive name is required'),
  executiveAddress: z.string().min(1, 'Executive address is required'),
  executiveCity: z.string().min(1, 'Executive city is required'),
  executiveState: z.string().min(1, 'Executive state is required'),
  executiveZip: z.string().min(1, 'Executive ZIP code is required'),

  // Position Details
  jobTitle: z.string().min(1, 'Job title is required'),
  department: z.string().optional(),
  reportsTo: z.string().min(1, 'Reports to is required'),
  startDate: z.string().min(1, 'Start date is required'),

  // Compensation
  annualSalary: z.string().min(1, 'Annual salary is required'),
  payFrequency: z.enum(['Weekly', 'Bi-weekly', 'Semi-monthly', 'Monthly']),
  bonusEligible: z.boolean(),
  bonusStructure: z.string().optional(),
  stockOptions: z.boolean(),
  stockOptionsDetails: z.string().optional(),

  // Benefits
  healthInsurance: z.boolean(),
  dentalInsurance: z.boolean(),
  visionInsurance: z.boolean(),
  retirementPlan: z.boolean(),
  retirementMatch: z.string().optional(),
  vacationDays: z.string().min(1, 'Vacation days is required'),
  sickDays: z.string().min(1, 'Sick days is required'),
  personalDays: z.string().optional(),

  // Executive Perks
  companyVehicle: z.boolean(),
  vehicleAllowance: z.string().optional(),
  countryClubMembership: z.boolean(),
  executivePhysical: z.boolean(),
  travelAllowance: z.string().optional(),
  expenseAccount: z.boolean(),

  // Termination Terms
  terminationNotice: z.string().min(1, 'Termination notice period is required'),
  severancePackage: z.boolean(),
  severanceDetails: z.string().optional(),
  nonCompetePeriod: z.string().optional(),
  nonSolicitPeriod: z.string().optional(),

  // Confidentiality and IP
  confidentialityClause: z.boolean().default(true),
  nonDisclosurePeriod: z.string().min(1, 'Non-disclosure period is required'),
  inventionAssignment: z.boolean().default(true),

  // Governing Law
  governingState: z.string().min(1, 'Governing state is required'),

  // Signatures
  signatureDate: z.string().min(1, 'Signature date is required'),
  witnessRequired: z.boolean().default(false),
  witnessName: z.string().optional(),
});
