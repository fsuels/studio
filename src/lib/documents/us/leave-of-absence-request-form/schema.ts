import { z } from 'zod';

export const schema = z.object({
  // Company Information
  companyName: z.string().min(1, 'Company name is required'),
  
  // Employee Information
  employeeName: z.string().min(1, 'Employee name is required'),
  employeeId: z.string().optional(),
  
  
  // Leave Details
  leaveType: z.enum(['Medical', 'Family', 'Personal', 'Military', 'FMLA']),
  leaveStartDate: z.string().min(1, 'Leave start date is required'),
  leaveEndDate: z.string().min(1, 'Leave end date is required'),
  leaveReason: z.string().min(1, 'Leave reason is required'),
  
  // Employment Details
  jobTitle: z.string().min(1, 'Job title is required'),
  department: z.string().optional(),
  supervisorName: z.string().min(1, 'Supervisor name is required'),
  
  // Signatures
  signatureDate: z.string().min(1, 'Signature date is required'),
});
