// src/lib/documents/us/influencer-agreement/schema.ts
import { z } from 'zod';

export const InfluencerAgreementSchema = z.object({
  // Brand Information
  brandName: z.string().min(1, 'Brand name is required'),
  brandCompanyName: z.string().optional(),
  brandAddress: z.string().min(1, 'Brand address is required'),
  brandPhone: z.string().optional(),
  brandEmail: z.string().email().optional(),
  brandWebsite: z.string().optional(),
  brandIndustry: z.string().optional(),

  // Influencer Information
  influencerName: z.string().min(1, 'Influencer name is required'),
  influencerBusinessName: z.string().optional(),
  influencerAddress: z.string().min(1, 'Influencer address is required'),
  influencerPhone: z.string().optional(),
  influencerEmail: z.string().email().optional(),
  influencerWebsite: z.string().optional(),
  socialMediaHandle: z.string().optional(),

  // Campaign Details
  campaignName: z.string().min(1, 'Campaign name is required'),
  campaignDescription: z.string().min(1, 'Campaign description is required'),
  campaignObjectives: z.string().optional(),
  targetAudience: z.string().optional(),
  campaignHashtags: z.string().optional(),
  brandMentions: z.string().optional(),

  // Social Media Platforms
  platforms: z.array(z.string()).default([]),
  primaryPlatform: z.string().optional(),
  followerCount: z.string().optional(),
  engagementRate: z.string().optional(),
  audienceDemographics: z.string().optional(),

  // Content Requirements
  contentType: z.array(z.string()).default([]),
  numberOfPosts: z.string().optional(),
  postingSchedule: z.string().optional(),
  contentDeadlines: z.string().optional(),
  contentApprovalRequired: z.boolean().default(true),
  revisionRounds: z.string().optional(),

  // Content Specifications
  imageRequirements: z.string().optional(),
  videoRequirements: z.string().optional(),
  captionRequirements: z.string().optional(),
  hashtagRequirements: z.string().optional(),
  brandGuidelinesCompliance: z.boolean().default(true),
  contentQualityStandards: z.string().optional(),

  // Deliverables
  instagramPosts: z.string().optional(),
  instagramStories: z.string().optional(),
  instagramReels: z.string().optional(),
  tiktokVideos: z.string().optional(),
  youtubeVideos: z.string().optional(),
  blogPosts: z.string().optional(),

  // Compensation Structure
  compensationType: z
    .enum(['flat-fee', 'per-post', 'commission', 'product-only', 'hybrid'])
    .default('flat-fee'),
  totalCompensation: z.string().optional(),
  perPostRate: z.string().optional(),
  commissionPercentage: z.string().optional(),
  bonusStructure: z.string().optional(),
  performanceIncentives: z.boolean().default(false),

  // Payment Terms
  paymentSchedule: z
    .enum(['upfront', 'upon-completion', 'milestone-based', 'net-30'])
    .default('upon-completion'),
  paymentMethod: z
    .enum(['bank-transfer', 'paypal', 'check', 'venmo', 'other'])
    .default('bank-transfer'),
  paymentDeadline: z.string().optional(),
  latePaymentFees: z.boolean().default(false),
  expenseReimbursement: z.boolean().default(false),

  // Product Collaboration
  productProvided: z.boolean().default(false),
  productValue: z.string().optional(),
  productReturnRequired: z.boolean().default(false),
  additionalProducts: z.boolean().default(false),
  productLimitations: z.string().optional(),
  giftDisclosureRequired: z.boolean().default(true),

  // Usage Rights
  contentOwnership: z
    .enum(['influencer', 'brand', 'shared'])
    .default('influencer'),
  usageRights: z.string().optional(),
  licenseDuration: z.string().optional(),
  repurposingRights: z.boolean().default(false),
  commercialUsage: z.boolean().default(false),
  exclusiveRights: z.boolean().default(false),

  // Brand Guidelines
  brandVoice: z.string().optional(),
  visualGuidelines: z.string().optional(),
  messagingGuidelines: z.string().optional(),
  doNotMentionList: z.string().optional(),
  competitorRestrictions: z.boolean().default(true),
  approvedTerminology: z.string().optional(),

  // FTC Compliance
  disclosureRequirements: z.boolean().default(true),
  sponsoredContentLabeling: z.boolean().default(true),
  ftcGuidelines: z.boolean().default(true),
  materialConnectionDisclosure: z.boolean().default(true),
  paidPartnershipLabels: z.boolean().default(true),

  // Exclusivity Terms
  exclusivityPeriod: z.string().optional(),
  exclusivityScope: z
    .enum(['no-exclusivity', 'category-exclusive', 'full-exclusive'])
    .default('no-exclusivity'),
  competitorNonCompete: z.boolean().default(false),
  nonCompetePeriod: z.string().optional(),
  competitorDefinition: z.string().optional(),

  // Performance Metrics
  expectedReach: z.string().optional(),
  expectedEngagement: z.string().optional(),
  minimumViews: z.string().optional(),
  minimumLikes: z.string().optional(),
  clickThroughGoals: z.string().optional(),
  conversionGoals: z.string().optional(),

  // Content Guidelines
  contentStyle: z.string().optional(),
  toneAndVoice: z.string().optional(),
  prohibitedContent: z.string().optional(),
  requiredDisclosures: z.string().optional(),
  brandSafetyGuidelines: z.string().optional(),
  editorialGuidelines: z.string().optional(),

  // Approval Process
  contentSubmissionDeadline: z.string().optional(),
  approvalTimeframe: z.string().optional(),
  approvalMethod: z.enum(['email', 'platform', 'app']).default('email'),
  revisionProcess: z.string().optional(),
  finalApprovalRequired: z.boolean().default(true),

  // Timeline and Deadlines
  campaignStartDate: z.string().optional(),
  campaignEndDate: z.string().optional(),
  contentCreationDeadline: z.string().optional(),
  postingDeadlines: z.string().optional(),
  campaignDuration: z.string().optional(),

  // Influencer Responsibilities
  originalContentCreation: z.boolean().default(true),
  timelyDelivery: z.boolean().default(true),
  professionalConduct: z.boolean().default(true),
  brandRepresentation: z.boolean().default(true),
  communityEngagement: z.boolean().default(false),
  reportingRequirements: z.boolean().default(false),

  // Brand Responsibilities
  timelyPayment: z.boolean().default(true),
  productProvision: z.boolean().default(false),
  marketingSupportMaterials: z.boolean().default(false),
  technicalSupport: z.boolean().default(false),
  contentPromotionSupport: z.boolean().default(false),

  // Reporting and Analytics
  performanceReporting: z.boolean().default(false),
  analyticsSharing: z.boolean().default(false),
  insightsAccess: z.boolean().default(false),
  reportingFrequency: z.enum(['weekly', 'monthly', 'campaign-end']).optional(),
  reportingFormat: z.string().optional(),

  // Crisis Management
  crisisResponsePlan: z.boolean().default(false),
  negativeCommentHandling: z.string().optional(),
  controversyClause: z.boolean().default(false),
  reputationProtection: z.boolean().default(false),
  emergencyContactProtocol: z.string().optional(),

  // Intellectual Property
  trademarkUsage: z.boolean().default(true),
  copyrightRespect: z.boolean().default(true),
  originalityGuarantee: z.boolean().default(true),
  plagiarismProhibition: z.boolean().default(true),
  musicLicensing: z.boolean().default(false),
  imageRights: z.boolean().default(true),

  // Termination Clauses
  terminationRights: z.boolean().default(true),
  terminationNotice: z.string().optional(),
  terminationForCause: z.array(z.string()).default([]),
  earlyTerminationFees: z.boolean().default(false),
  completedWorkPayment: z.boolean().default(true),
  contentRemovalRights: z.boolean().default(false),

  // Confidentiality
  confidentialityClause: z.boolean().default(true),
  ndaRequired: z.boolean().default(false),
  campaignConfidentiality: z.boolean().default(true),
  businessInfoProtection: z.boolean().default(true),
  confidentialityDuration: z.string().optional(),

  // Quality Standards
  contentQualityExpectations: z.string().optional(),
  technicalRequirements: z.string().optional(),
  professionalismStandards: z.string().optional(),
  brandAlignmentRequirements: z.string().optional(),
  authenticityRequirements: z.boolean().default(true),

  // Cross-Promotion
  crossPromotionAllowed: z.boolean().default(false),
  brandCollaborationMentions: z.boolean().default(false),
  otherInfluencerMentions: z.boolean().default(false),
  competitorMentionProhibitions: z.boolean().default(true),

  // Event Participation
  eventAttendance: z.boolean().default(false),
  virtualEventParticipation: z.boolean().default(false),
  liveStreamRequirements: z.boolean().default(false),
  eventCoverage: z.boolean().default(false),
  travelExpenses: z.boolean().default(false),

  // Long-term Partnership
  ongoingPartnership: z.boolean().default(false),
  ambassadorshipOpportunity: z.boolean().default(false),
  futureCollaborationRights: z.boolean().default(false),
  loyaltyBonuses: z.boolean().default(false),
  firstRightOfRefusal: z.boolean().default(false),

  // Legal Compliance
  ageVerification: z.boolean().default(true),
  capacityVerification: z.boolean().default(true),
  legalRepresentationDisclosure: z.boolean().default(false),
  contractualCapacity: z.boolean().default(true),
  parentalConsent: z.boolean().default(false),

  // Dispute Resolution
  disputeResolution: z
    .enum(['negotiation', 'mediation', 'arbitration', 'litigation'])
    .optional(),
  governingLaw: z.string().optional(),
  jurisdiction: z.string().optional(),
  attorneyFees: z.boolean().default(false),

  // Liability and Insurance
  liabilityLimitation: z.boolean().default(true),
  liabilityAmount: z.string().optional(),
  indemnificationClause: z.boolean().default(false),
  insuranceRequirements: z.boolean().default(false),

  // Special Provisions
  forcemajeure: z.boolean().default(true),
  assignmentRights: z.boolean().default(false),
  thirdPartyBeneficiaries: z.boolean().default(false),
  modificationRequirements: z
    .enum(['written-only', 'email-acceptable'])
    .default('written-only'),
  entireAgreement: z.boolean().default(true),

  // Signature Requirements
  requireBrandSignature: z.boolean().default(true),
  requireInfluencerSignature: z.boolean().default(true),
  witnessRequired: z.boolean().default(false),
  notarizationRequired: z.boolean().default(false),
  electronicSignatureAccepted: z.boolean().default(true),
});
