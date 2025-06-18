// src/lib/documents/us/crop-sharing-agreement/schema.ts
import { z } from 'zod';

export const CropSharingAgreementSchema = z.object({
  // Landowner Information
  landownerName: z.string().min(1, 'Landowner name is required'),
  landownerAddress: z.string().optional(),
  landownerPhone: z.string().optional(),
  landownerEmail: z.string().email().optional(),
  
  // Tenant/Farmer Information
  tenantName: z.string().min(1, 'Tenant name is required'),
  tenantAddress: z.string().optional(),
  tenantPhone: z.string().optional(),
  tenantEmail: z.string().email().optional(),
  farmingExperience: z.string().optional(),
  
  // Property Description
  propertyAddress: z.string().optional(),
  totalAcreage: z.string().optional(),
  cultivableAcreage: z.string().optional(),
  soilType: z.string().optional(),
  irrigationSystem: z.string().optional(),
  drainageSystem: z.string().optional(),
  
  // Crop Details
  cropsToGrow: z.string().optional(),
  varietiesSpecified: z.string().optional(),
  rotationPlan: z.string().optional(),
  organicCertification: z.boolean().default(false),
  seedSource: z.enum(['landowner', 'tenant', 'shared']).default('tenant'),
  
  // Sharing Arrangement
  sharePercentageLandowner: z.string().optional(),
  sharePercentageTenant: z.string().optional(),
  sharingBasis: z.enum(['gross-crop', 'net-proceeds', 'fixed-bushels', 'fixed-cash']).default('gross-crop'),
  marketingResponsibility: z.enum(['landowner', 'tenant', 'joint']).default('tenant'),
  
  // Financial Responsibilities
  seedCosts: z.enum(['landowner', 'tenant', 'shared']).default('tenant'),
  fertilizerCosts: z.enum(['landowner', 'tenant', 'shared']).default('tenant'),
  pesticideCosts: z.enum(['landowner', 'tenant', 'shared']).default('tenant'),
  fuelCosts: z.enum(['landowner', 'tenant', 'shared']).default('tenant'),
  laborCosts: z.enum(['landowner', 'tenant', 'shared']).default('tenant'),
  
  // Equipment and Machinery
  equipmentProvided: z.enum(['landowner', 'tenant', 'shared']).default('tenant'),
  maintenanceResponsibility: z.enum(['landowner', 'tenant', 'shared']).default('tenant'),
  storageProvided: z.boolean().default(false),
  dryingFacilities: z.boolean().default(false),
  
  // Operations
  plantingDate: z.string().optional(),
  harvestDate: z.string().optional(),
  operationalDecisions: z.enum(['landowner', 'tenant', 'joint']).default('tenant'),
  recordKeeping: z.enum(['landowner', 'tenant', 'shared']).default('tenant'),
  
  // Insurance
  cropInsurance: z.boolean().default(false),
  insuranceResponsibility: z.enum(['landowner', 'tenant', 'shared']).default('shared'),
  liabilityInsurance: z.boolean().default(false),
  equipmentInsurance: z.boolean().default(false),
  
  // Conservation Practices
  conservationCompliance: z.boolean().default(true),
  environmentalRestrictions: z.string().optional(),
  soilConservation: z.string().optional(),
  waterConservation: z.string().optional(),
  
  // Government Programs
  governmentPrograms: z.boolean().default(false),
  subsidySharing: z.string().optional(),
  complianceRequirements: z.string().optional(),
  certificationMaintenance: z.string().optional(),
  
  // Term and Renewal
  agreementStartDate: z.string().optional(),
  agreementEndDate: z.string().optional(),
  renewalOptions: z.boolean().default(false),
  automaticRenewal: z.boolean().default(false),
  renewalTerms: z.string().optional(),
  
  // Termination
  terminationNotice: z.string().optional(),
  earlyTermination: z.string().optional(),
  harvestRights: z.string().optional(),
  improvementCompensation: z.string().optional(),
  
  // Risk Management
  weatherRisk: z.enum(['landowner', 'tenant', 'shared']).default('shared'),
  marketRisk: z.enum(['landowner', 'tenant', 'shared']).default('shared'),
  yieldRisk: z.enum(['landowner', 'tenant', 'shared']).default('shared'),
  priceRisk: z.enum(['landowner', 'tenant', 'shared']).default('shared'),
  
  // Quality Standards
  qualityRequirements: z.string().optional(),
  gradingStandards: z.string().optional(),
  deliveryRequirements: z.string().optional(),
  rejectionPolicy: z.string().optional(),
  
  // Dispute Resolution
  disputeResolution: z.enum(['negotiation', 'mediation', 'arbitration', 'court']).default('mediation'),
  expertsConsultation: z.boolean().default(false),
  governingLaw: z.string().optional(),
  jurisdiction: z.string().optional(),
  
  // Special Provisions
  organicPractices: z.boolean().default(false),
  sustainablePractices: z.string().optional(),
  technologyUse: z.string().optional(),
  innovationSharing: z.boolean().default(false),
  
  // Signature Requirements
  requireLandownerSignature: z.boolean().default(true),
  requireTenantSignature: z.boolean().default(true),
  witnessRequired: z.boolean().default(false),
  notarizationRequired: z.boolean().default(false),
  electronicSignatureAccepted: z.boolean().default(true),
});