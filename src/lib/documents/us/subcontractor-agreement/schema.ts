// src/lib/documents/us/subcontractor-agreement/schema.ts
import { z } from 'zod';

export const SubcontractorAgreementSchema = z.object({
  // General Contractor Information
  contractorName: z.string().min(1, 'General contractor name is required'),
  contractorAddress: z
    .string()
    .min(1, 'General contractor address is required'),
  contractorPhone: z.string().min(1, 'General contractor phone is required'),
  contractorLicense: z.string().optional(),

  // Subcontractor Information
  subcontractorName: z.string().min(1, 'Subcontractor name is required'),
  subcontractorAddress: z.string().min(1, 'Subcontractor address is required'),
  subcontractorPhone: z.string().min(1, 'Subcontractor phone is required'),
  subcontractorLicense: z.string().optional(),
  subcontractorTrade: z.string().min(1, 'Subcontractor trade is required'),

  // Project Information
  projectName: z.string().min(1, 'Project name is required'),
  projectAddress: z.string().min(1, 'Project address is required'),
  ownerName: z.string().optional(),
  primeContractNumber: z.string().optional(),

  // Agreement Details
  agreementDate: z.string().min(1, 'Agreement date is required'),
  workStartDate: z.string().min(1, 'Work start date is required'),
  workCompletionDate: z.string().min(1, 'Work completion date is required'),

  // Scope of Work
  workDescription: z.string().min(1, 'Work description is required'),
  tradeSpecialty: z.enum([
    'electrical',
    'plumbing',
    'hvac',
    'roofing',
    'flooring',
    'drywall',
    'painting',
    'concrete',
    'masonry',
    'landscaping',
    'other',
  ]),
  detailedSpecifications: z.string().optional(),
  materialsIncluded: z.boolean().default(true),
  laborIncluded: z.boolean().default(true),
  equipmentIncluded: z.boolean().default(false),

  // Contract Price
  contractAmount: z.string().min(1, 'Contract amount is required'),
  pricingMethod: z.enum([
    'lump-sum',
    'unit-price',
    'cost-plus',
    'time-and-material',
  ]),
  paymentSchedule: z.enum([
    'completion',
    'progress-payments',
    'monthly',
    'milestone-based',
  ]),
  retainagePercentage: z.string().optional(),

  // Payment Terms
  paymentTerms: z.string().optional(),
  invoiceRequirements: z.string().optional(),
  paymentPeriod: z.string().optional(),
  latePaymentPenalty: z.boolean().default(false),

  // Performance Requirements
  performanceStandards: z.string().optional(),
  qualityRequirements: z.string().optional(),
  codeCompliance: z.boolean().default(true),
  inspectionRequirements: z.boolean().default(true),
  correctionOfWork: z.boolean().default(true),

  // Schedule and Coordination
  workingHours: z.string().optional(),
  scheduleCoordination: z.boolean().default(true),
  progressReporting: z.boolean().default(false),
  delayNotification: z.boolean().default(true),
  liquidatedDamages: z.boolean().default(false),

  // Insurance Requirements
  generalLiabilityInsurance: z.string().optional(),
  workersCompensation: z.boolean().default(true),
  autoInsurance: z.boolean().default(false),
  additionalInsured: z.boolean().default(true),
  certificateOfInsurance: z.boolean().default(true),

  // Safety Requirements
  safetyCompliance: z.boolean().default(true),
  safetyProgram: z.boolean().default(false),
  personalProtectiveEquipment: z.boolean().default(true),
  accidentReporting: z.boolean().default(true),
  oshaCompliance: z.boolean().default(true),

  // Change Orders
  changeOrderProcess: z.boolean().default(true),
  changeOrderApproval: z
    .enum(['written-only', 'verbal-allowed', 'email-allowed'])
    .default('written-only'),
  changeOrderPricing: z.string().optional(),

  // Materials and Equipment
  materialProcurement: z
    .enum(['subcontractor', 'contractor', 'owner', 'shared'])
    .default('subcontractor'),
  materialApproval: z.boolean().default(false),
  materialWarranties: z.boolean().default(true),
  equipmentResponsibility: z.string().optional(),

  // Subcontractor Obligations
  permitCompliance: z.boolean().default(true),
  cleanupResponsibility: z.boolean().default(true),
  wasteDisposal: z.boolean().default(true),
  siteProtection: z.boolean().default(true),
  coordinationWithOthers: z.boolean().default(true),

  // Warranties
  workmanshipWarranty: z.boolean().default(true),
  warrantyPeriod: z.string().optional(),
  materialWarranty: z.boolean().default(true),
  callbackResponsibility: z.boolean().default(true),

  // Termination
  terminationRights: z.boolean().default(true),
  terminationForCause: z.array(z.string()).default([]),
  terminationNotice: z.string().optional(),
  terminationPayment: z.string().optional(),

  // Dispute Resolution
  disputeResolution: z
    .enum(['negotiation', 'mediation', 'arbitration', 'litigation'])
    .optional(),
  governingLaw: z.string().optional(),
  attorneyFees: z.boolean().default(false),

  // Indemnification
  subcontractorIndemnity: z.boolean().default(true),
  contractorIndemnity: z.boolean().default(false),
  mutualIndemnity: z.boolean().default(false),
  indemnityScope: z.string().optional(),

  // Lien Rights
  lienWaiver: z.boolean().default(true),
  lienWaiverTiming: z
    .enum(['progress-payments', 'final-payment', 'both'])
    .optional(),
  mechanicsLienRights: z.boolean().default(true),

  // Independent Contractor Status
  independentContractor: z.boolean().default(true),
  noEmployeeRelationship: z.boolean().default(true),
  taxResponsibility: z.boolean().default(true),

  // Assignment and Subcontracting
  assignmentAllowed: z.boolean().default(false),
  furtherSubcontracting: z.boolean().default(false),
  subcontractorApproval: z.boolean().default(true),

  // Confidentiality
  confidentialityClause: z.boolean().default(false),
  proprietaryInformation: z.boolean().default(false),

  // Environmental Compliance
  environmentalCompliance: z.boolean().default(false),
  hazardousMaterials: z.boolean().default(false),

  // Final Completion
  finalInspection: z.boolean().default(true),
  punchList: z.boolean().default(true),
  finalAcceptance: z.boolean().default(true),

  // Documentation
  dailyReports: z.boolean().default(false),
  progressPhotos: z.boolean().default(false),
  asBuiltDrawings: z.boolean().default(false),

  // Signatures
  requireContractorSignature: z.boolean().default(true),
  requireSubcontractorSignature: z.boolean().default(true),
  requireNotarization: z.boolean().default(false),
  requireWitnessSignature: z.boolean().default(false),
});
