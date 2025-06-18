// src/lib/documents/us/employment-verification-letter/schema.ts
import { z } from 'zod';

export const EmploymentVerificationLetterSchema = z.object({
  // Company Information
  companyName: z.string().min(1, 'Company name is required'),
  companyAddress: z.string().min(1, 'Company address is required'),
  companyPhone: z.string().optional(),
  
  // HR/Manager Information
  signerName: z.string().min(1, 'Signer name is required'),
  signerTitle: z.string().min(1, 'Signer title is required'),
  signerEmail: z.string().email().optional(),
  
  // Employee Information
  employeeName: z.string().min(1, 'Employee name is required'),
  employeeTitle: z.string().min(1, 'Employee title is required'),
  department: z.string().optional(),
  employeeId: z.string().optional(),
  
  // Employment Details
  startDate: z.string().min(1, 'Start date is required'),
  employmentStatus: z.enum(['active', 'inactive', 'terminated']),
  employmentType: z.enum(['full-time', 'part-time', 'contract', 'temporary']),
  
  // Salary Information
  includeSalary: z.boolean().default(true),
  salaryAmount: z.string().optional(),
  salaryFrequency: z.enum(['hourly', 'weekly', 'bi-weekly', 'monthly', 'annually']).optional(),
  
  // Work Schedule
  includeSchedule: z.boolean().default(false),
  hoursPerWeek: z.string().optional(),
  workSchedule: z.string().optional(),
  
  // Additional Information
  includePerformance: z.boolean().default(false),
  performanceNote: z.string().optional(),
  includeEligibility: z.boolean().default(false),
  rehireEligible: z.boolean().default(true),
  
  // Purpose
  verificationPurpose: z.string().optional(),
  requestedBy: z.string().optional(),
  
  // Date
  letterDate: z.string().min(1, 'Letter date is required'),
  
  // Contact Information
  includeContactInfo: z.boolean().default(true),
  contactName: z.string().optional(),
  contactPhone: z.string().optional(),
  contactEmail: z.string().email().optional(),
});