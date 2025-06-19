// src/lib/documents/us/warehouse-agreement/schema.ts
import { z } from 'zod';

export const WarehouseAgreementSchema = z.object({
  // Warehouse Provider Information
  warehouseName: z.string().min(1, 'Warehouse provider name is required'),
  warehouseAddress: z.string().optional(),
  warehousePhone: z.string().optional(),
  warehouseEmail: z.string().email().optional(),
  warehouseLicense: z.string().optional(),
  facilitySize: z.string().optional(),
  
  // Client Information
  clientName: z.string().min(1, 'Client name is required'),
  clientAddress: z.string().optional(),
  clientPhone: z.string().optional(),
  clientEmail: z.string().email().optional(),
  clientType: z.enum(['manufacturer', 'retailer', 'distributor', 'ecommerce']).optional(),
  
  // Storage Services
  storageType: z.enum(['general', 'refrigerated', 'frozen', 'hazardous', 'pharmaceutical']).default('general'),
  storageSpace: z.string().optional(),
  palletPositions: z.string().optional(),
  rackingType: z.enum(['selective', 'drive-in', 'push-back', 'flow-rack']).optional(),
  temperatureControlled: z.boolean().default(false),
  temperatureRange: z.string().optional(),
  
  // Receiving Services
  receivingHours: z.string().optional(),
  appointmentRequired: z.boolean().default(true),
  receivingInspection: z.boolean().default(true),
  damageReporting: z.boolean().default(true),
  unloadingServices: z.boolean().default(true),
  crossDocking: z.boolean().default(false),
  
  // Inventory Management
  inventoryTracking: z.enum(['fifo', 'lifo', 'fefo', 'lot-tracking']).default('fifo'),
  lotControl: z.boolean().default(false),
  serialNumberTracking: z.boolean().default(false),
  expirationDateTracking: z.boolean().default(false),
  cycleCountingInterval: z.enum(['weekly', 'monthly', 'quarterly']).default('monthly'),
  
  // Fulfillment Services
  orderFulfillment: z.boolean().default(true),
  pickingServices: z.enum(['single-order', 'batch', 'zone', 'wave']).default('single-order'),
  packingServices: z.boolean().default(true),
  shippingServices: z.boolean().default(true),
  returnProcessing: z.boolean().default(false),
  kittingServices: z.boolean().default(false),
  
  // Technology Systems
  wmsSystem: z.boolean().default(true),
  ediCapability: z.boolean().default(true),
  apiIntegration: z.boolean().default(false),
  realTimeInventory: z.boolean().default(true),
  barcodeScanning: z.boolean().default(true),
  rfidCapability: z.boolean().default(false),
  
  // Pricing Structure
  storageRates: z.string().optional(),
  receivingRates: z.string().optional(),
  pickingRates: z.string().optional(),
  packingRates: z.string().optional(),
  handlingRates: z.string().optional(),
  minimumCharges: z.string().optional(),
  
  // Billing Terms
  billingCycle: z.enum(['weekly', 'monthly', 'quarterly']).default('monthly'),
  paymentTerms: z.enum(['net-15', 'net-30', 'net-45']).default('net-30'),
  lateFees: z.string().optional(),
  securityDeposit: z.string().optional(),
  
  // Product Specifications
  productTypes: z.string().optional(),
  hazardousMaterials: z.boolean().default(false),
  oversizeItems: z.boolean().default(false),
  highValueItems: z.boolean().default(false),
  perishableGoods: z.boolean().default(false),
  specialHandling: z.string().optional(),
  
  // Security Measures
  securitySystem: z.boolean().default(true),
  accessControl: z.boolean().default(true),
  surveillanceCameras: z.boolean().default(true),
  alarmSystem: z.boolean().default(true),
  securityGuards: z.boolean().default(false),
  backgroundChecks: z.boolean().default(true),
  
  // Insurance and Liability
  warehouseLiability: z.string().optional(),
  cargoInsurance: z.boolean().default(true),
  generalLiability: z.boolean().default(true),
  propertyInsurance: z.boolean().default(true),
  liabilitylimitations: z.string().optional(),
  
  // Quality Control
  qualityStandards: z.string().optional(),
  inspectionProcedures: z.boolean().default(true),
  temperatureMonitoring: z.boolean().default(false),
  pestControl: z.boolean().default(true),
  cleanlinessStandards: z.string().optional(),
  
  // Reporting and Communication
  inventoryReports: z.enum(['daily', 'weekly', 'monthly']).default('weekly'),
  activityReports: z.boolean().default(true),
  exceptionReports: z.boolean().default(true),
  customReports: z.boolean().default(false),
  reportingFormat: z.enum(['email', 'portal', 'edi']).default('email'),
  
  // Shipping and Transportation
  carrierRelations: z.boolean().default(true),
  shippingNegotiation: z.boolean().default(false),
  freightAudit: z.boolean().default(false),
  shippingLabels: z.boolean().default(true),
  trackingNumbers: z.boolean().default(true),
  
  // Compliance and Certifications
  foodSafety: z.boolean().default(false),
  gdpCompliance: z.boolean().default(false),
  isoCompliance: z.boolean().default(false),
  customsBonded: z.boolean().default(false),
  otherCertifications: z.string().optional(),
  
  // Seasonal and Capacity
  peakSeasonRates: z.string().optional(),
  capacityAllocation: z.string().optional(),
  scalabilityOptions: z.boolean().default(true),
  overflowFacilities: z.boolean().default(false),
  
  // Performance Standards
  accuracyStandards: z.string().optional(),
  timelyDelivery: z.string().optional(),
  damageRates: z.string().optional(),
  customerSatisfaction: z.string().optional(),
  performanceReviews: z.boolean().default(true),
  
  // Environmental
  environmentalCompliance: z.boolean().default(true),
  wasteManagement: z.string().optional(),
  recyclingPrograms: z.boolean().default(false),
  energyEfficiency: z.boolean().default(false),
  sustainabilityPractices: z.string().optional(),
  
  // Term and Termination
  contractTerm: z.string().optional(),
  renewalOptions: z.string().optional(),
  terminationNotice: z.string().optional(),
  terminationCauses: z.string().optional(),
  transitionAssistance: z.boolean().default(true),
  
  // Data and Confidentiality
  dataOwnership: z.enum(['client', 'warehouse', 'shared']).default('client'),
  confidentialityAgreement: z.boolean().default(true),
  dataBackup: z.boolean().default(true),
  dataRetention: z.string().optional(),
  
  // Dispute Resolution
  disputeResolution: z.enum(['negotiation', 'mediation', 'arbitration']).default('mediation'),
  governingLaw: z.string().optional(),
  jurisdiction: z.string().optional(),
  
  // Signature Requirements
  warehouseSignature: z.boolean().default(true),
  clientSignature: z.boolean().default(true),
  witnessSignature: z.boolean().default(false),
  notarization: z.boolean().default(false),
  electronicSignature: z.boolean().default(true),
});