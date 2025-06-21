// src/lib/documents/us/child-support-agreement/schema.ts
import { z } from 'zod';

export const ChildSupportAgreementSchema = z.object({
  // Obligor Information (Paying Parent)
  obligorName: z.string().min(1, 'Obligor name is required'),
  obligorAddress: z.string().min(1, 'Obligor address is required'),
  obligorPhone: z.string().optional(),
  obligorSSN: z.string().optional(),
  obligorEmployer: z.string().optional(),

  // Obligee Information (Receiving Parent)
  obligeeName: z.string().min(1, 'Obligee name is required'),
  obligeeAddress: z.string().min(1, 'Obligee address is required'),
  obligeePhone: z.string().optional(),
  obligeeSSN: z.string().optional(),

  // Child Information
  childName: z.string().min(1, 'Child name is required'),
  childBirthDate: z.string().min(1, 'Child birth date is required'),
  childSSN: z.string().optional(),

  // Multiple Children
  hasMultipleChildren: z.boolean().default(false),
  additionalChildren: z
    .array(
      z.object({
        name: z.string(),
        birthDate: z.string(),
        ssn: z.string().optional(),
      }),
    )
    .default([]),

  // Agreement Details
  agreementDate: z.string().min(1, 'Agreement date is required'),
  effectiveDate: z.string().min(1, 'Effective date is required'),

  // Support Amount
  supportAmount: z.string().min(1, 'Support amount is required'),
  paymentFrequency: z.enum(['weekly', 'bi-weekly', 'monthly', 'other']),
  paymentDueDate: z.string().min(1, 'Payment due date is required'),

  // Payment Method
  paymentMethod: z.enum([
    'direct-payment',
    'wage-garnishment',
    'state-disbursement',
    'automatic-transfer',
    'other',
  ]),
  paymentDetails: z.string().optional(),

  // Income Information
  obligorIncome: z.string().optional(),
  obligeeIncome: z.string().optional(),
  incomeVerification: z.boolean().default(false),

  // Child Care Expenses
  childCareExpenses: z.boolean().default(false),
  childCareAmount: z.string().optional(),
  childCareResponsibility: z.enum(['obligor', 'obligee', 'shared']).optional(),

  // Medical/Health Insurance
  healthInsurance: z.boolean().default(true),
  healthInsuranceProvider: z.enum(['obligor', 'obligee', 'shared']).optional(),
  healthInsuranceCost: z.string().optional(),
  uninsuredMedical: z.enum(['obligor', 'obligee', 'shared']).optional(),

  // Educational Expenses
  educationalExpenses: z.boolean().default(false),
  educationResponsibility: z.enum(['obligor', 'obligee', 'shared']).optional(),
  collegeExpenses: z.boolean().default(false),

  // Extracurricular Activities
  extracurricularExpenses: z.boolean().default(false),
  extracurricularResponsibility: z
    .enum(['obligor', 'obligee', 'shared'])
    .optional(),

  // Duration and Termination
  supportDuration: z.enum([
    'age-18',
    'age-19',
    'high-school-graduation',
    'college-graduation',
    'specific-date',
    'court-order',
  ]),
  terminationDate: z.string().optional(),
  terminationConditions: z.array(z.string()).default([]),

  // Modification
  modificationClause: z.boolean().default(true),
  modificationConditions: z.string().optional(),
  automaticAdjustment: z.boolean().default(false),

  // Enforcement
  enforcementMechanisms: z.array(z.string()).default([]),
  latePaymentPenalty: z.boolean().default(true),
  interestOnArrears: z.string().optional(),

  // Tax Considerations
  taxDependencyExemption: z
    .enum(['obligor', 'obligee', 'alternating', 'shared'])
    .optional(),
  taxResponsibility: z.string().optional(),

  // Life Insurance
  lifeInsurance: z.boolean().default(false),
  lifeInsuranceAmount: z.string().optional(),
  lifeInsuranceBeneficiary: z.string().optional(),

  // Visitation/Custody Impact
  custodyArrangement: z.string().optional(),
  visitationImpact: z.boolean().default(false),

  // State Guidelines
  stateGuidelines: z.boolean().default(true),
  deviationReason: z.string().optional(),
  stateCalculation: z.string().optional(),

  // Cost of Living Adjustments
  colaAdjustments: z.boolean().default(false),
  colaFrequency: z.enum(['annual', 'biennial', 'other']).optional(),
  colaIndex: z.string().optional(),

  // Review and Modification
  periodicReview: z.boolean().default(false),
  reviewFrequency: z.enum(['annual', 'biennial', 'triennial']).optional(),

  // Legal Provisions
  governingLaw: z.string().optional(),
  jurisdiction: z.string().optional(),
  disputeResolution: z.enum(['mediation', 'arbitration', 'court']).optional(),

  // Attorney Fees
  attorneyFees: z.boolean().default(false),
  attorneyFeeResponsibility: z
    .enum(['obligor', 'obligee', 'prevailing-party'])
    .optional(),

  // Additional Provisions
  entireAgreement: z.boolean().default(true),
  severability: z.boolean().default(true),
  bindingEffect: z.boolean().default(true),

  // Signatures
  requireObligorSignature: z.boolean().default(true),
  requireObligeeSignature: z.boolean().default(true),
  requireNotarization: z.boolean().default(true),
  requireWitnessSignature: z.boolean().default(false),
});
