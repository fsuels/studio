// src/lib/documents/us/website-development-agreement/schema.ts
import { z } from 'zod';

export const WebsiteDevelopmentAgreementSchema = z.object({
  // Developer Information
  developerName: z.string().min(1, 'Developer name is required'),
  developerBusinessName: z.string().optional(),
  developerAddress: z.string().min(1, 'Developer address is required'),
  developerPhone: z.string().optional(),
  developerEmail: z.string().email().optional(),
  developerWebsite: z.string().optional(),

  // Client Information
  clientName: z.string().min(1, 'Client name is required'),
  clientBusinessName: z.string().optional(),
  clientAddress: z.string().min(1, 'Client address is required'),
  clientPhone: z.string().optional(),
  clientEmail: z.string().email().optional(),
  clientWebsite: z.string().optional(),

  // Project Details
  projectName: z.string().min(1, 'Project name is required'),
  websitePurpose: z.string().min(1, 'Website purpose is required'),
  targetAudience: z.string().optional(),
  projectDescription: z.string().min(1, 'Project description is required'),
  websiteType: z
    .enum([
      'informational',
      'e-commerce',
      'portfolio',
      'blog',
      'application',
      'other',
    ])
    .default('informational'),

  // Scope of Work
  serviceType: z
    .enum(['design-only', 'development-only', 'full-service', 'maintenance'])
    .default('full-service'),
  includedServices: z.array(z.string()).default([]),
  excludedServices: z.array(z.string()).default([]),
  numberOfPages: z.string().optional(),
  customFunctionality: z.string().optional(),
  thirdPartyIntegrations: z.string().optional(),

  // Design Services
  websiteDesign: z.boolean().default(true),
  uiUxDesign: z.boolean().default(true),
  responsiveDesign: z.boolean().default(true),
  mobileOptimization: z.boolean().default(true),
  logoDesign: z.boolean().default(false),
  brandingServices: z.boolean().default(false),
  customGraphics: z.boolean().default(false),

  // Development Services
  frontEndDevelopment: z.boolean().default(true),
  backEndDevelopment: z.boolean().default(false),
  databaseDesign: z.boolean().default(false),
  cmsIntegration: z.boolean().default(false),
  eCommerceIntegration: z.boolean().default(false),
  apiIntegration: z.boolean().default(false),
  customProgramming: z.boolean().default(false),

  // Technical Specifications
  programmingLanguages: z.string().optional(),
  frameworks: z.string().optional(),
  contentManagementSystem: z.string().optional(),
  hostingRequirements: z.string().optional(),
  browserCompatibility: z.string().optional(),
  performanceRequirements: z.string().optional(),

  // Timeline and Milestones
  projectStartDate: z.string().optional(),
  projectEndDate: z.string().optional(),
  totalProjectDuration: z.string().optional(),
  milestones: z.array(z.string()).default([]),
  deliverySchedule: z.string().optional(),
  launchDate: z.string().optional(),

  // Client Responsibilities
  contentProvision: z.boolean().default(true),
  timelyApprovals: z.boolean().default(true),
  feedbackProvision: z.boolean().default(true),
  assetProvision: z.boolean().default(true),
  testingParticipation: z.boolean().default(true),
  hostingArrangement: z.boolean().default(false),

  // Developer Responsibilities
  designCreation: z.boolean().default(true),
  developmentWork: z.boolean().default(true),
  qualityAssurance: z.boolean().default(true),
  browserTesting: z.boolean().default(true),
  performanceOptimization: z.boolean().default(true),
  securityImplementation: z.boolean().default(true),

  // Content and Materials
  clientProvidedContent: z.boolean().default(true),
  contentCreationServices: z.boolean().default(false),
  stockPhotos: z.boolean().default(false),
  customPhotography: z.boolean().default(false),
  copywriting: z.boolean().default(false),
  seoContent: z.boolean().default(false),

  // Fee Structure
  pricingModel: z
    .enum(['fixed-price', 'hourly', 'milestone-based', 'retainer'])
    .default('fixed-price'),
  totalProjectCost: z.string().optional(),
  hourlyRate: z.string().optional(),
  depositAmount: z.string().optional(),
  paymentSchedule: z
    .enum(['upfront', 'milestone-based', 'net-30', 'split-payments'])
    .default('milestone-based'),

  // Payment Terms
  depositRequired: z.boolean().default(true),
  depositPercentage: z.string().optional(),
  finalPaymentDue: z
    .enum(['upon-completion', 'upon-launch', 'net-30'])
    .default('upon-completion'),
  latePaymentFees: z.boolean().default(false),
  expenseReimbursement: z.boolean().default(false),
  taxesIncluded: z.boolean().default(false),

  // Revisions and Changes
  includedRevisions: z.string().optional(),
  additionalRevisionCost: z.string().optional(),
  majorChangeProcess: z.string().optional(),
  changeOrderRequirement: z.boolean().default(true),
  scopeChangeApproval: z.boolean().default(true),

  // Testing and Quality Assurance
  userAcceptanceTesting: z.boolean().default(true),
  performanceTesting: z.boolean().default(true),
  securityTesting: z.boolean().default(true),
  crossBrowserTesting: z.boolean().default(true),
  mobileTesting: z.boolean().default(true),
  testingPeriod: z.string().optional(),

  // Launch and Deployment
  hostingSetup: z.boolean().default(false),
  domainSetup: z.boolean().default(false),
  sslCertificate: z.boolean().default(false),
  dnsConfiguration: z.boolean().default(false),
  goLiveSupport: z.boolean().default(true),
  postLaunchTesting: z.boolean().default(true),

  // Training and Documentation
  clientTraining: z.boolean().default(false),
  userManual: z.boolean().default(false),
  technicalDocumentation: z.boolean().default(false),
  videoTutorials: z.boolean().default(false),
  knowledgeTransfer: z.boolean().default(false),

  // Maintenance and Support
  warrantyPeriod: z.string().optional(),
  bugFixWarranty: z.boolean().default(true),
  ongoingMaintenance: z.boolean().default(false),
  supportHours: z.string().optional(),
  emergencySupport: z.boolean().default(false),
  updateServices: z.boolean().default(false),

  // Intellectual Property
  workForHire: z.boolean().default(true),
  copyrightOwnership: z
    .enum(['client', 'developer', 'shared'])
    .default('client'),
  licensingTerms: z.string().optional(),
  thirdPartyLicenses: z.string().optional(),
  portfolioRights: z.boolean().default(true),
  creditRequirement: z.boolean().default(false),

  // Confidentiality
  confidentialityClause: z.boolean().default(true),
  ndaRequired: z.boolean().default(false),
  proprietaryInformation: z.boolean().default(true),
  clientDataProtection: z.boolean().default(true),
  confidentialityDuration: z.string().optional(),

  // SEO and Marketing
  basicSEO: z.boolean().default(false),
  googleAnalytics: z.boolean().default(false),
  socialMediaIntegration: z.boolean().default(false),
  emailMarketing: z.boolean().default(false),
  searchEngineSubmission: z.boolean().default(false),
  metaTagOptimization: z.boolean().default(false),

  // Security Features
  securityMeasures: z.string().optional(),
  dataEncryption: z.boolean().default(false),
  userAuthentication: z.boolean().default(false),
  securityUpdates: z.boolean().default(false),
  backupSolutions: z.boolean().default(false),

  // Compliance Requirements
  accessibilityCompliance: z.boolean().default(false),
  gdprCompliance: z.boolean().default(false),
  hipaaCompliance: z.boolean().default(false),
  industryStandards: z.string().optional(),
  legalCompliance: z.boolean().default(true),

  // Performance Requirements
  pageLoadSpeed: z.string().optional(),
  uptimeRequirements: z.string().optional(),
  scalabilityRequirements: z.string().optional(),
  bandwidthRequirements: z.string().optional(),
  concurrentUsers: z.string().optional(),

  // Third Party Services
  thirdPartyTools: z.string().optional(),
  paymentProcessing: z.boolean().default(false),
  shippingIntegration: z.boolean().default(false),
  crmIntegration: z.boolean().default(false),
  marketingTools: z.boolean().default(false),

  // Quality Standards
  codeQuality: z.boolean().default(true),
  industryBestPractices: z.boolean().default(true),
  webStandards: z.boolean().default(true),
  cleanCode: z.boolean().default(true),
  documentation: z.boolean().default(false),

  // Risk Management
  backupProcedures: z.boolean().default(true),
  versionControl: z.boolean().default(true),
  testingEnvironment: z.boolean().default(true),
  rollbackProcedures: z.boolean().default(false),
  disasterRecovery: z.boolean().default(false),

  // Communication
  projectManager: z.string().optional(),
  communicationMethod: z
    .enum(['email', 'phone', 'video-calls', 'project-management-tool'])
    .default('email'),
  meetingSchedule: z.string().optional(),
  progressReporting: z
    .enum(['weekly', 'bi-weekly', 'monthly', 'milestone-based'])
    .default('weekly'),
  clientContactPerson: z.string().optional(),

  // Termination Clauses
  terminationRights: z.boolean().default(true),
  terminationNotice: z.string().optional(),
  workCompletedPayment: z.boolean().default(true),
  fileTransfer: z.boolean().default(true),
  killFee: z.string().optional(),
  earlyTerminationFee: z.string().optional(),

  // Legal and Liability
  liabilityLimitation: z.boolean().default(true),
  liabilityAmount: z.string().optional(),
  warrantiesDisclaimer: z.boolean().default(true),
  indemnificationClause: z.boolean().default(false),
  forceMajeure: z.boolean().default(true),

  // Dispute Resolution
  disputeResolution: z
    .enum(['negotiation', 'mediation', 'arbitration', 'litigation'])
    .optional(),
  governingLaw: z.string().optional(),
  jurisdiction: z.string().optional(),
  attorneyFees: z.boolean().default(false),

  // Contract Terms
  contractDuration: z.string().optional(),
  renewalTerms: z.string().optional(),
  modificationRequirements: z
    .enum(['written-only', 'email-acceptable', 'verbal-acceptable'])
    .default('written-only'),
  entireAgreement: z.boolean().default(true),
  severabilityClause: z.boolean().default(true),

  // Signature Requirements
  requireDeveloperSignature: z.boolean().default(true),
  requireClientSignature: z.boolean().default(true),
  witnessRequired: z.boolean().default(false),
  notarizationRequired: z.boolean().default(false),
  electronicSignatureAccepted: z.boolean().default(true),
});
