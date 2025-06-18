// src/lib/documents/us/recording-artist-agreement/schema.ts
import { z } from 'zod';

export const RecordingArtistAgreementSchema = z.object({
  // Artist Information
  artistName: z.string().min(1, 'Artist name is required'),
  artistRealName: z.string().optional(),
  artistAddress: z.string().optional(),
  artistPhone: z.string().optional(),
  artistEmail: z.string().email().optional(),
  artistType: z.enum(['solo', 'band', 'duo', 'group']).default('solo'),
  bandMembers: z.string().optional(),
  
  // Record Label Information
  labelName: z.string().min(1, 'Record label name is required'),
  labelAddress: z.string().optional(),
  labelPhone: z.string().optional(),
  labelEmail: z.string().email().optional(),
  labelType: z.enum(['major', 'independent', 'boutique', 'distributor']).default('independent'),
  
  // Contract Type
  dealType: z.enum(['recording', 'distribution', 'development', '360-deal', 'licensing']).default('recording'),
  contractTerm: z.string().optional(),
  albumCommitment: z.string().optional(),
  optionPeriods: z.string().optional(),
  exclusivity: z.boolean().default(true),
  
  // Recording Details
  recordingBudget: z.string().optional(),
  studioSelection: z.enum(['label-choice', 'artist-choice', 'mutual', 'approved-list']).default('mutual'),
  producerSelection: z.enum(['label-choice', 'artist-choice', 'mutual', 'approved-list']).default('mutual'),
  recordingSchedule: z.string().optional(),
  deliveryDeadlines: z.string().optional(),
  
  // Royalty Structure
  mechanicalRoyaltyRate: z.string().optional(),
  digitalRoyaltyRate: z.string().optional(),
  physicalRoyaltyRate: z.string().optional(),
  streamingRoyaltyRate: z.string().optional(),
  syncRoyaltyRate: z.string().optional(),
  performanceRoyalties: z.boolean().default(true),
  
  // Advances and Recoupment
  signingAdvance: z.string().optional(),
  recordingAdvance: z.string().optional(),
  promotionAdvance: z.string().optional(),
  tourAdvance: z.string().optional(),
  recoupmentTerms: z.string().optional(),
  crossCollateralization: z.boolean().default(false),
  
  // Rights and Ownership
  masterOwnership: z.enum(['label', 'artist', 'shared', 'reversion']).default('label'),
  publishingRights: z.enum(['label', 'artist', 'shared', 'publisher']).default('artist'),
  merchandisingRights: z.boolean().default(false),
  touringRights: z.boolean().default(false),
  nameAndLikeness: z.boolean().default(true),
  
  // Distribution and Marketing
  distributionTerritory: z.enum(['worldwide', 'north-america', 'domestic', 'international']).default('worldwide'),
  distributionChannels: z.string().optional(),
  marketingBudget: z.string().optional(),
  promotionCommitment: z.string().optional(),
  radioPromotion: z.boolean().default(true),
  digitalMarketing: z.boolean().default(true),
  
  // Creative Control
  artisticControl: z.enum(['artist', 'label', 'shared', 'approval']).default('shared'),
  songSelection: z.enum(['artist', 'label', 'shared', 'approval']).default('artist'),
  albumArtwork: z.enum(['artist', 'label', 'shared', 'approval']).default('shared'),
  videoProduction: z.enum(['artist', 'label', 'shared', 'approval']).default('label'),
  
  // Performance and Touring
  touringObligations: z.string().optional(),
  concertApproval: z.boolean().default(false),
  festivalParticipation: z.boolean().default(true),
  tourSupport: z.string().optional(),
  merchandiseRevenue: z.enum(['artist', 'label', 'shared']).default('artist'),
  
  // Digital and Streaming
  digitalDistribution: z.boolean().default(true),
  streamingPlatforms: z.string().optional(),
  socialMediaRights: z.boolean().default(true),
  contentCreation: z.boolean().default(false),
  digitalMarketing: z.boolean().default(true),
  
  // Synchronization Rights
  filmSyncRights: z.boolean().default(true),
  tvSyncRights: z.boolean().default(true),
  commercialSyncRights: z.boolean().default(true),
  gamingSyncRights: z.boolean().default(true),
  syncApproval: z.enum(['artist', 'label', 'mutual']).default('mutual'),
  
  // Publishing and Composition
  songwritingCredits: z.string().optional(),
  publisherAffiliation: z.string().optional(),
  mechanicalLicensing: z.boolean().default(true),
  performanceRights: z.enum(['ascap', 'bmi', 'sesac', 'other']).optional(),
  
  // Production Credits
  producerRoyalties: z.string().optional(),
  engineerCredits: z.string().optional(),
  mixerCredits: z.string().optional(),
  sessionMusicians: z.string().optional(),
  productionBudget: z.string().optional(),
  
  // Quality Standards
  technicalStandards: z.string().optional(),
  masteredQuality: z.boolean().default(true),
  albumLength: z.string().optional(),
  songMinimums: z.string().optional(),
  
  // International Rights
  internationalDistribution: z.boolean().default(true),
  foreignSubPublishing: z.boolean().default(false),
  translationRights: z.boolean().default(false),
  culturalAdaptation: z.boolean().default(false),
  
  // Technology and Innovation
  aiGeneration: z.boolean().default(false),
  nftRights: z.boolean().default(false),
  virtualConcerts: z.boolean().default(false),
  metaverseRights: z.boolean().default(false),
  
  // Sample Clearances
  sampleClearance: z.boolean().default(true),
  interpolationRights: z.boolean().default(true),
  clearanceResponsibility: z.enum(['artist', 'label', 'shared']).default('label'),
  clearanceBudget: z.string().optional(),
  
  // Professional Services
  legalRepresentation: z.boolean().default(true),
  managementApproval: z.boolean().default(false),
  accountingServices: z.boolean().default(true),
  publicistServices: z.boolean().default(false),
  
  // Termination and Reversion
  terminationCauses: z.string().optional(),
  rightToTerminate: z.boolean().default(true),
  masterReversion: z.string().optional(),
  publishingReversion: z.string().optional(),
  noticeRequirements: z.string().optional(),
  
  // Financial Reporting
  royaltyStatements: z.enum(['monthly', 'quarterly', 'semi-annual', 'annual']).default('semi-annual'),
  auditRights: z.boolean().default(true),
  accountingStandards: z.string().optional(),
  paymentTerms: z.string().optional(),
  
  // Collaboration Rights
  collaborationApproval: z.boolean().default(false),
  featuringRights: z.boolean().default(true),
  remixRights: z.boolean().default(true),
  coverVersions: z.boolean().default(false),
  
  // Promotional Obligations
  interviewObligations: z.string().optional(),
  photoshootRequirements: z.string().optional(),
  socialMediaObligations: z.string().optional(),
  appearanceRequirements: z.string().optional(),
  
  // Insurance and Liability
  keyPersonInsurance: z.boolean().default(false),
  equipmentInsurance: z.boolean().default(false),
  errorsOmissionsInsurance: z.boolean().default(true),
  liabilityLimitations: z.string().optional(),
  
  // Dispute Resolution
  disputeResolution: z.enum(['arbitration', 'mediation', 'court']).default('arbitration'),
  governingLaw: z.string().optional(),
  jurisdiction: z.string().optional(),
  
  // Signature Requirements
  artistSignature: z.boolean().default(true),
  labelSignature: z.boolean().default(true),
  managementSignature: z.boolean().default(false),
  witnessSignature: z.boolean().default(false),
  notarization: z.boolean().default(false),
});