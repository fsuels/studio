// src/lib/documents/us/resignation-letter-personal/schema.ts
import { z } from 'zod';

export const ResignationLetterPersonalSchema = z.object({
  // Employee Information
  employeeName: z.string().min(1, 'Employee name is required'),
  employeeAddress: z.string().optional(),
  employeePhone: z.string().optional(),
  employeeEmail: z.string().email().optional(),
  employeeId: z.string().optional(),
  
  // Employer Information
  supervisorName: z.string().optional(),
  supervisorTitle: z.string().optional(),
  companyName: z.string().optional(),
  companyAddress: z.string().optional(),
  
  // Employment Details
  jobTitle: z.string().optional(),
  department: z.string().optional(),
  startDate: z.string().optional(),
  lastWorkingDay: z.string().optional(),
  
  // Resignation Details
  resignationDate: z.string().optional(),
  noticeGiven: z.string().optional(),
  reasonForResigning: z.enum(['personal-reasons', 'family-obligations', 'health-issues', 'relocation', 'career-change', 'other']).default('personal-reasons'),
  personalReason: z.string().optional(),
  
  // Transition
  transitionAssistance: z.boolean().default(true),
  projectHandover: z.boolean().default(true),
  trainingReplacement: z.boolean().default(true),
  
  // Benefits and Final Pay
  finalPaycheck: z.boolean().default(true),
  benefitsContinuation: z.boolean().default(false),
  returnCompanyProperty: z.boolean().default(true),
  
  // Appreciation
  gratitudeExpressed: z.boolean().default(true),
  positiveExperience: z.boolean().default(true),
  
  // Letter Details
  letterDate: z.string().optional(),
  formalTone: z.boolean().default(true),
  
  // Signature
  signature: z.boolean().default(true),
});