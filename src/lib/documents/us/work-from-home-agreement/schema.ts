// src/lib/documents/us/work-from-home-agreement/schema.ts
import { z } from 'zod';

export const WorkFromHomeAgreementSchema = z.object({
  // Company Information
  companyName: z.string().min(1, 'Company name is required'),
  companyAddress: z.string().min(1, 'Company address is required'),

  // Employee Information
  employeeName: z.string().min(1, 'Employee name is required'),
  employeeAddress: z.string().min(1, 'Employee address is required'),
  jobTitle: z.string().min(1, 'Job title is required'),
  department: z.string().optional(),

  // Agreement Details
  agreementDate: z.string().min(1, 'Agreement date is required'),
  effectiveDate: z.string().min(1, 'Effective date is required'),
  endDate: z.string().optional(),
  isTemporary: z.boolean().default(false),

  // Work Schedule
  workDays: z.array(
    z.enum([
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
      'sunday',
    ]),
  ),
  workHours: z.string().min(1, 'Work hours are required'),
  timeZone: z.string().optional(),
  coreHours: z.string().optional(),
  flexibleSchedule: z.boolean().default(false),

  // Work Location
  homeAddress: z.string().min(1, 'Home work address is required'),
  dedicatedWorkspace: z.boolean().default(true),
  workspaceRequirements: z.string().optional(),

  // Equipment and Technology
  companyEquipment: z.boolean().default(true),
  equipmentList: z
    .array(
      z.object({
        item: z.string(),
        serialNumber: z.string().optional(),
        value: z.string().optional(),
      }),
    )
    .default([]),
  employeeEquipment: z.boolean().default(false),
  internetReimbursement: z.boolean().default(false),
  reimbursementAmount: z.string().optional(),

  // Performance and Communication
  communicationTools: z.array(z.string()).default([]),
  meetingRequirements: z.string().optional(),
  reportingSchedule: z
    .enum(['daily', 'weekly', 'bi-weekly', 'monthly'])
    .optional(),
  performanceMetrics: z.string().optional(),

  // Data Security
  vpnRequired: z.boolean().default(true),
  securitySoftware: z.boolean().default(true),
  dataProtectionRequirements: z.string().optional(),
  confidentialityAgreement: z.boolean().default(true),

  // Office Access
  officeAccess: z.boolean().default(true),
  officeVisitRequirements: z.string().optional(),
  parkingArrangements: z.string().optional(),

  // Health and Safety
  ergonomicRequirements: z.boolean().default(true),
  safetyRequirements: z.string().optional(),
  workersCompCoverage: z.boolean().default(true),

  // Expenses and Reimbursement
  phoneReimbursement: z.boolean().default(false),
  phoneAmount: z.string().optional(),
  utilityReimbursement: z.boolean().default(false),
  utilityAmount: z.string().optional(),
  officeSupplies: z.boolean().default(false),

  // Supervision and Management
  supervisorName: z.string().optional(),
  checkInFrequency: z
    .enum(['daily', 'weekly', 'bi-weekly', 'monthly'])
    .optional(),
  performanceReviewSchedule: z.string().optional(),

  // Termination
  terminationClause: z.boolean().default(true),
  noticeRequirement: z.string().optional(),
  equipmentReturn: z.boolean().default(true),

  // Additional Terms
  taxImplications: z.boolean().default(true),
  businessInsurance: z.boolean().default(false),
  guestPolicy: z.string().optional(),
  childcarePolicy: z.string().optional(),

  // Compliance
  laborLawCompliance: z.boolean().default(true),
  backgroundCheckRequired: z.boolean().default(false),
  trainingRequirements: z.string().optional(),

  // Signatures
  requireEmployeeSignature: z.boolean().default(true),
  requireEmployerSignature: z.boolean().default(true),
  requireWitnessSignature: z.boolean().default(false),
});
