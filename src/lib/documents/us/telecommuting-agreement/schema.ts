import { z } from 'zod';

export const schema = z.object({
  // Company Information
  companyName: z.string().min(1, 'Company name is required'),
  companyAddress: z.string().min(1, 'Company address is required'),
  companyCity: z.string().min(1, 'Company city is required'),
  companyState: z.string().min(1, 'Company state is required'),
  companyZip: z.string().min(1, 'Company ZIP code is required'),

  // Employee Information
  employeeName: z.string().min(1, 'Employee name is required'),
  employeeAddress: z.string().min(1, 'Employee address is required'),
  employeeCity: z.string().min(1, 'Employee city is required'),
  employeeState: z.string().min(1, 'Employee state is required'),
  employeeZip: z.string().min(1, 'Employee ZIP code is required'),
  jobTitle: z.string().min(1, 'Job title is required'),
  employeeId: z.string().optional(),

  // Telecommuting Arrangement
  agreementStartDate: z.string().min(1, 'Agreement start date is required'),
  agreementEndDate: z.string().optional(),
  workSchedule: z.enum(['Full-time remote', 'Part-time remote', 'Hybrid']),
  workDaysRemote: z.string().optional(),
  workHours: z.string().min(1, 'Work hours are required'),
  coreHours: z.string().optional(),

  // Work Location
  primaryWorkLocation: z.string().min(1, 'Primary work location is required'),
  alternateLocationsAllowed: z.boolean(),
  alternateLocationDetails: z.string().optional(),
  officeVisitsRequired: z.boolean(),
  officeVisitFrequency: z.string().optional(),

  // Equipment and Technology
  companyEquipmentProvided: z.boolean(),
  equipmentList: z.string().optional(),
  internetReimbursement: z.boolean(),
  internetReimbursementAmount: z.string().optional(),
  phoneReimbursement: z.boolean(),
  phoneReimbursementAmount: z.string().optional(),
  equipmentReturnPolicy: z
    .string()
    .min(1, 'Equipment return policy is required'),

  // Communication Requirements
  communicationTools: z.string().min(1, 'Communication tools are required'),
  meetingAttendanceRequirement: z
    .string()
    .min(1, 'Meeting attendance requirement is required'),
  responseTimeExpectation: z
    .string()
    .min(1, 'Response time expectation is required'),

  // Performance and Monitoring
  performanceMetrics: z.string().min(1, 'Performance metrics are required'),
  reportingFrequency: z.enum(['Daily', 'Weekly', 'Bi-weekly', 'Monthly']),
  supervisorName: z.string().min(1, 'Supervisor name is required'),

  // Security and Confidentiality
  dataSecurityRequirements: z
    .string()
    .min(1, 'Data security requirements are required'),
  confidentialityAgreement: z.boolean().default(true),
  vpnRequired: z.boolean(),

  // Workspace Requirements
  workspaceStandards: z.string().min(1, 'Workspace standards are required'),
  ergonomicRequirements: z.string().optional(),
  insuranceCoverage: z
    .string()
    .min(1, 'Insurance coverage details are required'),

  // Termination Conditions
  terminationNotice: z.string().min(1, 'Termination notice is required'),
  terminationConditions: z
    .string()
    .min(1, 'Termination conditions are required'),

  // Legal Terms
  governingState: z.string().min(1, 'Governing state is required'),

  // Signatures
  signatureDate: z.string().min(1, 'Signature date is required'),
});
