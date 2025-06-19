import { z } from 'zod';

export const schema = z.object({
  // Company Information
  companyName: z.string().min(1, 'Company name is required'),
  
  // Employee Information
  employeeName: z.string().min(1, 'Employee name is required'),
  employeeId: z.string().optional(),
  
  
  // Income Information
  jobTitle: z.string().min(1, 'Job title is required'),
  annualSalary: z.string().min(1, 'Annual salary is required'),
  employmentStartDate: z.string().min(1, 'Employment start date is required'),
  employmentStatus: z.enum(['Full-time', 'Part-time', 'Contract']),
  
  // Verification Details
  verificationPurpose: z.string().min(1, 'Verification purpose is required'),
  requestedBy: z.string().min(1, 'Requested by is required'),
  
  // Signatures
  signatureDate: z.string().min(1, 'Signature date is required'),
});
