import { z } from 'zod';

export const schema = z.object({
  // Company Information
  companyName: z.string().min(1, 'Company name is required'),

  // Employee Information
  employeeName: z.string().min(1, 'Employee name is required'),
  employeeId: z.string().optional(),
  jobTitle: z.string().min(1, 'Job title is required'),
  department: z.string().optional(),
  supervisorName: z.string().min(1, 'Supervisor name is required'),

  // Warning Details
  warningType: z.enum(['Verbal Warning', 'Written Warning', 'Final Warning']),
  incidentDate: z.string().min(1, 'Incident date is required'),
  warningDate: z.string().min(1, 'Warning date is required'),

  // Violation Information
  violationType: z.enum([
    'Attendance',
    'Performance',
    'Conduct',
    'Policy Violation',
    'Safety',
    'Other',
  ]),
  violationDescription: z.string().min(1, 'Violation description is required'),
  witnessesPresent: z.boolean(),
  witnessNames: z.string().optional(),

  // Corrective Action
  correctiveActionRequired: z
    .string()
    .min(1, 'Corrective action required is required'),
  improvementDeadline: z.string().optional(),
  consequencesDescription: z
    .string()
    .min(1, 'Consequences description is required'),

  // Employee Response
  employeeAcknowledgment: z.boolean(),
  employeeComments: z.string().optional(),
  employeeDisagreement: z.boolean(),
  employeeDisagreementReason: z.string().optional(),

  // Follow-up
  followUpRequired: z.boolean(),
  followUpDate: z.string().optional(),

  // Signatures
  signatureDate: z.string().min(1, 'Signature date is required'),
  supervisorSignatureDate: z
    .string()
    .min(1, 'Supervisor signature date is required'),
  employeeSignatureDate: z.string().optional(),
  hrSignatureDate: z.string().optional(),
});
