// src/lib/documents/us/farm-lease-agreement/schema.ts
import { z } from 'zod';

export const FarmLeaseAgreementSchema = z.object({
  // Landlord Information
  landlordName: z.string().min(1, 'Landlord name is required'),
  landlordAddress: z.string().optional(),
  landlordPhone: z.string().optional(),
  landlordEmail: z.string().email().optional(),
  landlordType: z.enum(['individual', 'corporation', 'partnership', 'trust']).default('individual'),
  
  // Tenant Information
  tenantName: z.string().min(1, 'Tenant name is required'),
  tenantAddress: z.string().optional(),
  tenantPhone: z.string().optional(),
  tenantEmail: z.string().email().optional(),
  farmingExperience: z.string().optional(),
  tenantType: z.enum(['individual', 'corporation', 'partnership', 'family-farm']).default('individual'),
  
  // Property Description
  farmDescription: z.string().optional(),
  farmAddress: z.string().optional(),
  legalDescription: z.string().optional(),
  totalAcres: z.string().optional(),
  tillableAcres: z.string().optional(),
  pastureAcres: z.string().optional(),
  
  // Lease Terms
  leaseStartDate: z.string().optional(),
  leaseEndDate: z.string().optional(),
  leaseTerm: z.string().optional(),
  renewalOptions: z.string().optional(),
  automaticRenewal: z.boolean().default(false),
  renewalNotice: z.string().optional(),
  
  // Rent and Payments
  leaseType: z.enum(['cash-rent', 'crop-share', 'cash-plus-crop', 'flexible-cash']).default('cash-rent'),
  annualRent: z.string().optional(),
  rentPerAcre: z.string().optional(),
  cropSharePercentage: z.string().optional(),
  flexibleRentBase: z.string().optional(),
  paymentSchedule: z.enum(['annual', 'semi-annual', 'quarterly', 'harvest']).default('annual'),
  
  // Permitted Uses
  primaryUse: z.enum(['crop-production', 'livestock', 'mixed-farming', 'organic-farming', 'specialty-crops']).default('crop-production'),
  cropTypes: z.array(z.enum(['corn', 'soybeans', 'wheat', 'cotton', 'rice', 'vegetables', 'fruits', 'hay', 'pasture'])).default(['corn']),
  livestockTypes: z.array(z.enum(['cattle', 'pigs', 'sheep', 'goats', 'chickens', 'horses'])).optional(),
  organicCertification: z.boolean().default(false),
  
  // Buildings and Improvements
  farmBuildings: z.boolean().default(true),
  buildingsList: z.string().optional(),
  dwellingIncluded: z.boolean().default(false),
  improvementRights: z.boolean().default(false),
  buildingMaintenance: z.enum(['landlord', 'tenant', 'shared']).default('tenant'),
  
  // Equipment and Machinery
  equipmentIncluded: z.boolean().default(false),
  equipmentList: z.string().optional(),
  equipmentMaintenance: z.enum(['landlord', 'tenant', 'shared']).default('tenant'),
  irrigationSystems: z.boolean().default(false),
  irrigationMaintenance: z.enum(['landlord', 'tenant', 'shared']).default('tenant'),
  
  // Soil Conservation
  conservationPlan: z.boolean().default(true),
  soilTesting: z.boolean().default(true),
  erosionControl: z.boolean().default(true),
  crpCompliance: z.boolean().default(false),
  conservationPractices: z.string().optional(),
  
  // Fertilizer and Chemicals
  fertilizerResponsibility: z.enum(['landlord', 'tenant', 'shared']).default('tenant'),
  chemicalApplication: z.boolean().default(true),
  organicRestrictions: z.boolean().default(false),
  residueManagement: z.enum(['landlord', 'tenant', 'shared']).default('tenant'),
  
  // Water Rights
  waterRights: z.boolean().default(true),
  irrigationRights: z.boolean().default(false),
  wellUse: z.boolean().default(true),
  waterCosts: z.enum(['landlord', 'tenant', 'shared']).default('tenant'),
  drainageMaintenance: z.enum(['landlord', 'tenant', 'shared']).default('tenant'),
  
  // Environmental Compliance
  environmentalRegulations: z.boolean().default(true),
  pesticideRegulations: z.boolean().default(true),
  wetlandCompliance: z.boolean().default(true),
  environmentalLiability: z.enum(['landlord', 'tenant', 'shared']).default('tenant'),
  
  // Government Programs
  cropInsuranceParticipation: z.boolean().default(true),
  conservationPrograms: z.boolean().default(false),
  subsidyPrograms: z.boolean().default(false),
  programBenefits: z.enum(['landlord', 'tenant', 'shared']).default('tenant'),
  disasterPayments: z.enum(['landlord', 'tenant', 'shared']).default('tenant'),
  
  // Maintenance and Repairs
  routineMaintenance: z.enum(['landlord', 'tenant', 'shared']).default('tenant'),
  majorRepairs: z.enum(['landlord', 'tenant', 'shared']).default('landlord'),
  fenceMaintenance: z.enum(['landlord', 'tenant', 'shared']).default('tenant'),
  roadMaintenance: z.enum(['landlord', 'tenant', 'shared']).default('tenant'),
  
  // Utilities and Services
  electricityResponsibility: z.enum(['landlord', 'tenant', 'shared']).default('tenant'),
  gasUtilities: z.enum(['landlord', 'tenant', 'shared']).default('tenant'),
  telephoneService: z.enum(['landlord', 'tenant', 'shared']).default('tenant'),
  internetService: z.enum(['landlord', 'tenant', 'shared']).default('tenant'),
  
  // Insurance Requirements
  generalLiability: z.boolean().default(true),
  propertyInsurance: z.boolean().default(true),
  cropInsurance: z.boolean().default(true),
  equipmentInsurance: z.boolean().default(false),
  liabilityAmount: z.string().optional(),
  
  // Marketing and Sales
  cropMarketing: z.enum(['tenant', 'shared', 'landlord']).default('tenant'),
  storageFacilities: z.boolean().default(false),
  storageRental: z.string().optional(),
  elevatorChoices: z.boolean().default(true),
  priceRisk: z.enum(['tenant', 'shared', 'landlord']).default('tenant'),
  
  // Production Practices
  organicPractices: z.boolean().default(false),
  sustainablePractices: z.boolean().default(false),
  gmoRestrictions: z.boolean().default(false),
  rotationRequirements: z.string().optional(),
  yieldExpectations: z.string().optional(),
  
  // Access and Use Rights
  landlordAccess: z.boolean().default(true),
  huntingRights: z.enum(['landlord', 'tenant', 'shared']).default('landlord'),
  fishingRights: z.enum(['landlord', 'tenant', 'shared']).default('landlord'),
  recreationalUse: z.boolean().default(false),
  mineralRights: z.enum(['landlord', 'tenant', 'reserved']).default('landlord'),
  
  // Default and Termination
  defaultDefinition: z.string().optional(),
  noticeRequirements: z.string().optional(),
  curePeriod: z.string().optional(),
  terminationRights: z.boolean().default(true),
  holdoverTenancy: z.boolean().default(false),
  
  // Property Taxes
  propertyTaxes: z.enum(['landlord', 'tenant', 'shared']).default('landlord'),
  specialAssessments: z.enum(['landlord', 'tenant', 'shared']).default('landlord'),
  taxAppeals: z.enum(['landlord', 'tenant', 'shared']).default('landlord'),
  
  // Record Keeping
  recordKeeping: z.boolean().default(true),
  yieldRecords: z.boolean().default(true),
  expenseRecords: z.boolean().default(true),
  soilRecords: z.boolean().default(true),
  chemicalRecords: z.boolean().default(true),
  
  // Custom Farming
  customWorkAllowed: z.boolean().default(true),
  customWorkNotice: z.string().optional(),
  priorityUse: z.enum(['leased-land', 'custom-work']).default('leased-land'),
  competitionRestrictions: z.boolean().default(false),
  
  // Dispute Resolution
  disputeResolution: z.enum(['negotiation', 'mediation', 'arbitration', 'litigation']).default('mediation'),
  governingLaw: z.string().optional(),
  jurisdiction: z.string().optional(),
  
  // Special Provisions
  droughtProvisions: z.boolean().default(true),
  floodProvisions: z.boolean().default(true),
  hailDamageProvisions: z.boolean().default(true),
  disasterRelief: z.string().optional(),
  specialConditions: z.string().optional(),
  
  // Communication
  noticeMethod: z.enum(['mail', 'email', 'hand-delivery']).default('mail'),
  communicationSchedule: z.string().optional(),
  decisionMaking: z.enum(['tenant', 'consultation', 'joint']).default('consultation'),
  
  // Signature Requirements
  landlordSignature: z.boolean().default(true),
  tenantSignature: z.boolean().default(true),
  witnessSignature: z.boolean().default(false),
  notarization: z.boolean().default(true),
  electronicSignature: z.boolean().default(true),
});