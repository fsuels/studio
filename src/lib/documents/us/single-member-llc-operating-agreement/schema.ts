import { z } from 'zod';

export const singleMemberLlcOperatingAgreementSchema = z.object({
  // Company Information
  companyName: z.string().min(1, 'Company name is required'),
  stateOfFormation: z.string().min(1, 'State of formation is required'),
  dateOfFormation: z.string().min(1, 'Date of formation is required'),
  principalPlaceOfBusiness: z.string().min(1, 'Principal place of business is required'),
  businessPurpose: z.string().min(1, 'Business purpose is required'),
  
  // Member Information
  memberName: z.string().min(1, 'Member name is required'),
  memberAddress: z.string().min(1, 'Member address is required'),
  membershipInterest: z.string().default('100%'),
  initialCapitalContribution: z.string().min(1, 'Initial capital contribution is required'),
  
  // Management Structure
  managementStructure: z.enum(['member-managed', 'manager-managed']).default('member-managed'),
  managerName: z.string().optional(),
  managerAddress: z.string().optional(),
  
  // Financial Provisions
  fiscalYearEnd: z.string().default('December 31'),
  bankingInstitution: z.string().optional(),
  distributionsPolicy: z.string().optional(),
  
  // Operations
  meetingsRequired: z.boolean().default(false),
  recordsLocation: z.string().optional(),
  transferRestrictions: z.boolean().default(true),
  
  // Dissolution
  dissolutionEvents: z.array(z.string()).default([
    'Death or incapacity of the member',
    'Bankruptcy of the member',
    'Written decision of the member'
  ]),
  
  // Additional Provisions
  additionalProvisions: z.string().optional(),
  
  // Execution
  signatureDate: z.string().min(1, 'Signature date is required'),
  notarization: z.boolean().default(false),
});