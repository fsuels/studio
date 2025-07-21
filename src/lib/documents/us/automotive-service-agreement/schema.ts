// src/lib/documents/us/automotive-service-agreement/schema.ts
import { z } from 'zod';

export const AutomotiveServiceAgreementSchema = z.object({
  // Service Provider Information
  serviceProviderName: z.string().min(1, 'Service provider name is required'),
  businessName: z.string().optional(),
  businessAddress: z.string().optional(),
  businessPhone: z.string().optional(),
  businessEmail: z.string().email().optional(),
  businessLicense: z.string().optional(),

  // Customer Information
  customerName: z.string().min(1, 'Customer name is required'),
  customerAddress: z.string().optional(),
  customerPhone: z.string().optional(),
  customerEmail: z.string().email().optional(),

  // Vehicle Information
  vehicleMake: z.string().optional(),
  vehicleModel: z.string().optional(),
  vehicleYear: z.string().optional(),
  vehicleVin: z.string().optional(),
  vehicleMileage: z.string().optional(),
  vehicleColor: z.string().optional(),
  licensePlate: z.string().optional(),

  // Service Details
  serviceType: z
    .enum([
      'repair',
      'maintenance',
      'inspection',
      'diagnostic',
      'comprehensive',
    ])
    .default('repair'),
  serviceDescription: z.string().optional(),
  partsRequired: z.string().optional(),
  laborRequired: z.string().optional(),
  estimatedTime: z.string().optional(),

  // Pricing
  laborRate: z.string().optional(),
  partsMarkup: z.string().optional(),
  diagnosticFee: z.string().optional(),
  totalEstimate: z.string().optional(),
  hourlyRate: z.string().optional(),
  minimumCharge: z.string().optional(),

  // Parts and Materials
  partsSupplier: z
    .enum(['oem', 'aftermarket', 'refurbished', 'customer-supplied'])
    .default('oem'),
  partsWarranty: z.string().optional(),
  partsReturnPolicy: z.string().optional(),
  customerProvidedParts: z.boolean().default(false),
  partsApprovalRequired: z.boolean().default(true),

  // Labor and Workmanship
  laborWarranty: z.string().optional(),
  workmanshipGuarantee: z.string().optional(),
  qualifiedTechnicians: z.boolean().default(true),
  certificationRequired: z.boolean().default(false),

  // Timeline
  estimatedStartDate: z.string().optional(),
  estimatedCompletionDate: z.string().optional(),
  workHours: z.string().optional(),
  rushJobFee: z.string().optional(),
  delayNotification: z.boolean().default(true),

  // Authorization
  workAuthorization: z.boolean().default(true),
  costLimitAuthorization: z.string().optional(),
  additionalWorkApproval: z.boolean().default(true),
  emergencyContactAuth: z.boolean().default(false),

  // Diagnostic Services
  diagnosticIncluded: z.boolean().default(false),
  diagnosticCost: z.string().optional(),
  diagnosticTimeline: z.string().optional(),
  diagnosticReport: z.boolean().default(true),
  troubleshootingFee: z.string().optional(),

  // Quality Assurance
  inspectionRequired: z.boolean().default(true),
  testDriveIncluded: z.boolean().default(false),
  qualityChecklist: z.boolean().default(false),
  customerApproval: z.boolean().default(true),
  correctiveActionPolicy: z.string().optional(),

  // Environmental and Disposal
  hazardousWasteDisposal: z.boolean().default(true),
  recyclingProgram: z.boolean().default(false),
  environmentalCompliance: z.boolean().default(true),
  fluidDisposal: z.boolean().default(true),

  // Storage and Liability
  vehicleStorage: z.string().optional(),
  storageFee: z.string().optional(),
  storageLimit: z.string().optional(),
  vehicleLiability: z.string().optional(),
  personalPropertyLiability: z.string().optional(),

  // Payment Terms
  paymentMethod: z
    .enum(['cash', 'check', 'credit-card', 'financing'])
    .default('credit-card'),
  paymentTerms: z
    .enum([
      'due-on-completion',
      'net-30',
      'deposit-required',
      'progress-payments',
    ])
    .default('due-on-completion'),
  depositRequired: z.string().optional(),
  lateFee: z.string().optional(),
  financingAvailable: z.boolean().default(false),

  // Warranty Terms
  warrantyPeriod: z.string().optional(),
  warrantyMileage: z.string().optional(),
  warrantyTransferable: z.boolean().default(false),
  warrantyLimitations: z.string().optional(),
  extendedWarrantyAvailable: z.boolean().default(false),

  // Customer Responsibilities
  accurateInformation: z.boolean().default(true),
  vehicleAccessibility: z.boolean().default(true),
  paymentResponsibility: z.boolean().default(true),
  vehicleConditionDisclosure: z.boolean().default(true),

  // Limitations and Disclaimers
  preexistingDamage: z.string().optional(),
  wearAndTearDisclaimer: z.boolean().default(true),
  hiddenDamagePolicy: z.string().optional(),
  modificationDisclaimer: z.boolean().default(true),

  // Insurance
  garageLiability: z.boolean().default(true),
  customerInsuranceRequired: z.boolean().default(false),
  insuranceClaims: z.string().optional(),
  uninsuredVehiclePolicy: z.string().optional(),

  // Dispute Resolution
  disputeResolution: z
    .enum(['discussion', 'mediation', 'arbitration', 'court'])
    .default('discussion'),
  warrantyClaims: z.string().optional(),
  governingLaw: z.string().optional(),
  jurisdiction: z.string().optional(),

  // Special Conditions
  emergencyRepairs: z.boolean().default(false),
  afterHoursService: z.boolean().default(false),
  mobileService: z.boolean().default(false),
  pickupDelivery: z.boolean().default(false),
  rentalCarProvision: z.boolean().default(false),

  // Documentation
  workOrderRequired: z.boolean().default(true),
  beforeAfterPhotos: z.boolean().default(false),
  repairInstructions: z.boolean().default(true),
  maintenanceRecords: z.boolean().default(true),

  // Signature Requirements
  requireServiceProviderSignature: z.boolean().default(true),
  requireCustomerSignature: z.boolean().default(true),
  witnessRequired: z.boolean().default(false),
  notarizationRequired: z.boolean().default(false),
  electronicSignatureAccepted: z.boolean().default(true),
});
