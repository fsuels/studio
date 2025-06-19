import { z } from 'zod';

export const schema = z.object({
  // Company Information
  companyName: z.string().min(1, 'Company name is required'),
  
  // Employee Information
  employeeName: z.string().min(1, 'Employee name is required'),
  employeeId: z.string().optional(),
  
  
  // Agreement Details
  jobTitle: z.string().min(1, 'Job title is required'),
  department: z.string().optional(),
  agreementDuration: z.string().min(1, 'Agreement duration is required'),
  
  // Confidential Information
  confidentialInformationTypes: z.string().min(1, 'Confidential information types are required'),
  nonDisclosurePeriod: z.string().min(1, 'Non-disclosure period is required'),
  
  // Legal Terms
  governingState: z.string().min(1, 'Governing state is required'),
  
  // Signatures
  signatureDate: z.string().min(1, 'Signature date is required'),
});
