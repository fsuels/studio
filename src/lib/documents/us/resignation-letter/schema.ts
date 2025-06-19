import { z } from 'zod';

export const schema = z.object({
  // Company Information
  companyName: z.string().min(1, 'Company name is required'),
  
  // Employee Information
  employeeName: z.string().min(1, 'Employee name is required'),
  employeeId: z.string().optional(),
  
  
  // Resignation Details
  jobTitle: z.string().min(1, 'Job title is required'),
  lastWorkingDay: z.string().min(1, 'Last working day is required'),
  resignationReason: z.string().optional(),
  
  // Transition Details
  transitionPlan: z.string().optional(),
  supervisorName: z.string().min(1, 'Supervisor name is required'),
  
  // Signatures
  signatureDate: z.string().min(1, 'Signature date is required'),
});
