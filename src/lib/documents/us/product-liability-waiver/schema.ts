// src/lib/documents/us/product-liability-waiver/schema.ts
import { z } from 'zod';

export const ProductLiabilityWaiverSchema = z.object({
  // Company Information
  companyName: z.string().min(1, 'Company name is required'),
  companyAddress: z.string().min(1, 'Company address is required'),
  companyPhone: z.string().optional(),
  companyEmail: z.string().email().optional(),
  companyType: z
    .enum(['manufacturer', 'retailer', 'distributor', 'wholesaler'])
    .default('manufacturer'),

  // Product Information
  productName: z.string().min(1, 'Product name is required'),
  productModel: z.string().optional(),
  productCategory: z.string().min(1, 'Product category is required'),
  productDescription: z.string().min(1, 'Product description is required'),
  serialNumber: z.string().optional(),
  manufacturingDate: z.string().optional(),

  // Customer Information Collection
  collectCustomerName: z.boolean().default(true),
  collectCustomerAddress: z.boolean().default(true),
  collectCustomerPhone: z.boolean().default(false),
  collectCustomerEmail: z.boolean().default(false),
  collectPurchaseDate: z.boolean().default(true),
  collectPurchaseLocation: z.boolean().default(false),

  // Product Usage
  intendedUse: z.string().min(1, 'Intended use description is required'),
  properUseInstructions: z.boolean().default(true),
  safetyWarnings: z.boolean().default(true),
  maintenanceRequirements: z.boolean().default(false),
  ageRestrictions: z.string().optional(),
  skillRequirements: z.string().optional(),

  // Known Risks and Hazards
  inherentRisks: z.array(z.string()).default([]),
  specificHazards: z.string().optional(),
  potentialInjuries: z.array(z.string()).default([]),
  environmentalRisks: z.string().optional(),
  materialSafetyRisks: z.boolean().default(false),

  // Waiver Scope
  waiverScope: z
    .enum([
      'manufacturing-defects',
      'design-defects',
      'warning-defects',
      'all-defects',
    ])
    .default('all-defects'),
  includeManufacturingClaims: z.boolean().default(true),
  includeDesignClaims: z.boolean().default(true),
  includeWarningClaims: z.boolean().default(true),
  includeNegligenceClaims: z.boolean().default(true),
  includeStrictLiabilityClaims: z.boolean().default(true),
  includeBreachOfWarrantyClaims: z.boolean().default(true),

  // Released Parties
  releasedParties: z.array(z.string()).default([]),
  includeManufacturer: z.boolean().default(true),
  includeRetailer: z.boolean().default(true),
  includeDistributor: z.boolean().default(false),
  includeSuppliers: z.boolean().default(false),
  includeComponentManufacturers: z.boolean().default(false),
  includeOfficersDirectors: z.boolean().default(true),
  includeEmployees: z.boolean().default(true),

  // Types of Claims Released
  personalInjuryClaims: z.boolean().default(true),
  propertyDamageClaims: z.boolean().default(true),
  economicLossClaims: z.boolean().default(false),
  consequentialDamages: z.boolean().default(false),
  incidentalDamages: z.boolean().default(false),
  punitiveDamages: z.boolean().default(false),
  wrongfulDeathClaims: z.boolean().default(false),

  // Product Warnings and Instructions
  warningsProvided: z.boolean().default(true),
  instructionsProvided: z.boolean().default(true),
  safetyLabelsProvided: z.boolean().default(true),
  userManualProvided: z.boolean().default(false),
  trainingProvided: z.boolean().default(false),
  demonstrationProvided: z.boolean().default(false),

  // User Responsibilities
  properUseAcknowledgment: z.boolean().default(true),
  followInstructionsAcknowledgment: z.boolean().default(true),
  maintenanceResponsibility: z.boolean().default(false),
  inspectionResponsibility: z.boolean().default(false),
  storageResponsibility: z.boolean().default(false),
  disposalResponsibility: z.boolean().default(false),

  // Modification and Alteration
  noModificationClause: z.boolean().default(true),
  noAlterationClause: z.boolean().default(true),
  voidsWarrantyClause: z.boolean().default(true),
  thirdPartyModifications: z.boolean().default(false),

  // Age and Capacity Requirements
  minimumAge: z.string().optional(),
  parentalConsent: z.boolean().default(false),
  guardianSupervision: z.boolean().default(false),
  competencyRequirement: z.boolean().default(true),

  // Medical and Physical Limitations
  physicalCapabilityWarning: z.boolean().default(false),
  medicalConditionWarning: z.boolean().default(false),
  pregnancyWarning: z.boolean().default(false),
  medicationWarning: z.boolean().default(false),
  allergiesWarning: z.boolean().default(false),

  // Product Testing and Quality
  qualityTestingCompleted: z.boolean().default(true),
  safetyTestingCompleted: z.boolean().default(true),
  industryStandardsCompliance: z.boolean().default(true),
  governmentRegulationsCompliance: z.boolean().default(true),
  certificationProvided: z.boolean().default(false),

  // Warranties and Guarantees
  warrantyDisclaimer: z.boolean().default(true),
  expressWarrantyLimitation: z.boolean().default(true),
  impliedWarrantyDisclaimer: z.boolean().default(true),
  merchantabilityDisclaimer: z.boolean().default(true),
  fitnessForPurposeDisclaimer: z.boolean().default(true),

  // Product Recall and Safety
  recallNotificationAgreement: z.boolean().default(false),
  safetyNotificationAgreement: z.boolean().default(false),
  voluntaryReturnAgreement: z.boolean().default(false),
  repairNotificationAgreement: z.boolean().default(false),

  // Assumption of Risk
  assumptionOfRisk: z.boolean().default(true),
  voluntaryUse: z.boolean().default(true),
  knowledgeOfRisks: z.boolean().default(true),
  acceptanceOfRisks: z.boolean().default(true),

  // Indemnification
  indemnificationClause: z.boolean().default(false),
  indemnifyAgainst: z.array(z.string()).default([]),
  attorneyFeesIndemnity: z.boolean().default(false),
  costsAndExpensesIndemnity: z.boolean().default(false),

  // Limitation of Liability
  liabilityLimitation: z.boolean().default(true),
  damageLimitation: z
    .enum([
      'purchase-price',
      'repair-cost',
      'replacement-cost',
      'specific-amount',
    ])
    .optional(),
  limitationAmount: z.string().optional(),
  noConsequentialDamages: z.boolean().default(true),
  noIncidentalDamages: z.boolean().default(true),

  // Reporting and Notice Requirements
  injuryReportingRequirement: z.boolean().default(false),
  defectReportingRequirement: z.boolean().default(false),
  notificationTimeframe: z.string().optional(),
  reportingMethod: z.string().optional(),

  // Legal and Procedural
  governingLaw: z.string().optional(),
  jurisdiction: z.string().optional(),
  venue: z.string().optional(),
  disputeResolution: z
    .enum(['litigation', 'arbitration', 'mediation'])
    .optional(),

  // Contract Terms
  severabilityClause: z.boolean().default(true),
  entireAgreement: z.boolean().default(true),
  modificationRequirements: z.boolean().default(true),
  bindingEffect: z.boolean().default(true),

  // Consumer Rights Notice
  consumerRightsNotice: z.boolean().default(false),
  lemonLawNotice: z.boolean().default(false),
  warrantyActNotice: z.boolean().default(false),
  stateSpecificNotices: z.boolean().default(false),

  // Third Party Claims
  thirdPartyClaimsRelease: z.boolean().default(false),
  componentSupplierRelease: z.boolean().default(false),
  retailerProtection: z.boolean().default(true),
  distributorProtection: z.boolean().default(false),

  // Product Categories
  productType: z
    .enum([
      'consumer-goods',
      'industrial-equipment',
      'medical-device',
      'automotive',
      'electronics',
      'food-beverage',
      'pharmaceutical',
      'cosmetic',
      'toy',
      'sporting-goods',
      'tools',
      'appliance',
      'furniture',
      'other',
    ])
    .default('consumer-goods'),
  riskLevel: z.enum(['low', 'medium', 'high']).default('medium'),

  // Documentation Requirements
  purchaseReceiptRequired: z.boolean().default(false),
  serialNumberVerification: z.boolean().default(false),
  photographicEvidence: z.boolean().default(false),
  witnessRequirement: z.boolean().default(false),

  // Signature Requirements
  requireCustomerSignature: z.boolean().default(true),
  requireParentGuardianSignature: z.boolean().default(false),
  requireWitnessSignature: z.boolean().default(false),
  requireNotarization: z.boolean().default(false),
  electronicSignatureAccepted: z.boolean().default(true),
});
