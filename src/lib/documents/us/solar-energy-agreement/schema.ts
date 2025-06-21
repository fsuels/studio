// src/lib/documents/us/solar-energy-agreement/schema.ts
import { z } from 'zod';

export const SolarEnergyAgreementSchema = z.object({
  // Property Owner Information
  ownerName: z.string().min(1, 'Property owner name is required'),
  ownerAddress: z.string().optional(),
  ownerPhone: z.string().optional(),
  ownerEmail: z.string().email().optional(),
  propertyAddress: z.string().optional(),
  propertyType: z
    .enum(['residential', 'commercial', 'industrial', 'agricultural'])
    .default('residential'),

  // Solar Company Information
  installerName: z.string().min(1, 'Solar installer name is required'),
  installerAddress: z.string().optional(),
  installerPhone: z.string().optional(),
  installerEmail: z.string().email().optional(),
  installerLicense: z.string().optional(),
  installerCertification: z.string().optional(),

  // System Specifications
  systemSize: z.string().optional(),
  panelType: z
    .enum(['monocrystalline', 'polycrystalline', 'thin-film', 'bifacial'])
    .optional(),
  panelBrand: z.string().optional(),
  panelQuantity: z.string().optional(),
  inverterType: z
    .enum(['string', 'power-optimizer', 'microinverter', 'central'])
    .optional(),
  inverterBrand: z.string().optional(),

  // Installation Details
  installationType: z
    .enum(['rooftop', 'ground-mount', 'carport', 'tracker'])
    .default('rooftop'),
  roofType: z
    .enum(['asphalt-shingle', 'tile', 'metal', 'flat', 'membrane'])
    .optional(),
  roofCondition: z
    .enum(['excellent', 'good', 'fair', 'needs-repair'])
    .optional(),
  structuralAssessment: z.boolean().default(true),

  // Energy Production
  estimatedProduction: z.string().optional(),
  performanceGuarantee: z.string().optional(),
  degradationRate: z.string().optional(),
  energyOffsetPercentage: z.string().optional(),
  firstYearProduction: z.string().optional(),

  // Financial Terms
  systemCost: z.string().optional(),
  financingType: z.enum(['cash', 'loan', 'lease', 'ppa', 'pace']).optional(),
  downPayment: z.string().optional(),
  monthlyPayment: z.string().optional(),
  loanTerm: z.string().optional(),
  interestRate: z.string().optional(),

  // Power Purchase Agreement (PPA)
  ppaTerm: z.string().optional(),
  energyRate: z.string().optional(),
  escalationRate: z.string().optional(),
  buyoutOption: z.boolean().default(false),
  buyoutSchedule: z.string().optional(),

  // Solar Lease Terms
  leaseTerm: z.string().optional(),
  leasePayment: z.string().optional(),
  leaseEscalation: z.string().optional(),
  prepaidLease: z.boolean().default(false),
  endOfLeaseOptions: z.string().optional(),

  // Incentives and Rebates
  federalTaxCredit: z.boolean().default(true),
  stateTaxCredit: z.boolean().default(false),
  utilityRebates: z.string().optional(),
  localIncentives: z.string().optional(),
  netMetering: z.boolean().default(true),

  // Permits and Approvals
  buildingPermit: z.boolean().default(true),
  electricalPermit: z.boolean().default(true),
  utilityInterconnection: z.boolean().default(true),
  hoaApproval: z.boolean().default(false),
  structuralEngineerApproval: z.boolean().default(false),

  // Installation Timeline
  contractSigningDate: z.string().optional(),
  permitSubmissionDate: z.string().optional(),
  installationStartDate: z.string().optional(),
  installationCompletionDate: z.string().optional(),
  systemActivationDate: z.string().optional(),

  // Warranties
  equipmentWarranty: z.string().optional(),
  workmanshipWarranty: z.string().optional(),
  performanceWarranty: z.string().optional(),
  inverterWarranty: z.string().optional(),
  panelWarranty: z.string().optional(),

  // Maintenance and Monitoring
  maintenanceResponsibility: z
    .enum(['owner', 'installer', 'shared'])
    .default('owner'),
  monitoringSystem: z.boolean().default(true),
  cleaningRequirements: z.string().optional(),
  inspectionSchedule: z.string().optional(),
  repairResponse: z.string().optional(),

  // Insurance Requirements
  homeownersInsurance: z.boolean().default(true),
  installationInsurance: z.boolean().default(true),
  liabilityInsurance: z.boolean().default(true),
  equipmentInsurance: z.boolean().default(false),

  // Utility Interconnection
  utilityCompany: z.string().optional(),
  meterType: z
    .enum(['net-meter', 'bidirectional', 'production-meter'])
    .optional(),
  timeOfUseRates: z.boolean().default(false),
  gridTieRequirements: z.string().optional(),

  // System Ownership
  systemOwnership: z
    .enum(['customer', 'third-party', 'shared'])
    .default('customer'),
  ownershipTransfer: z.string().optional(),
  titleEncumbrance: z.boolean().default(false),
  propertyTaxImplications: z.string().optional(),

  // Performance Monitoring
  productionMonitoring: z.boolean().default(true),
  performanceReporting: z
    .enum(['monthly', 'quarterly', 'annually'])
    .default('monthly'),
  underperformanceRemedies: z.string().optional(),
  energyGuarantee: z.boolean().default(false),

  // Environmental Benefits
  carbonOffset: z.string().optional(),
  environmentalCertificates: z.boolean().default(false),
  sustainabilityGoals: z.string().optional(),
  greenBuildingCredits: z.boolean().default(false),

  // Technology Upgrades
  batteryStorage: z.boolean().default(false),
  batteryCapacity: z.string().optional(),
  smartInverters: z.boolean().default(false),
  energyManagementSystem: z.boolean().default(false),
  futureUpgrades: z.string().optional(),

  // Property Transfer
  transferability: z.boolean().default(true),
  transferRequirements: z.string().optional(),
  assumptionProcess: z.string().optional(),
  transferFees: z.string().optional(),

  // Removal and Decommissioning
  removalRequirements: z.string().optional(),
  decommissioningPlan: z.string().optional(),
  restorationObligations: z.string().optional(),
  recyclingPlan: z.string().optional(),

  // Force Majeure
  weatherEvents: z.boolean().default(true),
  naturalDisasters: z.boolean().default(true),
  governmentActions: z.boolean().default(true),
  utilityIssues: z.boolean().default(true),

  // Legal and Regulatory
  codeCompliance: z.boolean().default(true),
  safetyStandards: z.boolean().default(true),
  environmentalCompliance: z.boolean().default(true),
  changingRegulations: z.string().optional(),

  // Dispute Resolution
  disputeResolution: z
    .enum(['mediation', 'arbitration', 'court'])
    .default('mediation'),
  governingLaw: z.string().optional(),
  jurisdiction: z.string().optional(),

  // Signature Requirements
  ownerSignature: z.boolean().default(true),
  installerSignature: z.boolean().default(true),
  witnessSignature: z.boolean().default(false),
  notarization: z.boolean().default(false),
  electronicSignature: z.boolean().default(true),
});
