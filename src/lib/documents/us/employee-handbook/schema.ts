// src/lib/documents/us/employee-handbook/schema.ts
import { z } from 'zod';

export const EmployeeHandbookSchema = z.object({
  // Company Information
  companyName: z.string().min(1, 'Company name is required'),
  companyAddress: z.string().min(1, 'Company address is required'),
  companyPhone: z.string().optional(),
  companyWebsite: z.string().optional(),

  // Handbook Information
  effectiveDate: z.string().min(1, 'Effective date is required'),
  handbookVersion: z.string().optional(),
  lastUpdated: z.string().optional(),

  // Employment Policies
  employmentType: z.array(z.string()).default(['at-will']),
  equalOpportunity: z.boolean().default(true),
  antiDiscrimination: z.boolean().default(true),
  antiHarassment: z.boolean().default(true),

  // Work Schedule
  standardWorkWeek: z.string().default('40 hours'),
  workingHours: z.string().default('9:00 AM - 5:00 PM'),
  lunchBreak: z.string().default('1 hour'),
  flexibleSchedule: z.boolean().default(false),
  remoteWork: z.boolean().default(false),

  // Compensation and Benefits
  payFrequency: z.enum(['weekly', 'bi-weekly', 'semi-monthly', 'monthly']),
  overtimePolicy: z.string().optional(),
  healthInsurance: z.boolean().default(false),
  retirementPlan: z.boolean().default(false),
  vacationPolicy: z.string().optional(),
  sickLeave: z.string().optional(),
  holidays: z.string().optional(),

  // Attendance and Leave
  attendancePolicy: z.string().optional(),
  tardinessPolicy: z.string().optional(),
  absenceNotification: z.string().optional(),
  fmlaPolicy: z.boolean().default(false),
  maternityLeave: z.string().optional(),
  paternityLeave: z.string().optional(),
  bereavementLeave: z.string().optional(),

  // Workplace Conduct
  dressCode: z.string().optional(),
  internetUsage: z.string().optional(),
  socialMediaPolicy: z.string().optional(),
  confidentialityPolicy: z.string().optional(),
  conflictOfInterest: z.string().optional(),

  // Safety and Security
  workplaceSafety: z.string().optional(),
  emergencyProcedures: z.string().optional(),
  drugFreeWorkplace: z.boolean().default(true),
  securityProcedures: z.string().optional(),

  // Performance and Discipline
  performanceReviews: z.string().optional(),
  disciplinaryProcess: z.string().optional(),
  grievanceProcedure: z.string().optional(),
  terminationPolicy: z.string().optional(),

  // Technology and Equipment
  equipmentPolicy: z.string().optional(),
  byodPolicy: z.string().optional(),
  dataProtection: z.string().optional(),
  softwareLicensing: z.string().optional(),

  // Training and Development
  orientationProcess: z.string().optional(),
  trainingRequirements: z.string().optional(),
  professionalDevelopment: z.string().optional(),

  // Additional Policies
  smokingPolicy: z.string().optional(),
  petPolicy: z.string().optional(),
  visitorPolicy: z.string().optional(),
  travelPolicy: z.string().optional(),
  expenseReimbursement: z.string().optional(),

  // Acknowledgment
  acknowledgmentRequired: z.boolean().default(true),
  acknowledgmentText: z.string().optional(),
});
