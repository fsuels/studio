// src/lib/documents/us/general-contractor-agreement/schema.ts
import { z } from 'zod';

export const GeneralContractorAgreementSchema = z.object({
  // Contractor Information
  contractorName: z.string().min(1, 'Contractor name is required'),
  contractorAddress: z.string().optional(),
  contractorPhone: z.string().optional(),
  contractorEmail: z.string().email().optional(),
  contractorLicense: z.string().optional(),
  contractorInsurance: z.string().optional(),
  contractorBond: z.string().optional(),
  
  // Property Owner Information
  ownerName: z.string().min(1, 'Property owner name is required'),
  ownerAddress: z.string().optional(),
  ownerPhone: z.string().optional(),
  ownerEmail: z.string().email().optional(),
  propertyAddress: z.string().optional(),
  
  // Project Details
  projectDescription: z.string().optional(),
  projectType: z.enum(['new-construction', 'renovation', 'addition', 'commercial', 'residential']).optional(),
  projectScope: z.string().optional(),
  buildingPermitNumber: z.string().optional(),
  projectSquareFootage: z.string().optional(),
  
  // Contract Terms
  contractType: z.enum(['fixed-price', 'cost-plus', 'time-materials', 'unit-price']).default('fixed-price'),
  totalContractPrice: z.string().optional(),
  costPlusPercentage: z.string().optional(),
  maximumPrice: z.string().optional(),
  laborRate: z.string().optional(),
  
  // Payment Schedule
  paymentSchedule: z.enum(['progress', 'milestone', 'monthly', 'completion']).default('progress'),
  downPayment: z.string().optional(),
  progressPayments: z.string().optional(),
  retainage: z.string().optional(),
  finalPayment: z.string().optional(),
  
  // Timeline
  startDate: z.string().optional(),
  substantialCompletionDate: z.string().optional(),
  finalCompletionDate: z.string().optional(),
  liquidatedDamages: z.string().optional(),
  weatherDays: z.string().optional(),
  
  // Scope of Work
  demolition: z.boolean().default(false),
  sitePreparation: z.boolean().default(true),
  foundation: z.boolean().default(true),
  framing: z.boolean().default(true),
  roofing: z.boolean().default(true),
  plumbing: z.boolean().default(true),
  electrical: z.boolean().default(true),
  hvac: z.boolean().default(true),
  insulation: z.boolean().default(true),
  drywall: z.boolean().default(true),
  flooring: z.boolean().default(true),
  painting: z.boolean().default(true),
  landscaping: z.boolean().default(false),
  
  // Materials and Specifications
  materialSupplier: z.enum(['contractor', 'owner', 'allowances']).default('contractor'),
  materialSpecifications: z.string().optional(),
  allowances: z.string().optional(),
  substitutions: z.boolean().default(true),
  ownerSuppliedMaterials: z.string().optional(),
  
  // Subcontractors
  subcontractorApproval: z.boolean().default(true),
  subcontractorList: z.string().optional(),
  subcontractorLiens: z.boolean().default(true),
  subcontractorInsurance: z.boolean().default(true),
  
  // Permits and Approvals
  buildingPermit: z.boolean().default(true),
  electricalPermit: z.boolean().default(true),
  plumbingPermit: z.boolean().default(true),
  mechanicalPermit: z.boolean().default(true),
  otherPermits: z.string().optional(),
  permitResponsibility: z.enum(['contractor', 'owner', 'shared']).default('contractor'),
  
  // Insurance Requirements
  generalLiability: z.boolean().default(true),
  workersCompensation: z.boolean().default(true),
  builderRisk: z.boolean().default(false),
  umbrellaPolicy: z.boolean().default(false),
  insuranceLimits: z.string().optional(),
  additionalInsured: z.boolean().default(true),
  
  // Warranties
  workmanshipWarranty: z.string().optional(),
  materialWarranty: z.string().optional(),
  systemWarranties: z.string().optional(),
  roofWarranty: z.string().optional(),
  warrantyTransfer: z.boolean().default(true),
  
  // Change Orders
  changeOrderProcess: z.string().optional(),
  changeOrderApproval: z.boolean().default(true),
  oralChangeOrders: z.boolean().default(false),
  changeOrderMarkup: z.string().optional(),
  
  // Site Conditions
  siteAccess: z.string().optional(),
  workingHours: z.string().optional(),
  noiseRestrictions: z.string().optional(),
  neighborNotification: z.boolean().default(true),
  siteCleanup: z.boolean().default(true),
  
  // Safety and Compliance
  safetyProgram: z.boolean().default(true),
  oshaCompliance: z.boolean().default(true),
  siteSecurit: z.boolean().default(false),
  drugTesting: z.boolean().default(false),
  backgroundChecks: z.boolean().default(false),
  
  // Quality Control
  inspectionRights: z.boolean().default(true),
  qualityStandards: z.string().optional(),
  defectiveWork: z.string().optional(),
  punchList: z.boolean().default(true),
  finalInspection: z.boolean().default(true),
  
  // Environmental
  leadPaintCompliance: z.boolean().default(false),
  asbestosCompliance: z.boolean().default(false),
  hazardousMaterials: z.boolean().default(false),
  wasteDisposal: z.string().optional(),
  recycling: z.boolean().default(false),
  
  // Utilities
  temporaryPower: z.enum(['contractor', 'owner', 'shared']).default('contractor'),
  temporaryWater: z.enum(['contractor', 'owner', 'shared']).default('contractor'),
  utilitiesTransfer: z.string().optional(),
  
  // Communication
  projectManager: z.string().optional(),
  communicationProtocol: z.string().optional(),
  meetingSchedule: z.string().optional(),
  progressReports: z.boolean().default(true),
  
  // Dispute Resolution
  disputeResolution: z.enum(['negotiation', 'mediation', 'arbitration', 'litigation']).default('mediation'),
  mechanicsLien: z.boolean().default(true),
  attorneyFees: z.boolean().default(false),
  venueJurisdiction: z.string().optional(),
  
  // Termination
  terminationForCause: z.string().optional(),
  terminationForConvenience: z.boolean().default(true),
  terminationCompensation: z.string().optional(),
  suspensionOfWork: z.string().optional(),
  
  // Indemnification
  contractorIndemnity: z.boolean().default(true),
  ownerIndemnity: z.boolean().default(false),
  consequentialDamages: z.boolean().default(false),
  limitationOfLiability: z.string().optional(),
  
  // Final Completion
  certificateOfOccupancy: z.boolean().default(true),
  asBuiltDrawings: z.boolean().default(false),
  operationManuals: z.boolean().default(false),
  warrantyDocuments: z.boolean().default(true),
  lienWaivers: z.boolean().default(true),
  
  // Special Provisions
  greenBuilding: z.boolean().default(false),
  leedCertification: z.boolean().default(false),
  energyEfficiency: z.string().optional(),
  smartHomeTechnology: z.boolean().default(false),
  customProvisions: z.string().optional(),
  
  // Force Majeure
  forceMajeureEvents: z.string().optional(),
  pandemicProvisions: z.boolean().default(true),
  weatherDelays: z.boolean().default(true),
  laborStrikes: z.boolean().default(true),
  
  // Signature Requirements
  contractorSignature: z.boolean().default(true),
  ownerSignature: z.boolean().default(true),
  spouseSignature: z.boolean().default(false),
  witnessSignature: z.boolean().default(false),
  notarization: z.boolean().default(false),
});