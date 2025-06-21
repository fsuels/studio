import { z } from 'zod';

export const schema = z.object({
  // Company Information
  companyName: z.string().min(1, 'Company name is required'),
  companyAddress: z.string().min(1, 'Company address is required'),

  // Policy Details
  policyTitle: z.string().min(1, 'Policy title is required'),
  effectiveDate: z.string().min(1, 'Effective date is required'),
  policyVersion: z.string().optional(),

  // Policy Scope
  applicableEmployees: z.string().min(1, 'Applicable employees is required'),
  exemptPositions: z.string().optional(),

  // Disciplinary Steps
  step1Description: z.string().min(1, 'Step 1 description is required'),
  step1Consequences: z.string().min(1, 'Step 1 consequences are required'),
  step2Description: z.string().min(1, 'Step 2 description is required'),
  step2Consequences: z.string().min(1, 'Step 2 consequences are required'),
  step3Description: z.string().min(1, 'Step 3 description is required'),
  step3Consequences: z.string().min(1, 'Step 3 consequences are required'),
  step4Description: z.string().min(1, 'Step 4 description is required'),
  step4Consequences: z.string().min(1, 'Step 4 consequences are required'),

  // Serious Offenses
  seriousOffensesList: z.string().min(1, 'Serious offenses list is required'),
  seriousOffenseConsequences: z
    .string()
    .min(1, 'Serious offense consequences are required'),

  // Documentation Requirements
  documentationRequirements: z
    .string()
    .min(1, 'Documentation requirements are required'),
  recordRetentionPeriod: z
    .string()
    .min(1, 'Record retention period is required'),

  // Employee Rights
  employeeRights: z.string().min(1, 'Employee rights are required'),
  appealProcess: z.string().min(1, 'Appeal process is required'),
  representationRights: z.string().min(1, 'Representation rights are required'),

  // Supervisor Responsibilities
  supervisorDuties: z.string().min(1, 'Supervisor duties are required'),
  hrConsultationRequirement: z
    .string()
    .min(1, 'HR consultation requirement is required'),

  // Special Circumstances
  attendanceIssuesPolicy: z
    .string()
    .min(1, 'Attendance issues policy is required'),
  performanceIssuesPolicy: z
    .string()
    .min(1, 'Performance issues policy is required'),

  // Policy Review
  reviewSchedule: z.string().min(1, 'Review schedule is required'),
  policyUpdates: z.string().min(1, 'Policy updates process is required'),

  // Legal Compliance
  atWillStatement: z.string().min(1, 'At-will statement is required'),
  governingState: z.string().min(1, 'Governing state is required'),

  // Approval
  approvalDate: z.string().min(1, 'Approval date is required'),
  approvedBy: z.string().min(1, 'Approved by is required'),
});
