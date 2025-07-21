// src/lib/documents/us/gaming-agreement/schema.ts
import { z } from 'zod';

export const GamingAgreementSchema = z.object({
  // Organization/Team Information
  organizationName: z.string().min(1, 'Organization name is required'),
  organizationAddress: z.string().optional(),
  organizationContact: z.string().optional(),
  organizationEmail: z.string().email().optional(),
  teamName: z.string().optional(),

  // Player Information
  playerName: z.string().min(1, 'Player name is required'),
  playerGamertag: z.string().optional(),
  playerAddress: z.string().optional(),
  playerPhone: z.string().optional(),
  playerEmail: z.string().email().optional(),
  playerAge: z.string().optional(),

  // Guardian Information (if minor)
  isMinor: z.boolean().default(false),
  guardianName: z.string().optional(),
  guardianRelationship: z.string().optional(),
  guardianContact: z.string().optional(),

  // Game and Competition Details
  gameTitle: z.string().min(1, 'Game title is required'),
  gameGenre: z.string().optional(),
  competitionLevel: z
    .enum(['amateur', 'semi-professional', 'professional'])
    .default('amateur'),
  platform: z.enum(['pc', 'console', 'mobile', 'multiple']).default('pc'),

  // Agreement Type
  agreementType: z
    .enum([
      'player-contract',
      'tournament',
      'sponsorship',
      'coaching',
      'streaming',
    ])
    .default('player-contract'),
  serviceDescription: z.string().optional(),
  roleDescription: z.string().optional(),

  // Term and Duration
  contractStartDate: z.string().optional(),
  contractEndDate: z.string().optional(),
  contractDuration: z.string().optional(),
  renewalOptions: z.boolean().default(false),

  // Training and Practice
  practiceSchedule: z.string().optional(),
  trainingHours: z.string().optional(),
  attendanceRequirements: z.string().optional(),
  skillDevelopment: z.string().optional(),

  // Competition Schedule
  tournamentParticipation: z.boolean().default(false),
  competitionSchedule: z.string().optional(),
  travelRequirements: z.boolean().default(false),
  availabilityRequirements: z.string().optional(),

  // Financial Terms
  compensationType: z
    .enum([
      'salary',
      'prize-share',
      'hourly',
      'tournament-winnings',
      'sponsorship',
    ])
    .default('salary'),
  baseSalary: z.string().optional(),
  prizeSharePercentage: z.string().optional(),
  bonusStructure: z.string().optional(),
  performanceIncentives: z.boolean().default(false),

  // Streaming and Content
  streamingRequirements: z.boolean().default(false),
  streamingSchedule: z.string().optional(),
  contentCreation: z.boolean().default(false),
  socialMediaRequirements: z.string().optional(),
  platformExclusivity: z.boolean().default(false),

  // Equipment and Setup
  equipmentProvided: z.boolean().default(false),
  equipmentList: z.string().optional(),
  internetRequirements: z.string().optional(),
  setupRequirements: z.string().optional(),
  peripheralsProvided: z.boolean().default(false),

  // Performance Standards
  performanceMetrics: z.string().optional(),
  skillRequirements: z.string().optional(),
  rankRequirements: z.string().optional(),
  behaviorStandards: z.string().optional(),

  // Sponsorship and Branding
  sponsorshipRights: z.boolean().default(false),
  brandingRequirements: z.string().optional(),
  merchandisingRights: z.boolean().default(false),
  endorsementRights: z.boolean().default(false),
  imageRights: z.boolean().default(false),

  // Intellectual Property
  gameplayRights: z.boolean().default(false),
  streamingRights: z.boolean().default(false),
  contentOwnership: z
    .enum(['player', 'organization', 'shared'])
    .default('shared'),

  // Exclusivity Terms
  teamExclusivity: z.boolean().default(false),
  competitorRestrictions: z.boolean().default(false),
  nonCompeteClause: z.boolean().default(false),
  exclusivityPeriod: z.string().optional(),

  // Health and Safety
  gamingHealthGuidelines: z.string().optional(),
  breakRequirements: z.string().optional(),
  ergonomicRequirements: z.string().optional(),
  mentalHealthSupport: z.boolean().default(false),

  // Travel and Accommodation
  travelExpenses: z.boolean().default(false),
  accommodationProvided: z.boolean().default(false),
  travelPolicy: z.string().optional(),
  internationalTravel: z.boolean().default(false),

  // Code of Conduct
  conductStandards: z.string().optional(),
  communicationGuidelines: z.string().optional(),
  sportsmanship: z.boolean().default(true),
  antiCheatPolicy: z.boolean().default(true),

  // Disciplinary Procedures
  disciplinaryActions: z.string().optional(),
  suspensionPolicy: z.string().optional(),
  appealProcess: z.string().optional(),

  // Media and Publicity
  mediaObligations: z.string().optional(),
  interviewRequirements: z.boolean().default(false),
  publicAppearances: z.boolean().default(false),
  socialMediaPolicy: z.string().optional(),

  // Termination
  terminationConditions: z.string().optional(),
  terminationNotice: z.string().optional(),
  transferRights: z.boolean().default(false),
  releaseConditions: z.string().optional(),

  // Legal Terms
  governingLaw: z.string().optional(),
  jurisdiction: z.string().optional(),
  disputeResolution: z.enum(['mediation', 'arbitration', 'court']).optional(),

  // Signature Requirements
  requireOrganizationSignature: z.boolean().default(true),
  requirePlayerSignature: z.boolean().default(true),
  requireGuardianSignature: z.boolean().default(false),
  witnessRequired: z.boolean().default(false),
  notarizationRequired: z.boolean().default(false),
  electronicSignatureAccepted: z.boolean().default(true),
});
