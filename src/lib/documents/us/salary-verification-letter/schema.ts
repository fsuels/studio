import { z } from 'zod';

export const schema = z.object({
  // Company Information
  companyName: z.string().min(1, 'Company name is required'),

  // Employee Information
  employeeName: z.string().min(1, 'Employee name is required'),
  employeeId: z.string().optional(),

  // Salary Information
  jobTitle: z.string().min(1, 'Job title is required'),
  annualSalary: z.string().min(1, 'Annual salary is required'),
  hourlyRate: z.string().optional(),
  employmentStartDate: z.string().min(1, 'Employment start date is required'),

  // Verification Details
  verificationPurpose: z.string().min(1, 'Verification purpose is required'),
  thirdPartyName: z.string().min(1, 'Third party name is required'),

  // Signatures
  signatureDate: z.string().min(1, 'Signature date is required'),
});
