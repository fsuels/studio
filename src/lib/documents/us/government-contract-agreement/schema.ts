// src/lib/documents/us/government-contract-agreement/schema.ts
import { z } from 'zod';

export const GovernmentContractAgreementSchema = z.object({
  // Government Agency Information
  agencyName: z.string().min(1, 'Government agency name is required'),
  agencyAddress: z.string().optional(),
  contractingOfficer: z.string().optional(),
  contractingOfficerPhone: z.string().optional(),
  contractingOfficerEmail: z.string().email().optional(),
  agencyLevel: z
    .enum(['federal', 'state', 'county', 'municipal'])
    .default('federal'),

  // Contractor Information
  contractorName: z.string().min(1, 'Contractor name is required'),
  contractorAddress: z.string().optional(),
  contractorPhone: z.string().optional(),
  contractorEmail: z.string().email().optional(),
  dunsBradstreetNumber: z.string().optional(),
  cageCode: z.string().optional(),
  taxId: z.string().optional(),

  // Contract Details
  contractNumber: z.string().optional(),
  contractType: z
    .enum([
      'fixed-price',
      'cost-reimbursement',
      'time-materials',
      'indefinite-delivery',
    ])
    .optional(),
  contractValue: z.string().optional(),
  performancePeriod: z.string().optional(),
  optionPeriods: z.string().optional(),
  placeOfPerformance: z.string().optional(),

  // Procurement Information
  solicitationNumber: z.string().optional(),
  procurementMethod: z
    .enum([
      'sealed-bid',
      'competitive-proposal',
      'sole-source',
      'small-business-set-aside',
    ])
    .optional(),
  naicsCode: z.string().optional(),
  pscCode: z.string().optional(),
  competitionType: z
    .enum(['full-open', 'set-aside', 'sole-source', 'limited'])
    .optional(),

  // Small Business Certifications
  smallBusiness: z.boolean().default(false),
  womanOwned: z.boolean().default(false),
  minorityOwned: z.boolean().default(false),
  veteranOwned: z.boolean().default(false),
  hubzoneEligible: z.boolean().default(false),
  sdb8a: z.boolean().default(false),

  // Scope of Work
  workDescription: z.string().optional(),
  deliverables: z.string().optional(),
  specifications: z.string().optional(),
  qualityRequirements: z.string().optional(),
  performanceStandards: z.string().optional(),
  acceptanceCriteria: z.string().optional(),

  // Compliance Requirements
  farCompliance: z.boolean().default(true),
  dfarCompliance: z.boolean().default(false),
  equalOpportunity: z.boolean().default(true),
  affirmativeAction: z.boolean().default(true),
  drugFreeWorkplace: z.boolean().default(true),

  // Security Requirements
  securityClearance: z.boolean().default(false),
  clearanceLevel: z
    .enum(['confidential', 'secret', 'top-secret', 'none'])
    .default('none'),
  facilitySecurityClearance: z.boolean().default(false),
  citizenshipRequirement: z.boolean().default(false),
  backgroundInvestigation: z.boolean().default(false),

  // Payment Terms
  paymentSchedule: z
    .enum(['monthly', 'milestone', 'completion', 'progress'])
    .default('monthly'),
  invoicingRequirements: z.string().optional(),
  paymentTerms: z.enum(['net-30', 'net-45', 'net-60']).default('net-30'),
  promptPaymentAct: z.boolean().default(true),
  electronicPayment: z.boolean().default(true),

  // Reporting Requirements
  progressReports: z.boolean().default(true),
  reportingFrequency: z
    .enum(['weekly', 'monthly', 'quarterly'])
    .default('monthly'),
  contractingOfficerReports: z.boolean().default(true),
  subcontractingPlan: z.boolean().default(false),
  utilizationReports: z.boolean().default(false),

  // Subcontracting
  subcontractingAllowed: z.boolean().default(true),
  subcontractorApproval: z.boolean().default(true),
  smallBusinessSubcontracting: z.string().optional(),
  subcontractingGoals: z.string().optional(),
  flowDownClauses: z.boolean().default(true),

  // Quality Assurance
  qualityAssurancePlan: z.boolean().default(true),
  inspectionRights: z.boolean().default(true),
  qualityControl: z.string().optional(),
  testingRequirements: z.string().optional(),
  certificationRequirements: z.string().optional(),

  // Intellectual Property
  dataRights: z
    .enum(['unlimited', 'limited', 'restricted', 'government-purpose'])
    .default('limited'),
  technicalData: z.string().optional(),
  computerSoftware: z.string().optional(),
  patentIndemnity: z.boolean().default(true),
  inventionReporting: z.boolean().default(true),

  // Insurance and Bonding
  performanceBond: z.boolean().default(false),
  paymentBond: z.boolean().default(false),
  bidBond: z.boolean().default(false),
  generalLiability: z.boolean().default(true),
  professionalLiability: z.boolean().default(false),

  // Environmental Compliance
  environmentalCompliance: z.boolean().default(true),
  nepaCompliance: z.boolean().default(false),
  hazardousMaterials: z.boolean().default(false),
  wasteDisposal: z.string().optional(),
  sustainabilityRequirements: z.string().optional(),

  // Labor Standards
  davisBacon: z.boolean().default(false),
  serviceContract: z.boolean().default(false),
  minimumWage: z.boolean().default(true),
  overtime: z.boolean().default(true),
  workersCompensation: z.boolean().default(true),

  // Buy American Requirements
  buyAmerican: z.boolean().default(true),
  domesticContent: z.string().optional(),
  foreignContent: z.string().optional(),
  waiverRequests: z.boolean().default(false),

  // Export Controls
  exportControlled: z.boolean().default(false),
  itarCompliance: z.boolean().default(false),
  earCompliance: z.boolean().default(false),
  foreignNationals: z.boolean().default(false),

  // Dispute Resolution
  disputeResolution: z
    .enum(['contracting-officer', 'appeals-board', 'court-claims'])
    .default('contracting-officer'),
  claimsProcess: z.boolean().default(true),
  alternativeDisputeResolution: z.boolean().default(true),

  // Termination
  terminationForConvenience: z.boolean().default(true),
  terminationForDefault: z.boolean().default(true),
  terminationCosts: z.string().optional(),
  transitionOut: z.string().optional(),

  // Modifications
  modificationProcedures: z.string().optional(),
  changeOrders: z.boolean().default(true),
  bilateralModifications: z.boolean().default(true),
  unilateralModifications: z.boolean().default(true),

  // Ethics and Integrity
  conflictOfInterest: z.boolean().default(true),
  giftProhibitions: z.boolean().default(true),
  kickbackProhibitions: z.boolean().default(true),
  whistleblowerProtection: z.boolean().default(true),

  // Records and Audit
  recordKeeping: z.boolean().default(true),
  auditRights: z.boolean().default(true),
  costAccountingStandards: z.boolean().default(false),
  dcaaAudit: z.boolean().default(false),
  recordRetention: z.string().optional(),

  // Technology and Innovation
  otherTransactionAuthority: z.boolean().default(false),
  researchAndDevelopment: z.boolean().default(false),
  prototypeProject: z.boolean().default(false),
  commercialItem: z.boolean().default(false),

  // International Considerations
  internationalTraffic: z.boolean().default(false),
  foreignGovernmentInfo: z.boolean().default(false),
  technologyTransfer: z.boolean().default(false),
  foreignInfluence: z.boolean().default(false),

  // Special Contract Types
  gsaSchedule: z.boolean().default(false),
  blanketPurchaseAgreement: z.boolean().default(false),
  indefiniteQuantity: z.boolean().default(false),
  multipleAward: z.boolean().default(false),

  // Signature Requirements
  contractingOfficerSignature: z.boolean().default(true),
  contractorSignature: z.boolean().default(true),
  witnessSignature: z.boolean().default(false),
  notarization: z.boolean().default(false),
  electronicSignature: z.boolean().default(true),
});
