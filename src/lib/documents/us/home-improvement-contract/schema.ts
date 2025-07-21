// src/lib/documents/us/home-improvement-contract/schema.ts
import { z } from 'zod';

export const HomeImprovementContractSchema = z.object({
  // Homeowner Information
  homeownerName: z.string().min(1, 'Homeowner name is required'),
  homeownerAddress: z.string().min(1, 'Homeowner address is required'),
  homeownerPhone: z.string().min(1, 'Homeowner phone is required'),
  homeownerEmail: z.string().email().optional(),

  // Contractor Information
  contractorName: z.string().min(1, 'Contractor name is required'),
  contractorAddress: z.string().min(1, 'Contractor address is required'),
  contractorPhone: z.string().min(1, 'Contractor phone is required'),
  contractorEmail: z.string().email().optional(),
  contractorLicense: z.string().optional(),
  contractorInsurance: z.string().optional(),

  // Project Information
  projectAddress: z.string().min(1, 'Project address is required'),
  projectDescription: z.string().min(1, 'Project description is required'),
  projectType: z.enum([
    'kitchen-remodel',
    'bathroom-remodel',
    'addition',
    'roofing',
    'flooring',
    'painting',
    'electrical',
    'plumbing',
    'hvac',
    'landscaping',
    'other',
  ]),

  // Contract Details
  contractDate: z.string().min(1, 'Contract date is required'),
  startDate: z.string().min(1, 'Start date is required'),
  completionDate: z.string().min(1, 'Completion date is required'),

  // Financial Terms
  contractPrice: z.string().min(1, 'Contract price is required'),
  paymentSchedule: z.enum([
    'upfront',
    'progress-payments',
    'completion',
    'custom',
  ]),
  downPayment: z.string().optional(),
  progressPayments: z
    .array(
      z.object({
        milestone: z.string(),
        amount: z.string(),
        percentage: z.string().optional(),
      }),
    )
    .default([]),

  // Materials and Labor
  materialsIncluded: z.boolean().default(true),
  laborIncluded: z.boolean().default(true),
  materialAllowance: z.string().optional(),
  materialUpgrades: z.boolean().default(false),

  // Permits and Approvals
  permitsRequired: z.boolean().default(false),
  permitResponsibility: z
    .enum(['homeowner', 'contractor', 'shared'])
    .optional(),
  permitCosts: z.enum(['homeowner', 'contractor', 'included']).optional(),
  inspectionRequirements: z.boolean().default(false),

  // Insurance and Bonding
  contractorInsuranceRequired: z.boolean().default(true),
  liabilityInsurance: z.string().optional(),
  workersCompensation: z.boolean().default(true),
  bondingRequired: z.boolean().default(false),
  bondAmount: z.string().optional(),

  // Work Specifications
  workSpecifications: z.string().optional(),
  materialSpecifications: z.string().optional(),
  workmanshipStandards: z.string().optional(),
  codeCompliance: z.boolean().default(true),

  // Timeline and Schedule
  workingHours: z.string().optional(),
  workingDays: z.string().optional(),
  weatherDelays: z.boolean().default(true),
  timeExtensions: z.string().optional(),

  // Change Orders
  changeOrderProcess: z.boolean().default(true),
  changeOrderApproval: z
    .enum(['written-only', 'verbal-allowed', 'email-allowed'])
    .default('written-only'),
  changeOrderPricing: z.string().optional(),

  // Cleanup and Disposal
  dailyCleanup: z.boolean().default(true),
  finalCleanup: z.boolean().default(true),
  wasteDisposal: z
    .enum(['contractor', 'homeowner', 'shared'])
    .default('contractor'),
  dumpsterProvision: z.boolean().default(false),

  // Warranties
  workmanshipWarranty: z.boolean().default(true),
  warrantyPeriod: z.string().optional(),
  materialWarranties: z.boolean().default(true),
  warrantyTransfer: z.boolean().default(true),

  // Protection and Safety
  propertyProtection: z.boolean().default(true),
  existingStructureProtection: z.string().optional(),
  safetyMeasures: z.string().optional(),
  utilityProtection: z.boolean().default(true),

  // Subcontractors
  subcontractorsAllowed: z.boolean().default(true),
  subcontractorApproval: z.boolean().default(false),
  subcontractorInsurance: z.boolean().default(true),
  subcontractorLiability: z
    .enum(['contractor-responsible', 'homeowner-accepts', 'shared'])
    .default('contractor-responsible'),

  // Access and Occupancy
  homeownerOccupancy: z.boolean().default(true),
  accessHours: z.string().optional(),
  keyProvision: z.boolean().default(false),
  securityMeasures: z.string().optional(),

  // Delays and Disruptions
  weatherClause: z.boolean().default(true),
  unforeseeableConditions: z.boolean().default(true),
  delayNotification: z.string().optional(),
  liquidatedDamages: z.boolean().default(false),

  // Termination
  terminationRights: z.boolean().default(true),
  terminationNotice: z.string().optional(),
  terminationPayment: z.string().optional(),
  workStoppageRights: z.boolean().default(true),

  // Dispute Resolution
  disputeResolution: z
    .enum(['mediation', 'arbitration', 'litigation'])
    .optional(),
  governingLaw: z.string().optional(),
  attorneyFees: z.boolean().default(false),

  // Lien Rights
  lienWaiver: z.boolean().default(true),
  lienWaiverTiming: z
    .enum(['progress-payments', 'final-payment', 'both'])
    .optional(),
  mechanicsLienNotice: z.boolean().default(true),

  // Environmental and Health
  leadPaintDisclosure: z.boolean().default(false),
  asbestosDisclosure: z.boolean().default(false),
  hazardousMaterials: z.boolean().default(false),
  environmentalCompliance: z.boolean().default(true),

  // Final Inspection and Acceptance
  finalInspection: z.boolean().default(true),
  punchList: z.boolean().default(true),
  finalAcceptance: z.boolean().default(true),
  occupancyCertificate: z.boolean().default(false),

  // Documentation
  plansAndSpecifications: z.boolean().default(false),
  materialsList: z.boolean().default(false),
  photoDocumentation: z.boolean().default(false),
  dailyLogs: z.boolean().default(false),

  // Signatures
  requireHomeownerSignature: z.boolean().default(true),
  requireContractorSignature: z.boolean().default(true),
  requireNotarization: z.boolean().default(false),
  requireWitnessSignature: z.boolean().default(false),
});
