// src/lib/documents/us/affiliate-marketing-agreement/schema.ts
import { z } from 'zod';

export const AffiliateMarketingAgreementSchema = z.object({
  // Merchant Information
  merchantName: z.string().min(1, 'Merchant name is required'),
  merchantCompanyName: z.string().optional(),
  merchantAddress: z.string().min(1, 'Merchant address is required'),
  merchantPhone: z.string().optional(),
  merchantEmail: z.string().email().optional(),
  merchantWebsite: z.string().min(1, 'Merchant website is required'),

  // Affiliate Information
  affiliateName: z.string().min(1, 'Affiliate name is required'),
  affiliateBusinessName: z.string().optional(),
  affiliateAddress: z.string().min(1, 'Affiliate address is required'),
  affiliatePhone: z.string().optional(),
  affiliateEmail: z.string().email().optional(),
  affiliateWebsite: z.string().optional(),
  affiliateTaxId: z.string().optional(),

  // Program Details
  programName: z.string().min(1, 'Program name is required'),
  programDescription: z.string().min(1, 'Program description is required'),
  productCategories: z.array(z.string()).default([]),
  targetMarkets: z.string().optional(),
  territoryRestrictions: z.string().optional(),

  // Commission Structure
  commissionType: z
    .enum(['percentage', 'fixed', 'tiered', 'hybrid'])
    .default('percentage'),
  commissionRate: z.string().optional(),
  fixedCommissionAmount: z.string().optional(),
  tieredStructure: z.string().optional(),
  minimumSaleAmount: z.string().optional(),
  maximumCommissionCap: z.string().optional(),

  // Commission Tiers
  tier1Rate: z.string().optional(),
  tier1Threshold: z.string().optional(),
  tier2Rate: z.string().optional(),
  tier2Threshold: z.string().optional(),
  tier3Rate: z.string().optional(),
  tier3Threshold: z.string().optional(),

  // Bonus Structures
  performanceBonuses: z.boolean().default(false),
  volumeBonuses: z.boolean().default(false),
  recruitmentBonuses: z.boolean().default(false),
  bonusStructureDetails: z.string().optional(),

  // Payment Terms
  paymentSchedule: z
    .enum(['weekly', 'bi-weekly', 'monthly', 'quarterly'])
    .default('monthly'),
  paymentMethod: z
    .enum(['check', 'direct-deposit', 'paypal', 'wire-transfer'])
    .default('direct-deposit'),
  minimumPayoutThreshold: z.string().optional(),
  paymentDelay: z.string().optional(),
  currency: z.string().default('USD'),

  // Tracking and Attribution
  trackingMethod: z
    .enum(['cookies', 'links', 'codes', 'pixels'])
    .default('cookies'),
  cookieDuration: z.string().optional(),
  attributionWindow: z.string().optional(),
  uniqueAffiliateId: z.string().optional(),
  trackingLinkProvided: z.boolean().default(true),

  // Marketing Materials
  marketingMaterialsProvided: z.boolean().default(true),
  bannersProvided: z.boolean().default(true),
  textLinksProvided: z.boolean().default(true),
  productImagesProvided: z.boolean().default(true),
  emailTemplatesProvided: z.boolean().default(false),
  brandGuidelinesProvided: z.boolean().default(true),

  // Affiliate Responsibilities
  marketingEfforts: z.string().optional(),
  trafficGeneration: z.boolean().default(true),
  contentCreation: z.boolean().default(false),
  socialMediaPromotion: z.boolean().default(false),
  emailMarketing: z.boolean().default(false),
  paidAdvertising: z.boolean().default(false),

  // Prohibited Activities
  spamProhibition: z.boolean().default(true),
  falseClaims: z.boolean().default(true),
  trademarkMisuse: z.boolean().default(true),
  competitorBidding: z.boolean().default(true),
  adultContentRestrictions: z.boolean().default(true),
  illegalContentProhibition: z.boolean().default(true),

  // Marketing Restrictions
  paidSearchRestrictions: z.boolean().default(false),
  brandTermBidding: z.boolean().default(false),
  emailMarketingRestrictions: z.boolean().default(false),
  socialMediaRestrictions: z.boolean().default(false),
  offlineMarketingRestrictions: z.boolean().default(false),

  // Brand Guidelines
  brandComplianceRequired: z.boolean().default(true),
  logoUsageGuidelines: z.string().optional(),
  messagingGuidelines: z.string().optional(),
  approvedTerminology: z.string().optional(),
  prohibitedClaims: z.string().optional(),

  // Product Information
  productList: z.string().optional(),
  excludedProducts: z.string().optional(),
  seasonalProducts: z.boolean().default(false),
  newProductNotifications: z.boolean().default(true),
  productUpdateNotifications: z.boolean().default(true),

  // Performance Metrics
  salesTargets: z.string().optional(),
  trafficRequirements: z.string().optional(),
  conversionRateExpectations: z.string().optional(),
  minimumActivity: z.string().optional(),
  reportingRequirements: z.boolean().default(true),

  // Reporting and Analytics
  salesReporting: z.boolean().default(true),
  clickReporting: z.boolean().default(true),
  conversionReporting: z.boolean().default(true),
  reportingFrequency: z
    .enum(['real-time', 'daily', 'weekly', 'monthly'])
    .default('real-time'),
  dashboardAccess: z.boolean().default(true),

  // Customer Service
  customerSupportResponsibility: z
    .enum(['merchant', 'affiliate', 'shared'])
    .default('merchant'),
  returnsHandling: z
    .enum(['merchant', 'affiliate', 'shared'])
    .default('merchant'),
  refundsHandling: z
    .enum(['merchant', 'affiliate', 'shared'])
    .default('merchant'),
  chargebacksResponsibility: z
    .enum(['merchant', 'affiliate', 'shared'])
    .default('merchant'),

  // Compliance and Legal
  ftcCompliance: z.boolean().default(true),
  disclosureRequirements: z.boolean().default(true),
  taxCompliance: z.boolean().default(true),
  gdprCompliance: z.boolean().default(false),
  coppaCompliance: z.boolean().default(false),

  // Quality Standards
  trafficQualityStandards: z.string().optional(),
  leadQualityRequirements: z.string().optional(),
  fraudPrevention: z.boolean().default(true),
  qualityMonitoring: z.boolean().default(true),

  // Territory and Markets
  allowedTerritories: z.string().optional(),
  restrictedTerritories: z.string().optional(),
  internationalMarketing: z.boolean().default(false),
  languageRestrictions: z.string().optional(),

  // Exclusivity Terms
  exclusiveArrangement: z.boolean().default(false),
  competitorRestrictions: z.boolean().default(false),
  nonCompeteClause: z.boolean().default(false),
  nonCompetePeriod: z.string().optional(),

  // Merchant Responsibilities
  productAvailability: z.boolean().default(true),
  orderProcessing: z.boolean().default(true),
  shippingHandling: z.boolean().default(true),
  timelyPayments: z.boolean().default(true),
  marketingSupportProvision: z.boolean().default(true),
  technicalSupport: z.boolean().default(false),

  // Program Management
  programManager: z.string().optional(),
  supportContact: z.string().optional(),
  communicationMethod: z
    .enum(['email', 'phone', 'portal', 'slack'])
    .default('email'),
  responseTimeframe: z.string().optional(),
  meetingFrequency: z
    .enum(['weekly', 'monthly', 'quarterly', 'as-needed'])
    .default('as-needed'),

  // Promotion Approval
  promotionApprovalRequired: z.boolean().default(true),
  approvalTimeframe: z.string().optional(),
  promotionRestrictions: z.string().optional(),
  seasonalPromotions: z.boolean().default(true),
  flashSales: z.boolean().default(false),

  // Training and Support
  trainingProvided: z.boolean().default(true),
  onboardingProgram: z.boolean().default(true),
  ongoingSupport: z.boolean().default(true),
  resourceLibrary: z.boolean().default(true),
  webinarsProvided: z.boolean().default(false),

  // Technology Integration
  apiAccess: z.boolean().default(false),
  feedIntegration: z.boolean().default(false),
  webhookSupport: z.boolean().default(false),
  customIntegration: z.boolean().default(false),
  technicalDocumentation: z.boolean().default(true),

  // Multi-Level Marketing
  mlmStructure: z.boolean().default(false),
  recruitmentAllowed: z.boolean().default(false),
  overrideCommissions: z.boolean().default(false),
  teamBuildingIncentives: z.boolean().default(false),

  // Intellectual Property
  trademarkLicense: z.boolean().default(true),
  copyrightLicense: z.boolean().default(true),
  intellectualPropertyOwnership: z
    .enum(['merchant', 'affiliate', 'shared'])
    .default('merchant'),
  derivativeWorks: z.boolean().default(false),

  // Confidentiality
  confidentialityClause: z.boolean().default(true),
  ndaRequired: z.boolean().default(false),
  proprietaryInformation: z.boolean().default(true),
  customerDataProtection: z.boolean().default(true),

  // Term and Termination
  programTerm: z.string().optional(),
  automaticRenewal: z.boolean().default(false),
  terminationNotice: z.string().optional(),
  terminationReasons: z.array(z.string()).default([]),
  postTerminationCommissions: z.boolean().default(true),

  // Liability and Insurance
  liabilityLimitation: z.boolean().default(true),
  liabilityAmount: z.string().optional(),
  indemnificationClause: z.boolean().default(true),
  insuranceRequirements: z.boolean().default(false),

  // Dispute Resolution
  disputeResolution: z
    .enum(['negotiation', 'mediation', 'arbitration', 'litigation'])
    .optional(),
  governingLaw: z.string().optional(),
  jurisdiction: z.string().optional(),
  attorneyFees: z.boolean().default(false),

  // Special Provisions
  forceMajeure: z.boolean().default(true),
  assignmentRights: z.boolean().default(false),
  entireAgreement: z.boolean().default(true),
  modificationRequirements: z
    .enum(['written-only', 'email-acceptable'])
    .default('written-only'),

  // Signature Requirements
  requireMerchantSignature: z.boolean().default(true),
  requireAffiliateSignature: z.boolean().default(true),
  witnessRequired: z.boolean().default(false),
  notarizationRequired: z.boolean().default(false),
  electronicSignatureAccepted: z.boolean().default(true),
});
