// src/lib/documents/us/music-licensing-agreement/schema.ts
import { z } from 'zod';

export const MusicLicensingAgreementSchema = z.object({
  // Licensor Information
  licensorName: z.string().min(1, 'Licensor name is required'),
  licensorAddress: z.string().min(1, 'Licensor address is required'),
  licensorPhone: z.string().optional(),
  licensorEmail: z.string().email().optional(),
  
  // Licensee Information
  licenseeName: z.string().min(1, 'Licensee name is required'),
  licenseeAddress: z.string().min(1, 'Licensee address is required'),
  licenseePhone: z.string().optional(),
  licenseeEmail: z.string().email().optional(),
  
  // Music Details
  songTitle: z.string().min(1, 'Song title is required'),
  artistName: z.string().optional(),
  composerName: z.string().optional(),
  publisherName: z.string().optional(),
  albumTitle: z.string().optional(),
  recordLabel: z.string().optional(),
  
  // License Type
  licenseType: z.enum(['sync', 'mechanical', 'performance', 'master', 'print']).default('sync'),
  useType: z.enum(['film', 'television', 'commercial', 'video-game', 'streaming', 'radio']).default('film'),
  territory: z.string().optional(),
  duration: z.string().optional(),
  
  // Usage Rights
  synchronizationRights: z.boolean().default(false),
  mechanicalRights: z.boolean().default(false),
  performanceRights: z.boolean().default(false),
  digitalRights: z.boolean().default(false),
  broadcastRights: z.boolean().default(false),
  
  // Project Details
  projectTitle: z.string().optional(),
  projectDescription: z.string().optional(),
  productionCompany: z.string().optional(),
  estimatedBudget: z.string().optional(),
  releaseDate: z.string().optional(),
  
  // Fee Structure
  licenseFee: z.string().optional(),
  royaltyRate: z.string().optional(),
  minimumGuarantee: z.string().optional(),
  advancePayment: z.string().optional(),
  
  // Payment Terms
  paymentSchedule: z.enum(['upfront', 'on-release', 'quarterly', 'annually']).default('upfront'),
  reportingRequired: z.boolean().default(false),
  auditRights: z.boolean().default(false),
  
  // Usage Restrictions
  exclusiveUse: z.boolean().default(false),
  geographicLimitations: z.string().optional(),
  timeLimitations: z.string().optional(),
  mediumRestrictions: z.string().optional(),
  
  // Credits and Attribution
  creditRequired: z.boolean().default(true),
  creditPlacement: z.string().optional(),
  creditFormat: z.string().optional(),
  
  // Warranty and Representation
  ownershipWarranty: z.boolean().default(true),
  clearanceWarranty: z.boolean().default(true),
  indemnificationClause: z.boolean().default(true),
  
  // Termination
  termRights: z.string().optional(),
  breachConditions: z.string().optional(),
  survivingProvisions: z.string().optional(),
  
  // Legal Terms
  governingLaw: z.string().optional(),
  jurisdiction: z.string().optional(),
  disputeResolution: z.enum(['negotiation', 'mediation', 'arbitration']).optional(),
  
  // Signature Requirements
  requireLicensorSignature: z.boolean().default(true),
  requireLicenseeSignature: z.boolean().default(true),
  witnessRequired: z.boolean().default(false),
  notarizationRequired: z.boolean().default(false),
  electronicSignatureAccepted: z.boolean().default(true),
});