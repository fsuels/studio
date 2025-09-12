// src/lib/documents/us/patent-licensing-agreement/schema.ts
import { z } from 'zod';

export const PatentLicensingAgreementSchema = z.object({
  // Licensor Information
  licensorName: z.string().min(1, 'Licensor name is required'),
  licensorAddress: z.string().optional(),
  licensorPhone: z.string().optional(),
  licensorEmail: z.string().email().optional(),
  licensorType: z.enum(['individual', 'corporation', 'university', 'government']).optional(),
  
  // Licensee Information
  licenseeName: z.string().min(1, 'Licensee name is required'),
  licenseeAddress: z.string().optional(),
  licenseePhone: z.string().optional(),
  licenseeEmail: z.string().email().optional(),
  licenseeType: z.enum(['individual', 'corporation', 'startup', 'manufacturer']).optional(),
  
  // Patent Information
  patentNumber: z.string().optional(),
  patentTitle: z.string().optional(),
  patentApplication: z.string().optional(),
  filingDate: z.string().optional(),
  issuanceDate: z.string().optional(),
  expirationDate: z.string().optional(),
  inventorNames: z.string().optional(),
  
  // License Scope
  licenseType: z.enum(['exclusive', 'non-exclusive', 'sole', 'co-exclusive']).default('non-exclusive'),
  territorialScope: z.enum(['worldwide', 'usa', 'north-america', 'specific-countries']).default('usa'),
  specificCountries: z.string().optional(),
  fieldOfUse: z.string().optional(),
  marketSegments: z.string().optional(),
  
  // Licensed Rights
  manufactureRights: z.boolean().default(true),
  useRights: z.boolean().default(true),
  sellRights: z.boolean().default(true),
  importRights: z.boolean().default(false),
  exportRights: z.boolean().default(false),
  sublicenseRights: z.boolean().default(false),
  
  // Financial Terms
  upfrontPayment: z.string().optional(),
  royaltyRate: z.string().optional(),
  royaltyBase: z.enum(['net-sales', 'gross-sales', 'units-sold', 'profits']).default('net-sales'),
  minimumRoyalty: z.string().optional(),
  maximumRoyalty: z.string().optional(),
  milestonePayments: z.string().optional(),
  
  // Payment Terms
  paymentSchedule: z.enum(['monthly', 'quarterly', 'annually']).default('quarterly'),
  paymentDeadline: z.string().optional(),
  lateFees: z.string().optional(),
  currency: z.enum(['usd', 'eur', 'other']).default('usd'),
  auditRights: z.boolean().default(true),
  
  // Development and Commercialization
  developmentMilestones: z.string().optional(),
  commercializationDeadline: z.string().optional(),
  diligenceRequirements: z.string().optional(),
  marketingEfforts: z.string().optional(),
  performanceStandards: z.string().optional(),
  
  // Technology Transfer
  technicalDocumentation: z.boolean().default(true),
  trainingProvision: z.boolean().default(false),
  technicalSupport: z.string().optional(),
  knowHowTransfer: z.boolean().default(false),
  tradeSecrets: z.boolean().default(false),
  
  // Quality Control
  qualityStandards: z.string().optional(),
  manufacturingStandards: z.string().optional(),
  testingRequirements: z.string().optional(),
  approvalRights: z.boolean().default(true),
  recallRights: z.boolean().default(true),
  
  // Improvements and Modifications
  improvementOwnership: z.enum(['licensor', 'licensee', 'shared', 'inventor']).default('inventor'),
  grantBackRights: z.boolean().default(false),
  modificationRights: z.boolean().default(true),
  derivativeWorks: z.boolean().default(false),
  
  // Patent Prosecution
  prosecutionResponsibility: z.enum(['licensor', 'licensee', 'shared']).default('licensor'),
  prosecutionCosts: z.enum(['licensor', 'licensee', 'shared']).default('licensor'),
  patentMaintenance: z.boolean().default(true),
  continuationApplications: z.boolean().default(true),
  
  // Patent Defense
  infringementDefense: z.enum(['licensor', 'licensee', 'shared']).default('licensor'),
  litigationCosts: z.enum(['licensor', 'licensee', 'shared']).default('licensor'),
  settlementApproval: z.boolean().default(true),
  damagesSharing: z.string().optional(),
  
  // Infringement Enforcement
  enforcementRights: z.enum(['licensor', 'licensee', 'both']).default('licensor'),
  infringementNotification: z.boolean().default(true),
  enforcementCosts: z.enum(['licensor', 'licensee', 'shared']).default('licensor'),
  recoveredDamages: z.string().optional(),
  
  // Confidentiality
  confidentialityTerm: z.string().optional(),
  confidentialInformation: z.string().optional(),
  confidentialityExceptions: z.string().optional(),
  returnOfInformation: z.boolean().default(true),
  
  // Representations and Warranties
  ownershipWarranty: z.boolean().default(true),
  validityWarranty: z.boolean().default(true),
  enforceabilityWarranty: z.boolean().default(true),
  nonInfringementWarranty: z.boolean().default(true),
  disclosureCompleteness: z.boolean().default(true),
  
  // Indemnification
  licensorIndemnity: z.boolean().default(true),
  licenseeIndemnity: z.boolean().default(true),
  productLiability: z.boolean().default(false),
  intellectualPropertyClaims: z.boolean().default(true),
  
  // Term and Termination
  licenseTerm: z.string().optional(),
  renewalOptions: z.string().optional(),
  terminationRights: z.string().optional(),
  breachCureperiod: z.string().optional(),
  terminationObligations: z.string().optional(),
  
  // Post-Termination
  sellOffPeriod: z.string().optional(),
  inventoryDisposition: z.string().optional(),
  continuingObligations: z.string().optional(),
  survivalClauses: z.string().optional(),
  
  // Regulatory and Compliance
  regulatoryApprovals: z.boolean().default(false),
  fdaApproval: z.boolean().default(false),
  exportControls: z.boolean().default(false),
  complianceObligations: z.string().optional(),
  
  // International Considerations
  foreignFiling: z.boolean().default(false),
  pctApplications: z.boolean().default(false),
  foreignLicensing: z.boolean().default(false),
  currencyConversion: z.string().optional(),
  
  // Competition and Antitrust
  competitionClauses: z.string().optional(),
  exclusiveDealings: z.boolean().default(false),
  tieInArrangements: z.boolean().default(false),
  antitrustCompliance: z.boolean().default(true),
  
  // Record Keeping
  salesRecords: z.boolean().default(true),
  manufacturingRecords: z.boolean().default(true),
  royaltyReports: z.boolean().default(true),
  recordRetention: z.string().optional(),
  
  // Insurance
  productLiabilityInsurance: z.boolean().default(false),
  generalLiabilityInsurance: z.boolean().default(false),
  intellectualPropertyInsurance: z.boolean().default(false),
  insuranceLimits: z.string().optional(),
  
  // Dispute Resolution
  disputeResolution: z.enum(['negotiation', 'mediation', 'arbitration', 'litigation']).default('arbitration'),
  governingLaw: z.string().optional(),
  jurisdiction: z.string().optional(),
  attorneyFees: z.boolean().default(false),
  
  // Miscellaneous
  entireAgreement: z.boolean().default(true),
  amendments: z.string().optional(),
  assignability: z.boolean().default(false),
  severability: z.boolean().default(true),
  notices: z.string().optional(),
  
  // Signature Requirements
  licensorSignature: z.boolean().default(true),
  licenseeSignature: z.boolean().default(true),
  witnessSignature: z.boolean().default(false),
  notarization: z.boolean().default(false),
  electronicSignature: z.boolean().default(true),
});
