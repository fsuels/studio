// src/lib/documents/us/film-production-agreement/schema.ts
import { z } from 'zod';

export const FilmProductionAgreementSchema = z.object({
  // Producer Information
  producerName: z.string().min(1, 'Producer name is required'),
  producerAddress: z.string().optional(),
  producerPhone: z.string().optional(),
  producerEmail: z.string().email().optional(),
  productionCompany: z.string().optional(),
  producerCredits: z.string().optional(),

  // Client/Financier Information
  clientName: z.string().min(1, 'Client name is required'),
  clientAddress: z.string().optional(),
  clientPhone: z.string().optional(),
  clientEmail: z.string().email().optional(),
  clientType: z
    .enum(['individual', 'studio', 'network', 'streaming', 'distributor'])
    .optional(),

  // Project Details
  projectTitle: z.string().optional(),
  projectType: z
    .enum([
      'feature-film',
      'short-film',
      'documentary',
      'commercial',
      'music-video',
      'series',
      'pilot',
    ])
    .optional(),
  genre: z.string().optional(),
  rating: z.enum(['g', 'pg', 'pg-13', 'r', 'nc-17', 'unrated']).optional(),
  duration: z.string().optional(),
  format: z.enum(['digital', '35mm', '16mm', '4k', '8k']).optional(),

  // Budget and Financing
  totalBudget: z.string().optional(),
  productionBudget: z.string().optional(),
  postProductionBudget: z.string().optional(),
  marketingBudget: z.string().optional(),
  contingencyFund: z.string().optional(),
  financingStructure: z.string().optional(),

  // Schedule
  preProductionStart: z.string().optional(),
  principalPhotographyStart: z.string().optional(),
  principalPhotographyEnd: z.string().optional(),
  postProductionDeadline: z.string().optional(),
  deliveryDeadline: z.string().optional(),
  releaseDate: z.string().optional(),

  // Locations
  filmingLocations: z.string().optional(),
  studioFacilities: z.string().optional(),
  locationPermits: z.boolean().default(true),
  locationInsurance: z.boolean().default(true),
  locationFees: z.string().optional(),

  // Cast and Crew
  castingDirector: z.string().optional(),
  keyActors: z.string().optional(),
  director: z.string().optional(),
  cinematographer: z.string().optional(),
  screenwriter: z.string().optional(),
  crewSize: z.string().optional(),

  // Rights and Ownership
  copyrightOwnership: z
    .enum(['producer', 'client', 'shared', 'distributor'])
    .default('client'),
  distributionRights: z.string().optional(),
  merchandisingRights: z.boolean().default(false),
  sequelRights: z.boolean().default(false),
  remakeRights: z.boolean().default(false),

  // Talent Agreements
  actorContracts: z.boolean().default(true),
  crewContracts: z.boolean().default(true),
  unionCompliance: z.boolean().default(true),
  talentReleases: z.boolean().default(true),

  // Music and Sound
  originalScore: z.boolean().default(false),
  licensedMusic: z.boolean().default(false),
  musicRights: z.string().optional(),
  soundDesign: z.boolean().default(true),
  musicSupervisor: z.string().optional(),

  // Post-Production
  editing: z.boolean().default(true),
  colorCorrection: z.boolean().default(true),
  visualEffects: z.boolean().default(false),
  soundMixing: z.boolean().default(true),
  finalCut: z
    .enum(['producer', 'director', 'client', 'distributor'])
    .default('producer'),

  // Equipment and Technology
  cameras: z.string().optional(),
  lightingEquipment: z.string().optional(),
  soundEquipment: z.string().optional(),
  postProductionSoftware: z.string().optional(),
  equipmentInsurance: z.boolean().default(true),

  // Insurance and Bonding
  productionInsurance: z.boolean().default(true),
  errorsOmissionsInsurance: z.boolean().default(true),
  completionBond: z.boolean().default(false),
  equipmentCoverage: z.boolean().default(true),
  castInsurance: z.boolean().default(false),

  // Distribution and Exhibition
  distributionStrategy: z.string().optional(),
  theatricalRelease: z.boolean().default(false),
  streamingRights: z.boolean().default(true),
  internationalSales: z.boolean().default(false),
  festivalSubmissions: z.boolean().default(false),

  // Marketing and Publicity
  marketingStrategy: z.string().optional(),
  publicityRights: z.boolean().default(true),
  promotionalMaterials: z.boolean().default(true),
  premiereEvent: z.boolean().default(false),
  pressScreenings: z.boolean().default(false),

  // Compensation Structure
  producerFee: z.string().optional(),
  directorFee: z.string().optional(),
  castCompensation: z.string().optional(),
  crewWages: z.string().optional(),
  profitParticipation: z.boolean().default(false),
  backendParticipation: z.string().optional(),

  // Union and Guild Compliance
  sagAftraCompliance: z.boolean().default(false),
  dgaCompliance: z.boolean().default(false),
  wgaCompliance: z.boolean().default(false),
  iatseCompliance: z.boolean().default(false),

  // Legal and Regulatory
  contentRatings: z.boolean().default(true),
  censorshipCompliance: z.boolean().default(true),
  childActorRegulations: z.boolean().default(false),
  animalWelfareCompliance: z.boolean().default(false),

  // International Considerations
  coproductionTreaty: z.boolean().default(false),
  foreignLocations: z.boolean().default(false),
  currencyHedging: z.boolean().default(false),
  taxIncentives: z.string().optional(),

  // Environmental
  sustainabilityPractices: z.boolean().default(false),
  greenProduction: z.boolean().default(false),
  wasteManagement: z.string().optional(),
  carbonFootprintReduction: z.boolean().default(false),

  // Technology and Innovation
  virtualProduction: z.boolean().default(false),
  aiTechnology: z.boolean().default(false),
  streamingTechnology: z.boolean().default(false),
  vrArContent: z.boolean().default(false),

  // Deliverables
  masterDelivery: z.string().optional(),
  digitalDeliverables: z.string().optional(),
  physicalDeliverables: z.string().optional(),
  marketingMaterials: z.string().optional(),
  technicalSpecifications: z.string().optional(),

  // Quality Control
  qualityStandards: z.string().optional(),
  technicalReview: z.boolean().default(true),
  clientApproval: z.boolean().default(true),
  revisionRounds: z.string().optional(),

  // Confidentiality
  nonDisclosureAgreement: z.boolean().default(true),
  scriptConfidentiality: z.boolean().default(true),
  castConfidentiality: z.boolean().default(true),
  plotConfidentiality: z.boolean().default(true),

  // Termination and Cancellation
  terminationClauses: z.string().optional(),
  forceMAjeure: z.boolean().default(true),
  weatherCancellation: z.boolean().default(true),
  actorUnavailability: z.boolean().default(true),

  // Dispute Resolution
  disputeResolution: z
    .enum(['arbitration', 'mediation', 'court'])
    .default('arbitration'),
  governingLaw: z.string().optional(),
  jurisdiction: z.string().optional(),

  // Signature Requirements
  producerSignature: z.boolean().default(true),
  clientSignature: z.boolean().default(true),
  directorSignature: z.boolean().default(false),
  witnessSignature: z.boolean().default(false),
  notarization: z.boolean().default(false),
});
