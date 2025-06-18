// src/lib/documents/us/roommate-agreement/schema.ts
import { z } from 'zod';

export const RoommateAgreementSchema = z.object({
  // Property Information
  propertyAddress: z.string().min(1, 'Property address is required'),
  propertyType: z.enum(['apartment', 'house', 'condo', 'townhouse']),
  
  // Roommate Information
  roommate1Name: z.string().min(1, 'Roommate 1 name is required'),
  roommate1Phone: z.string().optional(),
  roommate1Email: z.string().email().optional(),
  
  roommate2Name: z.string().min(1, 'Roommate 2 name is required'),
  roommate2Phone: z.string().optional(),
  roommate2Email: z.string().email().optional(),
  
  // Additional roommates
  hasAdditionalRoommates: z.boolean().default(false),
  additionalRoommates: z.array(z.object({
    name: z.string(),
    phone: z.string().optional(),
    email: z.string().email().optional(),
  })).default([]),
  
  // Agreement Terms
  agreementStartDate: z.string().min(1, 'Agreement start date is required'),
  agreementEndDate: z.string().optional(),
  monthToMonth: z.boolean().default(false),
  
  // Financial Responsibilities
  totalMonthlyRent: z.number().positive('Total monthly rent must be positive'),
  rentSplitMethod: z.enum(['equal', 'by-room-size', 'custom']),
  roommate1RentShare: z.number().min(0, 'Rent share cannot be negative'),
  roommate2RentShare: z.number().min(0, 'Rent share cannot be negative'),
  
  // Utilities
  totalUtilities: z.number().min(0, 'Utilities amount cannot be negative'),
  utilitiesSplitMethod: z.enum(['equal', 'by-usage', 'custom']),
  utilitiesIncluded: z.array(z.string()).default([]),
  
  // Security Deposit
  totalSecurityDeposit: z.number().min(0, 'Security deposit cannot be negative'),
  roommate1DepositShare: z.number().min(0, 'Deposit share cannot be negative'),
  roommate2DepositShare: z.number().min(0, 'Deposit share cannot be negative'),
  
  // Living Arrangements
  roommate1Room: z.string().optional(),
  roommate2Room: z.string().optional(),
  sharedAreas: z.array(z.string()).default([]),
  
  // House Rules
  quietHours: z.string().optional(),
  guestPolicy: z.string().optional(),
  smokingPolicy: z.enum(['allowed', 'not-allowed', 'outside-only']),
  petPolicy: z.enum(['allowed', 'not-allowed', 'with-approval']),
  cleaningSchedule: z.string().optional(),
  
  // Responsibilities
  cleaningResponsibilities: z.string().optional(),
  maintenanceResponsibilities: z.string().optional(),
  groceryArrangement: z.string().optional(),
  
  // Termination
  noticeToTerminate: z.string().default('30 days'),
  earlyTerminationPenalty: z.string().optional(),
  
  // Additional Terms
  additionalTerms: z.string().optional(),
  
  // Signatures
  roommate1SignatureDate: z.string().optional(),
  roommate2SignatureDate: z.string().optional(),
});