// src/lib/documents/us/construction-contract/schema.ts
import { z } from 'zod';

export const ConstructionContractSchema = z.object({
  // Owner Information
  ownerName: z.string().min(1, 'Owner name is required'),
  ownerAddress: z.string().min(1, 'Owner address is required'),
  ownerPhone: z.string().min(1, 'Owner phone is required'),
  ownerEmail: z.string().email().optional(),
  
  // Contractor Information
  contractorName: z.string().min(1, 'Contractor name is required'),
  contractorAddress: z.string().min(1, 'Contractor address is required'),
  contractorPhone: z.string().min(1, 'Contractor phone is required'),
  contractorEmail: z.string().email().optional(),
  contractorLicense: z.string().min(1, 'Contractor license is required'),
  contractorBond: z.string().optional(),
  
  // Architect/Engineer Information
  hasArchitect: z.boolean().default(false),
  architectName: z.string().optional(),
  architectAddress: z.string().optional(),
  architectLicense: z.string().optional(),
  
  // Project Information
  projectName: z.string().min(1, 'Project name is required'),
  projectAddress: z.string().min(1, 'Project address is required'),
  projectDescription: z.string().min(1, 'Project description is required'),
  projectType: z.enum(['residential-new', 'residential-addition', 'commercial-new', 'commercial-renovation', 'industrial', 'infrastructure', 'other']),
  
  // Contract Documents
  contractDocuments: z.array(z.string()).default([]),
  plansAndSpecifications: z.boolean().default(true),
  drawingRevisions: z.string().optional(),
  technicalSpecifications: z.string().optional(),
  
  // Contract Details
  contractDate: z.string().min(1, 'Contract date is required'),
  commencementDate: z.string().min(1, 'Commencement date is required'),
  substantialCompletionDate: z.string().min(1, 'Substantial completion date is required'),
  finalCompletionDate: z.string().min(1, 'Final completion date is required'),
  
  // Contract Price and Payment
  contractPriceType: z.enum(['lump-sum', 'cost-plus-fee', 'cost-plus-percentage', 'unit-price', 'guaranteed-maximum']),
  contractPrice: z.string().min(1, 'Contract price is required'),
  contingencyAmount: z.string().optional(),
  allowanceAmounts: z.array(z.object({
    item: z.string(),
    amount: z.string(),
    description: z.string().optional(),
  })).default([]),
  
  // Payment Schedule
  paymentSchedule: z.enum(['monthly-progress', 'milestone-based', 'percentage-completion', 'custom']),
  paymentTerms: z.string().optional(),
  retainagePercentage: z.string().optional(),
  finalPaymentRelease: z.string().optional(),
  
  // Performance and Payment Bonds
  performanceBondRequired: z.boolean().default(false),
  performanceBondAmount: z.string().optional(),
  paymentBondRequired: z.boolean().default(false),
  paymentBondAmount: z.string().optional(),
  
  // Insurance Requirements
  generalLiabilityInsurance: z.string().min(1, 'General liability insurance amount is required'),
  autoLiabilityInsurance: z.string().optional(),
  workersCompensationInsurance: z.boolean().default(true),
  builderRiskInsurance: z.boolean().default(false),
  professionalLiabilityInsurance: z.string().optional(),
  
  // Permits and Approvals
  permitsAndLicenses: z.enum(['owner-responsibility', 'contractor-responsibility', 'shared-responsibility']),
  permitCosts: z.enum(['owner-pays', 'contractor-pays', 'included-in-price']),
  buildingCodeCompliance: z.boolean().default(true),
  inspectionCoordination: z.enum(['owner', 'contractor', 'architect']),
  
  // Work Scope and Standards
  workScope: z.string().min(1, 'Work scope is required'),
  qualityStandards: z.string().optional(),
  materialStandards: z.string().optional(),
  workmanshipStandards: z.string().optional(),
  testing: z.string().optional(),
  
  // Time Extensions and Delays
  timeExtensionClauses: z.boolean().default(true),
  excusableDelays: z.array(z.string()).default([]),
  liquidatedDamages: z.boolean().default(false),
  liquidatedDamagesAmount: z.string().optional(),
  noticeProcedures: z.string().optional(),
  
  // Changes and Modifications
  changeOrderProcedures: z.boolean().default(true),
  changeOrderApproval: z.enum(['written-only', 'architect-approval', 'owner-approval']),
  unitPrices: z.boolean().default(false),
  markupOnChanges: z.string().optional(),
  
  // Subcontractors and Suppliers
  subcontractorApproval: z.boolean().default(true),
  subcontractorRequirements: z.string().optional(),
  subcontractorInsurance: z.boolean().default(true),
  supplierApproval: z.boolean().default(false),
  
  // Safety Requirements
  safetyProgram: z.boolean().default(true),
  safetyOfficer: z.boolean().default(false),
  oshaCompliance: z.boolean().default(true),
  safetyTraining: z.boolean().default(false),
  accidentReporting: z.boolean().default(true),
  
  // Environmental Compliance
  environmentalCompliance: z.boolean().default(true),
  hazardousMaterialsHandling: z.boolean().default(false),
  wasteDisposal: z.string().optional(),
  pollutionLiability: z.boolean().default(false),
  
  // Warranties
  constructionWarranty: z.boolean().default(true),
  warrantyPeriod: z.string().optional(),
  materialWarranties: z.boolean().default(true),
  equipmentWarranties: z.boolean().default(true),
  warrantyBond: z.boolean().default(false),
  
  // Completion and Acceptance
  substantialCompletionCriteria: z.string().optional(),
  finalCompletionCriteria: z.string().optional(),
  punchListProcedures: z.boolean().default(true),
  certificateOfOccupancy: z.boolean().default(false),
  finalInspection: z.boolean().default(true),
  
  // Project Administration
  projectManager: z.string().optional(),
  superintendentRequired: z.boolean().default(false),
  progressReporting: z.boolean().default(true),
  meetingSchedule: z.string().optional(),
  recordKeeping: z.boolean().default(true),
  
  // Dispute Resolution
  disputeResolutionMethod: z.enum(['negotiation', 'mediation', 'arbitration', 'litigation']),
  governingLaw: z.string().optional(),
  venueJurisdiction: z.string().optional(),
  attorneyFees: z.boolean().default(false),
  
  // Termination
  terminationForConvenience: z.boolean().default(true),
  terminationForCause: z.boolean().default(true),
  terminationNotice: z.string().optional(),
  terminationPayment: z.string().optional(),
  
  // Lien Rights and Waivers
  lienRights: z.boolean().default(true),
  lienWaivers: z.boolean().default(true),
  progressLienWaivers: z.boolean().default(true),
  finalLienWaiver: z.boolean().default(true),
  
  // Indemnification
  mutualIndemnification: z.boolean().default(false),
  contractorIndemnifiesOwner: z.boolean().default(true),
  ownerIndemnifiesContractor: z.boolean().default(false),
  indemnificationScope: z.string().optional(),
  
  // Force Majeure
  forceMajeureClause: z.boolean().default(true),
  forceMajeureEvents: z.array(z.string()).default([]),
  forceMajeureNotification: z.string().optional(),
  
  // Miscellaneous
  assignmentRights: z.boolean().default(false),
  thirdPartyBeneficiaries: z.boolean().default(false),
  survivingProvisions: z.array(z.string()).default([]),
  entireAgreement: z.boolean().default(true),
  severability: z.boolean().default(true),
  
  // Signatures
  requireOwnerSignature: z.boolean().default(true),
  requireContractorSignature: z.boolean().default(true),
  requireArchitectSignature: z.boolean().default(false),
  requireNotarization: z.boolean().default(false),
  requireWitnessSignature: z.boolean().default(false),
});