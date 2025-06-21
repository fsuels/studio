// src/lib/documents/us/performance-bond/schema.ts
import { z } from 'zod';

export const PerformanceBondSchema = z.object({
  // Principal (Contractor) Information
  principalName: z.string().min(1, 'Principal name is required'),
  principalAddress: z.string().min(1, 'Principal address is required'),
  principalPhone: z.string().min(1, 'Principal phone is required'),
  principalLicense: z.string().optional(),

  // Obligee (Project Owner) Information
  obligeeName: z.string().min(1, 'Obligee name is required'),
  obligeeAddress: z.string().min(1, 'Obligee address is required'),
  obligeePhone: z.string().min(1, 'Obligee phone is required'),

  // Surety Company Information
  suretyName: z.string().min(1, 'Surety company name is required'),
  suretyAddress: z.string().min(1, 'Surety address is required'),
  suretyPhone: z.string().min(1, 'Surety phone is required'),
  suretyLicense: z.string().min(1, 'Surety license/authorization is required'),

  // Contract Information
  contractDescription: z.string().min(1, 'Contract description is required'),
  contractNumber: z.string().optional(),
  contractDate: z.string().min(1, 'Contract date is required'),
  contractAmount: z.string().min(1, 'Contract amount is required'),
  projectLocation: z.string().min(1, 'Project location is required'),

  // Bond Details
  bondAmount: z.string().min(1, 'Bond amount is required'),
  bondPercentage: z.string().optional(),
  bondType: z.enum([
    'performance',
    'payment-and-performance',
    'completion',
    'maintenance',
  ]),
  bondEffectiveDate: z.string().min(1, 'Bond effective date is required'),
  bondExpirationDate: z.string().min(1, 'Bond expiration date is required'),

  // Performance Requirements
  performanceStandards: z.string().min(1, 'Performance standards are required'),
  completionDate: z.string().min(1, 'Completion date is required'),
  qualityRequirements: z.string().optional(),
  materialStandards: z.string().optional(),

  // Claim Procedures
  claimNotificationPeriod: z.string().optional(),
  claimProcedure: z.string().optional(),
  investigationPeriod: z.string().optional(),

  // Financial Terms
  premium: z.string().optional(),
  deductible: z.string().optional(),
  aggregateLimit: z.string().optional(),

  // Conditions and Terms
  bondConditions: z.array(z.string()).default([]),
  modifications: z.boolean().default(false),
  modificationProcedure: z.string().optional(),

  // Maintenance Period
  maintenancePeriod: z.boolean().default(false),
  maintenanceDuration: z.string().optional(),
  maintenanceBondAmount: z.string().optional(),

  // Legal Provisions
  governingLaw: z.string().optional(),
  jurisdiction: z.string().optional(),
  disputeResolution: z.enum(['litigation', 'arbitration', 'mediation']),

  // Release Conditions
  releaseConditions: z.string().optional(),
  finalAcceptance: z.boolean().default(true),
  correctiveWork: z.boolean().default(true),

  // Signatures
  principalSignatureRequired: z.boolean().default(true),
  suretySignatureRequired: z.boolean().default(true),
  obligeeSignatureRequired: z.boolean().default(false),
  notarizationRequired: z.boolean().default(true),
  witnessRequired: z.boolean().default(false),
});
