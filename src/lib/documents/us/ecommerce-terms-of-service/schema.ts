// src/lib/documents/us/ecommerce-terms-of-service/schema.ts
import { z } from 'zod';

export const EcommerceTermsOfServiceSchema = z.object({
  // Business Information
  businessName: z.string().min(1, 'Business name is required'),
  businessAddress: z.string().optional(),
  businessPhone: z.string().optional(),
  businessEmail: z.string().email().optional(),
  websiteURL: z.string().optional(),
  businessType: z.enum(['corporation', 'llc', 'partnership', 'sole-proprietorship']).optional(),
  
  // Service Description
  serviceDescription: z.string().optional(),
  productCategories: z.string().optional(),
  targetMarket: z.enum(['b2b', 'b2c', 'both']).default('b2c'),
  geographicScope: z.enum(['local', 'national', 'international']).default('national'),
  
  // User Accounts
  accountRequired: z.boolean().default(false),
  accountCreation: z.boolean().default(true),
  userEligibility: z.string().optional(),
  accountSecurity: z.boolean().default(true),
  accountTermination: z.boolean().default(true),
  
  // Order and Payment Terms
  orderProcess: z.string().optional(),
  paymentMethods: z.string().optional(),
  pricingPolicy: z.string().optional(),
  taxCalculation: z.boolean().default(true),
  shippingPolicies: z.string().optional(),
  
  // Product Information
  productDescriptions: z.boolean().default(true),
  productAvailability: z.string().optional(),
  backorderPolicy: z.string().optional(),
  discontinuedProducts: z.string().optional(),
  productChanges: z.boolean().default(true),
  
  // Pricing and Fees
  pricingAccuracy: z.boolean().default(true),
  priceChanges: z.boolean().default(true),
  shippingCosts: z.string().optional(),
  handlingFees: z.string().optional(),
  additionalCharges: z.string().optional(),
  
  // Shipping and Delivery
  shippingMethods: z.string().optional(),
  deliveryTimeframes: z.string().optional(),
  shippingRestrictions: z.string().optional(),
  internationalShipping: z.boolean().default(false),
  deliveryConfirmation: z.boolean().default(true),
  
  // Returns and Refunds
  returnPolicy: z.string().optional(),
  returnTimeframe: z.string().optional(),
  refundPolicy: z.string().optional(),
  exchangePolicy: z.string().optional(),
  restockingFees: z.boolean().default(false),
  
  // Intellectual Property
  copyrightNotice: z.boolean().default(true),
  trademarkNotice: z.boolean().default(true),
  userContent: z.string().optional(),
  contentOwnership: z.boolean().default(true),
  dmcaCompliance: z.boolean().default(true),
  
  // User Conduct
  prohibitedUses: z.string().optional(),
  userResponsibilities: z.string().optional(),
  contentGuidelines: z.string().optional(),
  behaviorStandards: z.string().optional(),
  enforcement: z.string().optional(),
  
  // Privacy and Data
  privacyPolicy: z.boolean().default(true),
  dataCollection: z.boolean().default(true),
  cookiePolicy: z.boolean().default(true),
  thirdPartySharing: z.boolean().default(false),
  dataRetention: z.string().optional(),
  
  // Website Usage
  accessRights: z.string().optional(),
  technicalRequirements: z.string().optional(),
  siteAvailability: z.string().optional(),
  maintenanceNotice: z.boolean().default(true),
  serviceInterruptions: z.string().optional(),
  
  // Warranties and Disclaimers
  productWarranties: z.string().optional(),
  serviceWarranties: z.string().optional(),
  disclaimers: z.boolean().default(true),
  noWarranty: z.boolean().default(false),
  merchantability: z.boolean().default(false),
  
  // Limitation of Liability
  liabilityLimitations: z.boolean().default(true),
  damageExclusions: z.string().optional(),
  indemnification: z.boolean().default(true),
  forceMAjeure: z.boolean().default(true),
  
  // Third Party Services
  paymentProcessors: z.string().optional(),
  shippingPartners: z.string().optional(),
  analyticsServices: z.string().optional(),
  socialMediaIntegration: z.boolean().default(false),
  
  // Security Measures
  dataEncryption: z.boolean().default(true),
  securePayments: z.boolean().default(true),
  fraudPrevention: z.boolean().default(true),
  securityBreaches: z.string().optional(),
  
  // Age Restrictions
  ageRequirements: z.string().optional(),
  minorRestrictions: z.boolean().default(true),
  parentalConsent: z.boolean().default(false),
  ageVerification: z.boolean().default(false),
  
  // International Terms
  internationalUsers: z.boolean().default(false),
  currencyOptions: z.string().optional(),
  exportRestrictions: z.string().optional(),
  customsDuties: z.string().optional(),
  
  // Marketing Communications
  emailMarketing: z.boolean().default(false),
  optOutRights: z.boolean().default(true),
  communicationPreferences: z.boolean().default(true),
  thirdPartyMarketing: z.boolean().default(false),
  
  // Dispute Resolution
  disputeResolution: z.enum(['mediation', 'arbitration', 'court']).default('court'),
  governingLaw: z.string().optional(),
  jurisdiction: z.string().optional(),
  classActionWaiver: z.boolean().default(false),
  
  // Termination
  serviceTermination: z.boolean().default(true),
  accountSuspension: z.boolean().default(true),
  terminationNotice: z.string().optional(),
  dataRemoval: z.boolean().default(true),
  
  // Modifications
  termsModification: z.boolean().default(true),
  notificationMethod: z.enum(['email', 'website', 'both']).default('website'),
  effectiveDate: z.string().optional(),
  continuedUse: z.boolean().default(true),
  
  // Contact Information
  customerService: z.string().optional(),
  supportHours: z.string().optional(),
  legalNotices: z.string().optional(),
  complianceContact: z.string().optional(),
  
  // Special Features
  subscriptionServices: z.boolean().default(false),
  digitalProducts: z.boolean().default(false),
  giftCards: z.boolean().default(false),
  loyaltyPrograms: z.boolean().default(false),
  affiliatePrograms: z.boolean().default(false),
  
  // Compliance Requirements
  adaCompliance: z.boolean().default(true),
  gdprCompliance: z.boolean().default(false),
  ccpaCompliance: z.boolean().default(false),
  coppaCompliance: z.boolean().default(false),
  
  // Mobile Applications
  mobileApp: z.boolean().default(false),
  appStoreTerms: z.boolean().default(false),
  mobileSpecificTerms: z.string().optional(),
  pushNotifications: z.boolean().default(false),
  
  // API and Integration
  apiAccess: z.boolean().default(false),
  apiTerms: z.string().optional(),
  thirdPartyIntegrations: z.string().optional(),
  webhookServices: z.boolean().default(false),
  
  // Legal Acceptance
  termsAcceptance: z.boolean().default(true),
  clickwrapAgreement: z.boolean().default(true),
  browsewrapAgreement: z.boolean().default(false),
  electronicSignature: z.boolean().default(true),
});