// src/lib/documents/us/talent-management-agreement/schema.ts
import { z } from 'zod';

export const TalentManagementAgreementSchema = z.object({
  // Artist/Talent Information
  talentName: z.string().min(1, 'Talent name is required'),
  talentRealName: z.string().optional(),
  talentAddress: z.string().optional(),
  talentPhone: z.string().optional(),
  talentEmail: z.string().email().optional(),
  talentType: z
    .enum([
      'musician',
      'actor',
      'comedian',
      'athlete',
      'influencer',
      'model',
      'writer',
    ])
    .optional(),
  stageName: z.string().optional(),

  // Manager Information
  managerName: z.string().min(1, 'Manager name is required'),
  managerAddress: z.string().optional(),
  managerPhone: z.string().optional(),
  managerEmail: z.string().email().optional(),
  managementCompany: z.string().optional(),
  managerLicense: z.string().optional(),

  // Contract Terms
  contractTerm: z.string().optional(),
  exclusivity: z.boolean().default(true),
  territoryScope: z
    .enum(['worldwide', 'north-america', 'domestic', 'regional'])
    .default('worldwide'),
  renewalOptions: z.string().optional(),
  terminationNotice: z.string().optional(),

  // Management Services
  careerDevelopment: z.boolean().default(true),
  bookingNegotiation: z.boolean().default(true),
  contractNegotiation: z.boolean().default(true),
  publicRelations: z.boolean().default(true),
  marketingStrategy: z.boolean().default(true),
  brandManagement: z.boolean().default(true),

  // Commission Structure
  commissionRate: z.string().optional(),
  commissionBase: z.enum(['gross', 'net', 'adjusted-gross']).default('gross'),
  commissionScope: z.string().optional(),
  expenseDeductions: z.boolean().default(false),
  cappedCommission: z.string().optional(),

  // Revenue Streams
  recordingRevenue: z.boolean().default(true),
  touringRevenue: z.boolean().default(true),
  merchandiseRevenue: z.boolean().default(true),
  endorsementRevenue: z.boolean().default(true),
  actingRevenue: z.boolean().default(false),
  publishingRevenue: z.boolean().default(false),

  // Expenses and Costs
  expenseReimbursement: z.boolean().default(true),
  expenseApproval: z.boolean().default(true),
  expenseLimit: z.string().optional(),
  travelExpenses: z.boolean().default(true),
  promotionExpenses: z.boolean().default(true),

  // Professional Development
  trainingProvision: z.boolean().default(false),
  coachingServices: z.boolean().default(false),
  skillDevelopment: z.boolean().default(false),
  industryConnections: z.boolean().default(true),
  networkingOpportunities: z.boolean().default(true),

  // Booking and Appearances
  concertBooking: z.boolean().default(true),
  corporateEvents: z.boolean().default(true),
  mediaAppearances: z.boolean().default(true),
  festivalBooking: z.boolean().default(true),
  internationalBooking: z.boolean().default(true),

  // Creative Control
  artisticControl: z
    .enum(['talent', 'manager', 'shared', 'consultation'])
    .default('talent'),
  projectApproval: z.boolean().default(false),
  brandingDecisions: z
    .enum(['talent', 'manager', 'shared', 'consultation'])
    .default('shared'),
  publicityApproval: z.boolean().default(true),

  // Financial Management
  financialAdvice: z.boolean().default(true),
  budgetManagement: z.boolean().default(false),
  investmentAdvice: z.boolean().default(false),
  taxPlanning: z.boolean().default(false),
  accountingServices: z.boolean().default(false),

  // Digital and Social Media
  socialMediaManagement: z.boolean().default(true),
  digitalMarketing: z.boolean().default(true),
  onlinePresence: z.boolean().default(true),
  contentCreation: z.boolean().default(false),
  influencerPartnerships: z.boolean().default(false),

  // Legal Support
  legalReferrals: z.boolean().default(true),
  contractReview: z.boolean().default(true),
  legalRepresentation: z.boolean().default(false),
  disputeResolutionSupport: z.boolean().default(true),

  // Publicity and PR
  mediaRelations: z.boolean().default(true),
  publicityStrategy: z.boolean().default(true),
  crisisManagement: z.boolean().default(true),
  imageConsulting: z.boolean().default(true),
  interviewCoordination: z.boolean().default(true),

  // Recording and Production
  recordLabelNegotiation: z.boolean().default(true),
  studioBooking: z.boolean().default(false),
  producerConnections: z.boolean().default(true),
  recordingOversight: z.boolean().default(false),

  // Touring Support
  tourPlanning: z.boolean().default(true),
  venueNegotiation: z.boolean().default(true),
  tourLogistics: z.boolean().default(false),
  crewManagement: z.boolean().default(false),
  tourAccounting: z.boolean().default(false),

  // Merchandising
  merchandiseStrategy: z.boolean().default(true),
  merchandiseDeals: z.boolean().default(true),
  productDesign: z.boolean().default(false),
  merchandiseAccounting: z.boolean().default(true),

  // Endorsements and Sponsorships
  endorsementDeals: z.boolean().default(true),
  brandPartnerships: z.boolean().default(true),
  sponsorshipNegotiation: z.boolean().default(true),
  brandAlignment: z.boolean().default(true),

  // Performance Standards
  performanceMetrics: z.string().optional(),
  goalsAndObjectives: z.string().optional(),
  progressReporting: z.boolean().default(true),
  performanceReviews: z.boolean().default(false),

  // Confidentiality
  confidentialityAgreement: z.boolean().default(true),
  nonDisclosure: z.boolean().default(true),
  personalInformation: z.boolean().default(true),
  businessInformation: z.boolean().default(true),

  // Conflicts of Interest
  exclusiveRepresentation: z.boolean().default(true),
  competingClients: z.boolean().default(false),
  conflictResolution: z.string().optional(),
  ethicalStandards: z.boolean().default(true),

  // Termination Provisions
  terminationCauses: z.string().optional(),
  postTerminationCommissions: z.string().optional(),
  transitionPeriod: z.string().optional(),
  nonCompeteClause: z.boolean().default(false),
  clientRetention: z.boolean().default(false),

  // International Considerations
  internationalTours: z.boolean().default(true),
  visaAssistance: z.boolean().default(false),
  foreignMarkets: z.boolean().default(true),
  currencyManagement: z.boolean().default(false),

  // Technology and Innovation
  streamingStrategy: z.boolean().default(true),
  digitalDistribution: z.boolean().default(true),
  nftOpportunities: z.boolean().default(false),
  virtualEvents: z.boolean().default(false),

  // Insurance and Protection
  keyPersonInsurance: z.boolean().default(false),
  liabilityInsurance: z.boolean().default(true),
  errorsOmissionsInsurance: z.boolean().default(true),
  disabilityInsurance: z.boolean().default(false),

  // Communication Protocols
  reportingFrequency: z
    .enum(['weekly', 'monthly', 'quarterly', 'as-needed'])
    .default('monthly'),
  communicationMethods: z.string().optional(),
  accessibilityRequirements: z.string().optional(),
  emergencyContact: z.boolean().default(true),

  // Dispute Resolution
  disputeResolution: z
    .enum(['mediation', 'arbitration', 'court'])
    .default('mediation'),
  governingLaw: z.string().optional(),
  jurisdiction: z.string().optional(),

  // Signature Requirements
  talentSignature: z.boolean().default(true),
  managerSignature: z.boolean().default(true),
  parentalConsent: z.boolean().default(false),
  witnessSignature: z.boolean().default(false),
  notarization: z.boolean().default(false),
});
