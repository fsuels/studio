// src/lib/documents/us/livestock-purchase-agreement/schema.ts
import { z } from 'zod';

export const LivestockPurchaseAgreementSchema = z.object({
  // Seller Information
  sellerName: z.string().min(1, 'Seller name is required'),
  sellerAddress: z.string().optional(),
  sellerPhone: z.string().optional(),
  sellerEmail: z.string().email().optional(),
  farmName: z.string().optional(),
  sellerLicense: z.string().optional(),

  // Buyer Information
  buyerName: z.string().min(1, 'Buyer name is required'),
  buyerAddress: z.string().optional(),
  buyerPhone: z.string().optional(),
  buyerEmail: z.string().email().optional(),
  buyerFarmName: z.string().optional(),
  buyerLicense: z.string().optional(),

  // Livestock Details
  animalType: z
    .enum([
      'cattle',
      'horses',
      'pigs',
      'sheep',
      'goats',
      'chickens',
      'ducks',
      'turkeys',
      'alpacas',
      'llamas',
    ])
    .default('cattle'),
  animalBreed: z.string().optional(),
  numberOfAnimals: z.string().optional(),
  animalAge: z.string().optional(),
  animalWeight: z.string().optional(),
  animalSex: z
    .enum(['male', 'female', 'mixed', 'steers', 'heifers'])
    .optional(),

  // Animal Identification
  earTagNumbers: z.string().optional(),
  brandMarks: z.string().optional(),
  tattooNumbers: z.string().optional(),
  microchipNumbers: z.string().optional(),
  registrationPapers: z.boolean().default(false),
  registrationNumbers: z.string().optional(),

  // Purchase Terms
  totalPurchasePrice: z.string().optional(),
  pricePerHead: z.string().optional(),
  pricePerPound: z.string().optional(),
  weightBasis: z
    .enum(['live-weight', 'dressed-weight', 'carcass-weight'])
    .default('live-weight'),
  paymentMethod: z
    .enum(['cash', 'check', 'bank-transfer', 'financing'])
    .default('cash'),

  // Payment Schedule
  downPayment: z.string().optional(),
  balancePayment: z.string().optional(),
  paymentDueDate: z.string().optional(),
  financeTerms: z.string().optional(),
  lateFee: z.string().optional(),

  // Delivery Terms
  deliveryDate: z.string().optional(),
  deliveryLocation: z.string().optional(),
  deliveryMethod: z
    .enum(['buyer-pickup', 'seller-delivery', 'third-party'])
    .default('buyer-pickup'),
  deliveryCharges: z.enum(['buyer', 'seller', 'shared']).default('buyer'),
  deliveryTime: z.string().optional(),

  // Health and Veterinary
  healthCertificate: z.boolean().default(true),
  veterinaryExam: z.boolean().default(true),
  vaccinations: z.boolean().default(true),
  vaccinationRecords: z.boolean().default(true),
  healthGuarantee: z.string().optional(),
  quarantinePeriod: z.string().optional(),

  // Breeding and Reproduction
  breedingHistory: z.string().optional(),
  pregnancyStatus: z.enum(['open', 'bred', 'unknown']).optional(),
  breedingDate: z.string().optional(),
  expectedCalvingDate: z.string().optional(),
  breedingRights: z.boolean().default(false),
  registrationTransfer: z.boolean().default(false),

  // Feed and Care
  feedTransition: z.string().optional(),
  feedingInstructions: z.string().optional(),
  medicationHistory: z.string().optional(),
  treatmentRecords: z.boolean().default(false),
  withdrawalPeriods: z.string().optional(),

  // Quality and Standards
  gradeStandard: z.string().optional(),
  qualityAssurance: z.string().optional(),
  weightRange: z.string().optional(),
  conditionScore: z.string().optional(),
  conformationStandards: z.string().optional(),

  // Risk and Warranties
  healthWarranty: z.boolean().default(true),
  soundnessWarranty: z.boolean().default(true),
  titleWarranty: z.boolean().default(true),
  lienDisclosure: z.boolean().default(true),
  mortalityRisk: z.enum(['buyer', 'seller', 'shared']).default('buyer'),

  // Transportation
  transportationArrangements: z.string().optional(),
  loadingFacilities: z.boolean().default(true),
  transportationInsurance: z.boolean().default(false),
  shrinkageAllowance: z.string().optional(),
  transportationTime: z.string().optional(),

  // Inspection Rights
  predeliveryInspection: z.boolean().default(true),
  inspectionPeriod: z.string().optional(),
  rejectionRights: z.boolean().default(true),
  replacementRights: z.boolean().default(false),
  reinspectionRights: z.boolean().default(true),

  // Market and Pricing
  marketPrice: z.string().optional(),
  priceAdjustments: z.boolean().default(false),
  weightDiscounts: z.string().optional(),
  qualityPremiums: z.string().optional(),
  marketConditions: z.string().optional(),

  // Regulatory Compliance
  animalWelfareCompliance: z.boolean().default(true),
  usdaRegulations: z.boolean().default(true),
  stateRegulations: z.boolean().default(true),
  transportationRegulations: z.boolean().default(true),
  recordKeeping: z.boolean().default(true),

  // Environmental Considerations
  organicCertification: z.boolean().default(false),
  pastureManagement: z.string().optional(),
  feedingPractices: z.string().optional(),
  antibioticFree: z.boolean().default(false),
  hormoneFree: z.boolean().default(false),

  // Default and Remedies
  defaultDefinition: z.string().optional(),
  remediesAvailable: z.string().optional(),
  noticePeriod: z.string().optional(),
  curePeriod: z.string().optional(),
  liquidatedDamages: z.string().optional(),

  // Special Conditions
  seasonalConditions: z.string().optional(),
  weatherClauses: z.boolean().default(true),
  forceMAjeure: z.boolean().default(true),
  emergencyProvisions: z.string().optional(),
  specialRequirements: z.string().optional(),

  // Transfer Documents
  billOfSale: z.boolean().default(true),
  transferOfTitle: z.boolean().default(true),
  registrationTransferDocuments: z.boolean().default(false),
  healthCertificates: z.boolean().default(true),
  transportationPermits: z.boolean().default(true),

  // Insurance
  mortalityInsurance: z.boolean().default(false),
  transitInsurance: z.boolean().default(false),
  liabilityInsurance: z.boolean().default(false),
  propertyInsurance: z.boolean().default(false),

  // Testing and Analysis
  geneticTesting: z.boolean().default(false),
  bloodTesting: z.boolean().default(false),
  pregnancyTesting: z.boolean().default(false),
  diseaTesting: z.boolean().default(true),
  testingCosts: z.enum(['buyer', 'seller', 'shared']).default('seller'),

  // Post-Sale Support
  technicalSupport: z.boolean().default(false),
  managementAdvice: z.boolean().default(false),
  followupContact: z.string().optional(),
  warrantyClaims: z.string().optional(),
  returnPolicy: z.string().optional(),

  // Dispute Resolution
  disputeResolution: z
    .enum(['negotiation', 'mediation', 'arbitration', 'litigation'])
    .default('mediation'),
  governingLaw: z.string().optional(),
  jurisdiction: z.string().optional(),

  // Signature Requirements
  sellerSignature: z.boolean().default(true),
  buyerSignature: z.boolean().default(true),
  witnessSignature: z.boolean().default(false),
  notarization: z.boolean().default(false),
  electronicSignature: z.boolean().default(true),
});
