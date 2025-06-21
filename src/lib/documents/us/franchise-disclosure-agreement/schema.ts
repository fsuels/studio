// src/lib/documents/us/franchise-disclosure-agreement/schema.ts
import { z } from 'zod';

export const FranchiseDisclosureAgreementSchema = z.object({
  // Franchisor Information
  franchisorName: z.string().min(1, 'Franchisor name is required'),
  franchisorAddress: z.string().optional(),
  franchisorPhone: z.string().optional(),
  franchisorEmail: z.string().email().optional(),
  parentCompany: z.string().optional(),
  yearsInBusiness: z.string().optional(),
  franchiseExperience: z.string().optional(),

  // Franchisee Information
  franchiseeName: z.string().min(1, 'Franchisee name is required'),
  franchiseeAddress: z.string().optional(),
  franchiseePhone: z.string().optional(),
  franchiseeEmail: z.string().email().optional(),
  businessExperience: z.string().optional(),
  financialQualifications: z.string().optional(),

  // Franchise System
  franchiseBrand: z.string().optional(),
  businessType: z
    .enum([
      'restaurant',
      'retail',
      'service',
      'hospitality',
      'automotive',
      'education',
      'other',
    ])
    .optional(),
  systemDescription: z.string().optional(),
  numberOfUnits: z.string().optional(),
  companyOwnedUnits: z.string().optional(),

  // Territory and Location
  territoryGrant: z
    .enum(['exclusive', 'non-exclusive', 'protected', 'none'])
    .default('exclusive'),
  territoryDescription: z.string().optional(),
  territoryRadius: z.string().optional(),
  siteSelection: z
    .enum(['franchisor', 'franchisee', 'mutual'])
    .default('mutual'),
  locationApproval: z.boolean().default(true),

  // Initial Investment
  franchiseFee: z.string().optional(),
  totalInvestmentRange: z.string().optional(),
  workingCapital: z.string().optional(),
  equipmentCosts: z.string().optional(),
  buildOutCosts: z.string().optional(),
  inventoryCosts: z.string().optional(),

  // Ongoing Fees
  royaltyFee: z.string().optional(),
  royaltyBase: z
    .enum(['gross-sales', 'net-sales', 'fixed', 'sliding-scale'])
    .default('gross-sales'),
  advertisingFee: z.string().optional(),
  technologyFee: z.string().optional(),
  otherFees: z.string().optional(),

  // Training and Support
  initialTraining: z.string().optional(),
  trainingLocation: z.string().optional(),
  trainingDuration: z.string().optional(),
  ongoingTraining: z.boolean().default(true),
  operationsManual: z.boolean().default(true),
  fieldSupport: z.boolean().default(true),

  // Marketing and Advertising
  nationalAdvertising: z.boolean().default(true),
  regionalAdvertising: z.boolean().default(false),
  localAdvertising: z.string().optional(),
  marketingMaterials: z.boolean().default(true),
  websiteProvision: z.boolean().default(true),
  socialMediaSupport: z.boolean().default(true),

  // Products and Services
  requiredProducts: z.string().optional(),
  approvedSuppliers: z.boolean().default(true),
  proprietaryProducts: z.boolean().default(false),
  qualityStandards: z.string().optional(),
  menuRequirements: z.string().optional(),

  // Operations Requirements
  operatingHours: z.string().optional(),
  staffingRequirements: z.string().optional(),
  uniformRequirements: z.boolean().default(true),
  insuranceRequirements: z.string().optional(),
  reportingRequirements: z.string().optional(),

  // Technology Systems
  posSystem: z.boolean().default(true),
  inventoryManagement: z.boolean().default(true),
  customerManagement: z.boolean().default(false),
  financialReporting: z.boolean().default(true),
  technologyUpdates: z.boolean().default(true),

  // Intellectual Property
  trademarkLicense: z.boolean().default(true),
  tradeDressRights: z.boolean().default(true),
  copyrightedMaterials: z.boolean().default(true),
  tradeSecrets: z.boolean().default(true),
  ipProtection: z.string().optional(),

  // Financial Performance
  financialDisclosures: z.boolean().default(true),
  averageUnitSales: z.string().optional(),
  profitabilityData: z.boolean().default(false),
  breakevenTimeline: z.string().optional(),

  // Term and Renewal
  initialTerm: z.string().optional(),
  renewalTerms: z.string().optional(),
  renewalConditions: z.string().optional(),
  renewalFees: z.string().optional(),
  terminationNotice: z.string().optional(),

  // Transfer and Assignment
  transferRights: z.boolean().default(true),
  transferApproval: z.boolean().default(true),
  transferFee: z.string().optional(),
  rightOfFirstRefusal: z.boolean().default(true),
  deathOrDisability: z.string().optional(),

  // Competition and Restrictions
  nonCompeteRadius: z.string().optional(),
  nonCompetePeriod: z.string().optional(),
  inTermRestrictions: z.boolean().default(true),
  postTermRestrictions: z.boolean().default(true),
  confidentialityObligations: z.boolean().default(true),

  // Default and Termination
  defaultEvents: z.string().optional(),
  cureperiod: z.string().optional(),
  immediateTermination: z.string().optional(),
  terminationObligations: z.string().optional(),
  postTerminationRights: z.string().optional(),

  // Dispute Resolution
  mediationRequired: z.boolean().default(true),
  arbitrationRequired: z.boolean().default(true),
  litigationVenue: z.string().optional(),
  governingLaw: z.string().optional(),
  attorneyFees: z.boolean().default(false),

  // Insurance and Indemnification
  generalLiability: z.string().optional(),
  propertyInsurance: z.string().optional(),
  businessInterruption: z.boolean().default(false),
  indemnificationClauses: z.boolean().default(true),

  // Financial Statements
  auditedFinancials: z.boolean().default(true),
  franchiseeFinancials: z.boolean().default(true),
  parentFinancials: z.boolean().default(false),
  financialHistory: z.string().optional(),

  // Litigation History
  currentLitigation: z.string().optional(),
  pastLitigation: z.string().optional(),
  bankruptcyHistory: z.boolean().default(false),
  regulatoryActions: z.string().optional(),

  // Franchisee Associations
  franchiseeCouncil: z.boolean().default(false),
  franchiseeAdvocacy: z.boolean().default(false),
  systemWideChanges: z.string().optional(),
  votingRights: z.boolean().default(false),

  // Multi-Unit Development
  multiUnitRights: z.boolean().default(false),
  developmentSchedule: z.string().optional(),
  developmentFees: z.string().optional(),
  areaRights: z.string().optional(),

  // International Operations
  internationalRights: z.boolean().default(false),
  masterFranchise: z.boolean().default(false),
  currencyProvisions: z.string().optional(),
  importExportRequirements: z.string().optional(),

  // Quality Control
  inspectionRights: z.boolean().default(true),
  mysteryShoppers: z.boolean().default(true),
  customerSatisfaction: z.string().optional(),
  remediationProcess: z.string().optional(),

  // Exit Strategy
  buybackOptions: z.boolean().default(false),
  liquidationAssistance: z.boolean().default(false),
  equipmentRepurchase: z.boolean().default(false),
  leaseAssignment: z.boolean().default(true),

  // Earnings Claims
  earningsRepresentations: z.boolean().default(false),
  financialProjections: z.boolean().default(false),
  disclaimers: z.boolean().default(true),
  riskFactors: z.string().optional(),

  // Signature Requirements
  franchisorSignature: z.boolean().default(true),
  franchiseeSignature: z.boolean().default(true),
  spouseSignature: z.boolean().default(false),
  guarantorSignature: z.boolean().default(false),
  witnessSignature: z.boolean().default(true),
  notarization: z.boolean().default(true),
});
