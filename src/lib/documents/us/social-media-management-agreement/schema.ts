// src/lib/documents/us/social-media-management-agreement/schema.ts
import { z } from 'zod';

export const SocialMediaManagementAgreementSchema = z.object({
  // Service Provider Information
  providerName: z.string().min(1, 'Service provider name is required'),
  providerBusinessName: z.string().optional(),
  providerAddress: z.string().min(1, 'Provider address is required'),
  providerPhone: z.string().optional(),
  providerEmail: z.string().email().optional(),
  providerWebsite: z.string().optional(),

  // Client Information
  clientName: z.string().min(1, 'Client name is required'),
  clientBusinessName: z.string().optional(),
  clientAddress: z.string().min(1, 'Client address is required'),
  clientPhone: z.string().optional(),
  clientEmail: z.string().email().optional(),
  clientWebsite: z.string().optional(),
  clientIndustry: z.string().optional(),

  // Social Media Platforms
  platforms: z.array(z.string()).default([]),
  existingAccounts: z.boolean().default(true),
  accountSetup: z.boolean().default(false),
  accountOptimization: z.boolean().default(true),
  profileManagement: z.boolean().default(true),

  // Service Scope
  serviceType: z
    .enum(['management-only', 'content-creation', 'full-service', 'consulting'])
    .default('full-service'),
  includedServices: z.array(z.string()).default([]),
  excludedServices: z.array(z.string()).default([]),
  customServices: z.string().optional(),

  // Content Services
  contentCreation: z.boolean().default(true),
  contentStrategy: z.boolean().default(true),
  contentCalendar: z.boolean().default(true),
  originalContent: z.boolean().default(true),
  curatedContent: z.boolean().default(true),
  userGeneratedContent: z.boolean().default(false),

  // Content Types
  textPosts: z.boolean().default(true),
  imageContent: z.boolean().default(true),
  videoContent: z.boolean().default(false),
  stories: z.boolean().default(true),
  reels: z.boolean().default(false),
  liveStreams: z.boolean().default(false),

  // Posting Schedule
  postsPerWeek: z.string().optional(),
  postsPerMonth: z.string().optional(),
  postingFrequency: z
    .enum(['daily', 'multiple-daily', 'weekly', 'custom'])
    .default('daily'),
  schedulingTool: z.string().optional(),
  optimalTiming: z.boolean().default(true),

  // Engagement Services
  communityManagement: z.boolean().default(true),
  responseManagement: z.boolean().default(true),
  commentModeration: z.boolean().default(true),
  directMessageResponse: z.boolean().default(true),
  engagementStrategy: z.boolean().default(true),
  influencerOutreach: z.boolean().default(false),

  // Analytics and Reporting
  performanceTracking: z.boolean().default(true),
  monthlyReports: z.boolean().default(true),
  analyticsTools: z.string().optional(),
  kpiTracking: z.array(z.string()).default([]),
  competitorAnalysis: z.boolean().default(false),
  reportingFrequency: z
    .enum(['weekly', 'monthly', 'quarterly'])
    .default('monthly'),

  // Advertising Services
  paidAdvertising: z.boolean().default(false),
  adCampaignManagement: z.boolean().default(false),
  adCreativeDesign: z.boolean().default(false),
  budgetManagement: z.boolean().default(false),
  adSpendLimit: z.string().optional(),
  roiTracking: z.boolean().default(false),

  // Brand Guidelines
  brandGuidelinesProvided: z.boolean().default(false),
  brandVoice: z.string().optional(),
  visualIdentity: z.string().optional(),
  contentApprovalRequired: z.boolean().default(true),
  brandCompliance: z.boolean().default(true),

  // Content Approval Process
  approvalProcess: z
    .enum(['pre-approval', 'post-approval', 'no-approval'])
    .default('pre-approval'),
  approvalTimeframe: z.string().optional(),
  revisionRounds: z.string().optional(),
  emergencyPostingRights: z.boolean().default(false),

  // Client Responsibilities
  contentProvision: z.boolean().default(false),
  timelyApprovals: z.boolean().default(true),
  brandMaterials: z.boolean().default(true),
  productInformation: z.boolean().default(true),
  eventInformation: z.boolean().default(true),
  accessProvision: z.boolean().default(true),

  // Provider Responsibilities
  contentQuality: z.boolean().default(true),
  brandAlignment: z.boolean().default(true),
  timeliness: z.boolean().default(true),
  professionalStandards: z.boolean().default(true),
  platformCompliance: z.boolean().default(true),
  confidentialityMaintenance: z.boolean().default(true),

  // Fee Structure
  pricingModel: z
    .enum(['monthly-retainer', 'hourly', 'per-post', 'performance-based'])
    .default('monthly-retainer'),
  monthlyRetainer: z.string().optional(),
  hourlyRate: z.string().optional(),
  perPostRate: z.string().optional(),
  setupFee: z.string().optional(),
  additionalServiceFees: z.boolean().default(false),

  // Payment Terms
  paymentSchedule: z
    .enum(['monthly', 'quarterly', 'advance'])
    .default('monthly'),
  paymentDueDate: z.string().optional(),
  latePaymentFees: z.boolean().default(false),
  expenseReimbursement: z.boolean().default(false),
  cancellationFees: z.boolean().default(false),

  // Campaign Management
  campaignStrategy: z.boolean().default(true),
  campaignPlanning: z.boolean().default(true),
  campaignExecution: z.boolean().default(true),
  campaignOptimization: z.boolean().default(true),
  seasonalCampaigns: z.boolean().default(false),
  eventPromotions: z.boolean().default(false),

  // Crisis Management
  crisisResponse: z.boolean().default(false),
  reputationManagement: z.boolean().default(false),
  negativeCommentHandling: z.boolean().default(true),
  escalationProcedures: z.string().optional(),
  publicRelationsSupport: z.boolean().default(false),

  // Compliance and Legal
  platformPolicyCompliance: z.boolean().default(true),
  copyrightCompliance: z.boolean().default(true),
  ftcDisclosureCompliance: z.boolean().default(true),
  privacyPolicyCompliance: z.boolean().default(true),
  industryRegulations: z.string().optional(),

  // Intellectual Property
  contentOwnership: z.enum(['client', 'provider', 'shared']).default('client'),
  licensingTerms: z.string().optional(),
  portfolioRights: z.boolean().default(true),
  attributionRequirements: z.boolean().default(false),
  originalityGuarantee: z.boolean().default(true),

  // Account Access
  accountLoginProvision: z.boolean().default(true),
  adminAccess: z.boolean().default(true),
  businessManagerAccess: z.boolean().default(false),
  passwordSecurity: z.boolean().default(true),
  accessRevocation: z.boolean().default(true),

  // Performance Metrics
  followerGrowthGoals: z.string().optional(),
  engagementGoals: z.string().optional(),
  reachGoals: z.string().optional(),
  conversionGoals: z.string().optional(),
  performanceGuarantees: z.boolean().default(false),

  // Content Calendar
  calendarCreation: z.boolean().default(true),
  calendarSharing: z.boolean().default(true),
  advancePlanning: z.string().optional(),
  holidayPlanning: z.boolean().default(true),
  eventPlanning: z.boolean().default(true),

  // Training and Education
  teamTraining: z.boolean().default(false),
  bestPracticesSharing: z.boolean().default(false),
  platformUpdates: z.boolean().default(true),
  strategyConsultation: z.boolean().default(false),
  knowledgeTransfer: z.boolean().default(false),

  // Technology and Tools
  managementTools: z.string().optional(),
  analyticsTools: z.string().optional(),
  designTools: z.string().optional(),
  toolsProvided: z.boolean().default(true),
  toolsAccess: z.boolean().default(false),

  // Communication
  primaryContact: z.string().optional(),
  communicationMethod: z
    .enum(['email', 'phone', 'slack', 'project-management'])
    .default('email'),
  responseTimeframe: z.string().optional(),
  meetingFrequency: z
    .enum(['weekly', 'bi-weekly', 'monthly', 'quarterly'])
    .default('monthly'),
  emergencyContact: z.boolean().default(false),

  // Quality Assurance
  contentReview: z.boolean().default(true),
  proofreadingServices: z.boolean().default(true),
  factChecking: z.boolean().default(true),
  brandConsistency: z.boolean().default(true),
  qualityStandards: z.string().optional(),

  // Competitive Analysis
  competitorMonitoring: z.boolean().default(false),
  marketResearch: z.boolean().default(false),
  trendAnalysis: z.boolean().default(false),
  benchmarking: z.boolean().default(false),
  industryInsights: z.boolean().default(false),

  // Growth Strategies
  followerGrowthStrategy: z.boolean().default(true),
  organicGrowth: z.boolean().default(true),
  hashtagStrategy: z.boolean().default(true),
  crossPromotion: z.boolean().default(false),
  collaborationOpportunities: z.boolean().default(false),

  // Content Library
  assetLibrary: z.boolean().default(false),
  stockPhotoAccess: z.boolean().default(false),
  brandAssets: z.boolean().default(true),
  contentArchive: z.boolean().default(true),
  repurposingRights: z.boolean().default(true),

  // Confidentiality
  confidentialityClause: z.boolean().default(true),
  ndaRequired: z.boolean().default(false),
  proprietaryInformation: z.boolean().default(true),
  clientDataProtection: z.boolean().default(true),
  confidentialityDuration: z.string().optional(),

  // Term and Termination
  contractTerm: z.string().optional(),
  automaticRenewal: z.boolean().default(false),
  terminationNotice: z.string().optional(),
  terminationReasons: z.array(z.string()).default([]),
  postTerminationServices: z.string().optional(),
  accountTransfer: z.boolean().default(true),

  // Liability and Insurance
  liabilityLimitation: z.boolean().default(true),
  liabilityAmount: z.string().optional(),
  professionalInsurance: z.boolean().default(false),
  clientIndemnification: z.boolean().default(false),
  providerIndemnification: z.boolean().default(false),

  // Dispute Resolution
  disputeResolution: z
    .enum(['negotiation', 'mediation', 'arbitration', 'litigation'])
    .optional(),
  governingLaw: z.string().optional(),
  jurisdiction: z.string().optional(),
  attorneyFees: z.boolean().default(false),

  // Contract Terms
  entireAgreement: z.boolean().default(true),
  modificationRequirements: z
    .enum(['written-only', 'email-acceptable'])
    .default('written-only'),
  severabilityClause: z.boolean().default(true),
  assignmentRights: z.boolean().default(false),
  bindingEffect: z.boolean().default(true),

  // Signature Requirements
  requireProviderSignature: z.boolean().default(true),
  requireClientSignature: z.boolean().default(true),
  witnessRequired: z.boolean().default(false),
  notarizationRequired: z.boolean().default(false),
  electronicSignatureAccepted: z.boolean().default(true),
});
