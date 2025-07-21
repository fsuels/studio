// src/lib/documents/us/sponsorship-agreement/schema.ts
import { z } from 'zod';

export const SponsorshipAgreementSchema = z.object({
  // Sponsor Information
  sponsorName: z.string().min(1, 'Sponsor name is required'),
  sponsorAddress: z.string().optional(),
  sponsorPhone: z.string().optional(),
  sponsorEmail: z.string().email().optional(),
  sponsorContactPerson: z.string().optional(),
  sponsorIndustry: z.string().optional(),

  // Sponsored Party Information
  sponsoredPartyName: z.string().min(1, 'Sponsored party name is required'),
  sponsoredPartyAddress: z.string().optional(),
  sponsoredPartyPhone: z.string().optional(),
  sponsoredPartyEmail: z.string().email().optional(),
  sponsoredPartyType: z
    .enum(['individual', 'team', 'organization', 'event', 'venue'])
    .default('organization'),

  // Sponsorship Details
  sponsorshipType: z
    .enum([
      'event',
      'sports',
      'media',
      'venue',
      'program',
      'individual',
      'other',
    ])
    .default('event'),
  sponsorshipLevel: z
    .enum([
      'title',
      'presenting',
      'platinum',
      'gold',
      'silver',
      'bronze',
      'supporting',
    ])
    .default('gold'),
  sponsorshipDescription: z.string().optional(),
  exclusivity: z.boolean().default(false),
  exclusivityDetails: z.string().optional(),

  // Event/Activity Details
  eventName: z.string().optional(),
  eventDate: z.string().optional(),
  eventLocation: z.string().optional(),
  expectedAttendance: z.string().optional(),
  targetAudience: z.string().optional(),

  // Financial Terms
  sponsorshipFee: z.string().optional(),
  paymentSchedule: z
    .enum(['upfront', 'installments', 'milestone-based', 'performance-based'])
    .default('upfront'),
  paymentTerms: z.string().optional(),
  inkindValue: z.string().optional(),
  performanceBonuses: z.boolean().default(false),

  // Sponsorship Benefits
  logoPlacement: z.boolean().default(true),
  signageRights: z.boolean().default(true),
  namingRights: z.boolean().default(false),
  speakingOpportunity: z.boolean().default(false),
  boothSpace: z.boolean().default(false),
  ticketsProvided: z.string().optional(),

  // Marketing Rights
  useOfLogo: z.boolean().default(true),
  useOfName: z.boolean().default(true),
  marketingMaterials: z.boolean().default(true),
  socialMediaRights: z.boolean().default(true),
  websitePresence: z.boolean().default(true),
  pressReleaseRights: z.boolean().default(true),

  // Media and Advertising
  mediaExposure: z.string().optional(),
  advertisingRights: z.boolean().default(true),
  broadcastRights: z.boolean().default(false),
  digitalRights: z.boolean().default(true),
  merchandisingRights: z.boolean().default(false),

  // Activation Requirements
  activationBudget: z.string().optional(),
  activationResponsibilities: z.string().optional(),
  minimumActivation: z.boolean().default(false),
  approvalRequired: z.boolean().default(true),

  // Performance Metrics
  deliverables: z.string().optional(),
  performanceMetrics: z.string().optional(),
  reportingRequirements: z.string().optional(),
  auditRights: z.boolean().default(false),

  // Term and Duration
  agreementStartDate: z.string().optional(),
  agreementEndDate: z.string().optional(),
  renewalOptions: z.boolean().default(false),
  renewalTerms: z.string().optional(),
  firstRightOfRefusal: z.boolean().default(false),

  // Exclusions and Restrictions
  competitorExclusion: z.boolean().default(true),
  categoryExclusivity: z.boolean().default(false),
  geographicRestrictions: z.string().optional(),
  useRestrictions: z.string().optional(),

  // Intellectual Property
  ipOwnership: z
    .enum(['sponsor', 'sponsored-party', 'joint', 'separate'])
    .default('separate'),
  trademarkLicense: z.boolean().default(true),
  contentRights: z.boolean().default(false),
  photographyRights: z.boolean().default(true),

  // Obligations
  sponsorObligations: z.string().optional(),
  sponsoredPartyObligations: z.string().optional(),
  mutualObligations: z.string().optional(),
  complianceRequirements: z.string().optional(),

  // Insurance and Liability
  liabilityInsurance: z.boolean().default(true),
  insuranceCoverage: z.string().optional(),
  indemnification: z.boolean().default(true),
  limitationOfLiability: z.boolean().default(true),

  // Termination
  terminationRights: z.string().optional(),
  terminationNotice: z.string().optional(),
  earlyTerminationPenalty: z.string().optional(),
  postTerminationRights: z.string().optional(),

  // Force Majeure
  forceMajeureClause: z.boolean().default(true),
  cancellationPolicy: z.string().optional(),
  refundPolicy: z.string().optional(),
  alternativeArrangements: z.string().optional(),

  // Confidentiality
  confidentialityRequired: z.boolean().default(true),
  confidentialityPeriod: z.string().optional(),
  publicAnnouncementRights: z.string().optional(),

  // Dispute Resolution
  disputeResolution: z
    .enum(['negotiation', 'mediation', 'arbitration', 'court'])
    .default('mediation'),
  governingLaw: z.string().optional(),
  jurisdiction: z.string().optional(),

  // Special Provisions
  mostFavoredNation: z.boolean().default(false),
  benchmarkingRights: z.boolean().default(false),
  specialRequirements: z.string().optional(),
  additionalBenefits: z.string().optional(),

  // Signature Requirements
  requireSponsorSignature: z.boolean().default(true),
  requireSponsoredPartySignature: z.boolean().default(true),
  witnessRequired: z.boolean().default(false),
  notarizationRequired: z.boolean().default(false),
  electronicSignatureAccepted: z.boolean().default(true),
});
