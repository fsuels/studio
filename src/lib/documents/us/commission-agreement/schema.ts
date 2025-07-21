// src/lib/documents/us/commission-agreement/schema.ts
import { z } from 'zod';

export const CommissionAgreementSchema = z.object({
  // Company Information
  companyName: z.string().min(1, 'Company name is required'),
  companyAddress: z.string().min(1, 'Company address is required'),

  // Employee/Contractor Information
  employeeName: z.string().min(1, 'Employee name is required'),
  employeeAddress: z.string().min(1, 'Employee address is required'),
  jobTitle: z.string().min(1, 'Job title is required'),

  // Agreement Details
  agreementDate: z.string().min(1, 'Agreement date is required'),
  effectiveDate: z.string().min(1, 'Effective date is required'),
  endDate: z.string().optional(),

  // Commission Structure
  commissionType: z.enum([
    'percentage',
    'flat-rate',
    'tiered',
    'sliding-scale',
  ]),
  commissionRate: z.string().min(1, 'Commission rate is required'),
  minimumSale: z.string().optional(),
  maximumCommission: z.string().optional(),

  // Base Salary
  includeBaseSalary: z.boolean().default(false),
  baseSalaryAmount: z.string().optional(),
  salaryFrequency: z
    .enum(['weekly', 'bi-weekly', 'monthly', 'annually'])
    .optional(),

  // Commission Calculation
  commissionBase: z.enum([
    'gross-sales',
    'net-sales',
    'gross-profit',
    'net-profit',
  ]),
  deductionsAllowed: z.boolean().default(true),
  allowedDeductions: z.array(z.string()).default([]),

  // Sales Territory
  hasTerritory: z.boolean().default(false),
  territoryDescription: z.string().optional(),
  exclusiveTerritory: z.boolean().default(false),

  // Products/Services
  allProducts: z.boolean().default(true),
  specificProducts: z.array(z.string()).default([]),
  excludedProducts: z.array(z.string()).default([]),

  // Payment Terms
  paymentFrequency: z.enum([
    'monthly',
    'quarterly',
    'upon-collection',
    'upon-sale',
  ]),
  paymentDate: z.string().optional(),
  advanceCommissions: z.boolean().default(false),
  chargebacks: z.boolean().default(true),

  // Performance Requirements
  salesQuota: z.boolean().default(false),
  quotaAmount: z.string().optional(),
  quotaPeriod: z.enum(['monthly', 'quarterly', 'annually']).optional(),
  penaltyForMissing: z.string().optional(),

  // Expenses
  expenseReimbursement: z.boolean().default(false),
  reimbursableExpenses: z.array(z.string()).default([]),
  expenseApprovalRequired: z.boolean().default(true),

  // Competition and Confidentiality
  nonCompeteClause: z.boolean().default(true),
  nonCompetePeriod: z.string().optional(),
  nonSolicitationClause: z.boolean().default(true),
  confidentialityClause: z.boolean().default(true),

  // Training and Support
  trainingRequired: z.boolean().default(false),
  trainingDescription: z.string().optional(),
  supportProvided: z.string().optional(),

  // Customer Ownership
  customerOwnership: z.enum(['company', 'shared', 'employee']),
  customerTransition: z.string().optional(),

  // Termination
  terminationClause: z.boolean().default(true),
  terminationNotice: z.string().optional(),
  commissionOnTermination: z.enum(['forfeit', 'pro-rated', 'full-payment']),

  // Record Keeping
  recordKeeping: z.boolean().default(true),
  reportingRequirements: z.string().optional(),
  auditRights: z.boolean().default(true),

  // Dispute Resolution
  disputeResolution: z.enum(['mediation', 'arbitration', 'court']).optional(),
  governingLaw: z.string().optional(),

  // Modifications
  modificationClause: z.boolean().default(true),
  writtenModificationsOnly: z.boolean().default(true),

  // Additional Terms
  independentContractor: z.boolean().default(false),
  benefitsEligible: z.boolean().default(true),
  vacationPolicy: z.string().optional(),

  // Signatures
  requireEmployeeSignature: z.boolean().default(true),
  requireEmployerSignature: z.boolean().default(true),
  requireWitnessSignature: z.boolean().default(false),
});
