// src/lib/documents/us/brand-ambassador-agreement/schema.ts
import { z } from 'zod';

export const BrandAmbassadorAgreementSchema = z.object({
  // Brand Information
  brandName: z.string().min(1, 'Brand name is required'),
  brandCompanyName: z.string().optional(),
  brandAddress: z.string().min(1, 'Brand address is required'),
  brandPhone: z.string().optional(),
  brandEmail: z.string().email().optional(),
  brandWebsite: z.string().optional(),
  brandIndustry: z.string().optional(),

  // Ambassador Information
  ambassadorName: z.string().min(1, 'Ambassador name is required'),
  ambassadorBusinessName: z.string().optional(),
  ambassadorAddress: z.string().min(1, 'Ambassador address is required'),
  ambassadorPhone: z.string().optional(),
  ambassadorEmail: z.string().email().optional(),
  ambassadorWebsite: z.string().optional(),
  socialMediaHandles: z.string().optional(),

  // Ambassador Program Details
  programName: z.string().min(1, 'Program name is required'),
  programDescription: z.string().min(1, 'Program description is required'),
  ambassadorLevel: z
    .enum(['bronze', 'silver', 'gold', 'platinum', 'custom'])
    .default('bronze'),
  programDuration: z.string().optional(),
  renewalTerms: z.string().optional(),

  // Responsibilities and Duties
  brandRepresentation: z.boolean().default(true),
  eventAttendance: z.boolean().default(false),
  socialMediaPosting: z.boolean().default(true),
  contentCreation: z.boolean().default(true),
  productTesting: z.boolean().default(true),
  feedbackProvision: z.boolean().default(true),
  customerEngagement: z.boolean().default(true),
  marketResearch: z.boolean().default(false),

  // Content Requirements
  postsPerMonth: z.string().optional(),
  storiesPerMonth: z.string().optional(),
  videosPerMonth: z.string().optional(),
  blogsPerMonth: z.string().optional(),
  contentQualityStandards: z.string().optional(),
  contentApprovalRequired: z.boolean().default(true),

  // Social Media Platforms
  platforms: z.array(z.string()).default([]),
  primaryPlatform: z.string().optional(),
  followerRequirements: z.string().optional(),
  engagementRateRequirements: z.string().optional(),
  audienceDemographics: z.string().optional(),

  // Compensation Structure
  compensationType: z
    .enum(['monthly-stipend', 'product-only', 'commission', 'tiered', 'hybrid'])
    .default('product-only'),
  monthlyStipend: z.string().optional(),
  commissionRate: z.string().optional(),
  performanceBonuses: z.boolean().default(false),
  bonusStructure: z.string().optional(),

  // Product Benefits
  freeProducts: z.boolean().default(true),
  productAllowance: z.string().optional(),
  earlyAccess: z.boolean().default(true),
  exclusiveProducts: z.boolean().default(false),
  discountPercentage: z.string().optional(),
  giftingAllowed: z.boolean().default(true),

  // Additional Benefits
  eventInvitations: z.boolean().default(false),
  networkingOpportunities: z.boolean().default(false),
  trainingProvided: z.boolean().default(false),
  mentorshipProgram: z.boolean().default(false),
  careerDevelopment: z.boolean().default(false),
  travelOpportunities: z.boolean().default(false),

  // Performance Metrics
  engagementTargets: z.string().optional(),
  reachTargets: z.string().optional(),
  conversionTargets: z.string().optional(),
  brandMentionTargets: z.string().optional(),
  performanceReviews: z.boolean().default(true),
  reviewFrequency: z
    .enum(['monthly', 'quarterly', 'bi-annually'])
    .default('quarterly'),

  // Brand Guidelines
  brandGuidelinesCompliance: z.boolean().default(true),
  visualGuidelines: z.string().optional(),
  messagingGuidelines: z.string().optional(),
  toneBrandVoice: z.string().optional(),
  approvedHashtags: z.string().optional(),
  prohibitedContent: z.string().optional(),

  // FTC Compliance
  disclosureRequirements: z.boolean().default(true),
  sponsorshipDisclosure: z.boolean().default(true),
  materialConnectionDisclosure: z.boolean().default(true),
  ftcGuidelines: z.boolean().default(true),
  hashtagDisclosures: z.string().optional(),

  // Exclusivity Terms
  exclusivityRequired: z.boolean().default(false),
  exclusivityScope: z.enum(['full', 'category', 'competitor-only']).optional(),
  exclusivityPeriod: z.string().optional(),
  competitorRestrictions: z.boolean().default(true),
  conflictingBrands: z.string().optional(),

  // Event Participation
  eventAttendanceRequired: z.boolean().default(false),
  eventTypes: z.array(z.string()).default([]),
  travelExpensesCovered: z.boolean().default(false),
  accommodationProvided: z.boolean().default(false),
  eventCompensation: z.boolean().default(false),
  virtualEventParticipation: z.boolean().default(true),

  // Content Approval Process
  preApprovalRequired: z.boolean().default(true),
  approvalTimeframe: z.string().optional(),
  revisionRounds: z.string().optional(),
  emergencyPostingRights: z.boolean().default(false),
  contentCalendarRequired: z.boolean().default(true),

  // Intellectual Property
  contentOwnership: z
    .enum(['ambassador', 'brand', 'shared'])
    .default('ambassador'),
  usageRights: z.string().optional(),
  licenseDuration: z.string().optional(),
  commercialUsage: z.boolean().default(false),
  portfolioRights: z.boolean().default(true),
  attributionRequirements: z.boolean().default(true),

  // Communication
  primaryContact: z.string().optional(),
  communicationMethod: z
    .enum(['email', 'phone', 'slack', 'app'])
    .default('email'),
  responseTimeframe: z.string().optional(),
  meetingFrequency: z
    .enum(['weekly', 'monthly', 'quarterly'])
    .default('monthly'),
  feedbackSessions: z.boolean().default(true),

  // Training and Support
  onboardingProgram: z.boolean().default(true),
  ongoingTraining: z.boolean().default(false),
  brandEducation: z.boolean().default(true),
  socialMediaBestPractices: z.boolean().default(true),
  resourceLibrary: z.boolean().default(true),
  mentorAssignment: z.boolean().default(false),

  // Reporting Requirements
  monthlyReports: z.boolean().default(true),
  analyticsSharing: z.boolean().default(true),
  campaignReporting: z.boolean().default(true),
  feedbackReporting: z.boolean().default(true),
  competitorIntelligence: z.boolean().default(false),
  marketInsights: z.boolean().default(false),

  // Quality Standards
  professionalismRequired: z.boolean().default(true),
  authenticityRequired: z.boolean().default(true),
  originalContentRequired: z.boolean().default(true),
  qualityStandards: z.string().optional(),
  brandAlignment: z.boolean().default(true),

  // Termination Conditions
  terminationReasons: z.array(z.string()).default([]),
  terminationNotice: z.string().optional(),
  immediateTermination: z.boolean().default(true),
  postTerminationObligations: z.string().optional(),
  finalCompensation: z.boolean().default(true),

  // Confidentiality
  confidentialityClause: z.boolean().default(true),
  ndaRequired: z.boolean().default(false),
  proprietaryInformation: z.boolean().default(true),
  customerDataProtection: z.boolean().default(true),
  confidentialityDuration: z.string().optional(),

  // Special Provisions
  forceMarjeure: z.boolean().default(true),
  assignmentRights: z.boolean().default(false),
  modification: z.boolean().default(true),
  entireAgreement: z.boolean().default(true),
  severability: z.boolean().default(true),

  // Legal Terms
  disputeResolution: z
    .enum(['negotiation', 'mediation', 'arbitration', 'litigation'])
    .optional(),
  governingLaw: z.string().optional(),
  jurisdiction: z.string().optional(),
  attorneyFees: z.boolean().default(false),

  // Signature Requirements
  requireBrandSignature: z.boolean().default(true),
  requireAmbassadorSignature: z.boolean().default(true),
  witnessRequired: z.boolean().default(false),
  notarizationRequired: z.boolean().default(false),
  electronicSignatureAccepted: z.boolean().default(true),
});
