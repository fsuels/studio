// src/lib/documents/us/international-trade-agreement/schema.ts
import { z } from 'zod';

export const InternationalTradeAgreementSchema = z.object({
  // Exporter Information
  exporterName: z.string().min(1, 'Exporter name is required'),
  exporterAddress: z.string().optional(),
  exporterCountry: z.string().optional(),
  exporterContact: z.string().optional(),
  exporterEmail: z.string().email().optional(),
  exporterLicense: z.string().optional(),
  exporterTaxID: z.string().optional(),
  
  // Importer Information
  importerName: z.string().min(1, 'Importer name is required'),
  importerAddress: z.string().optional(),
  importerCountry: z.string().optional(),
  importerContact: z.string().optional(),
  importerEmail: z.string().email().optional(),
  importerLicense: z.string().optional(),
  importerTaxID: z.string().optional(),
  
  // Product/Service Details
  productDescription: z.string().optional(),
  hsCode: z.string().optional(),
  productQuantity: z.string().optional(),
  productValue: z.string().optional(),
  productWeight: z.string().optional(),
  packagingSpecifications: z.string().optional(),
  qualityStandards: z.string().optional(),
  
  // Financial Terms
  totalValue: z.string().optional(),
  currency: z.string().optional(),
  exchangeRate: z.string().optional(),
  paymentTerms: z.enum(['cod', 'letter-of-credit', 'advance-payment', 'open-account', 'documentary-collection']).optional(),
  paymentSchedule: z.string().optional(),
  
  // Shipping and Delivery
  incoterms: z.enum(['exw', 'fca', 'fas', 'fob', 'cfr', 'cif', 'cpt', 'cip', 'dap', 'dpu', 'ddp']).optional(),
  shippingMethod: z.enum(['air', 'sea', 'land', 'rail', 'multimodal']).optional(),
  portOfLoading: z.string().optional(),
  portOfDischarge: z.string().optional(),
  deliveryDate: z.string().optional(),
  shippingDocuments: z.string().optional(),
  
  // Insurance
  insuranceRequired: z.boolean().default(true),
  insuranceProvider: z.string().optional(),
  insuranceCoverage: z.string().optional(),
  insuranceResponsibility: z.enum(['exporter', 'importer', 'shared']).default('exporter'),
  
  // Legal and Regulatory
  exportLicenses: z.boolean().default(false),
  importLicenses: z.boolean().default(false),
  customsDeclarations: z.boolean().default(true),
  certificatesOfOrigin: z.boolean().default(false),
  sanitaryPermits: z.boolean().default(false),
  
  // Quality Control
  inspectionRights: z.boolean().default(true),
  qualityAssurance: z.string().optional(),
  testing Requirements: z.string().optional(),
  rejectionRights: z.boolean().default(true),
  qualityClaims: z.string().optional(),
  
  // Documentation
  billOfLading: z.boolean().default(true),
  commercialInvoice: z.boolean().default(true),
  packingList: z.boolean().default(true),
  exportDeclaration: z.boolean().default(true),
  importDeclaration: z.boolean().default(true),
  
  // Taxes and Duties
  exportDuties: z.string().optional(),
  importDuties: z.string().optional(),
  valueAddedTax: z.string().optional(),
  otherTaxes: z.string().optional(),
  taxResponsibility: z.enum(['exporter', 'importer', 'shared']).default('importer'),
  
  // Force Majeure
  forceMajeureClause: z.boolean().default(true),
  forceMajeureEvents: z.string().optional(),
  forceMAjeureNotification: z.string().optional(),
  forceMajeureMitigation: z.string().optional(),
  
  // Dispute Resolution
  disputeResolution: z.enum(['arbitration', 'mediation', 'court', 'icc-arbitration']).default('arbitration'),
  arbitrationRules: z.string().optional(),
  arbitrationLocation: z.string().optional(),
  governingLaw: z.string().optional(),
  jurisdiction: z.string().optional(),
  
  // Intellectual Property
  ipOwnership: z.string().optional(),
  trademarkUsage: z.boolean().default(false),
  patentRights: z.boolean().default(false),
  confidentialInformation: z.boolean().default(true),
  
  // Warranties and Representations
  productWarranties: z.string().optional(),
  complianceRepresentations: z.boolean().default(true),
  exportCompliance: z.boolean().default(true),
  sanctionsCompliance: z.boolean().default(true),
  
  // Risk Management
  politicalRisk: z.string().optional(),
  exchangeRateRisk: z.string().optional(),
  transportationRisk: z.string().optional(),
  creditRisk: z.string().optional(),
  
  // Environmental and Safety
  environmentalCompliance: z.boolean().default(true),
  safetyStandards: z.string().optional(),
  hazardousMaterials: z.boolean().default(false),
  environmentalCertificates: z.boolean().default(false),
  
  // Technology Transfer
  technologyTransfer: z.boolean().default(false),
  technicalAssistance: z.boolean().default(false),
  trainingProvision: z.boolean().default(false),
  documentationProvision: z.boolean().default(false),
  
  // Anti-Corruption
  antiCorruptionCompliance: z.boolean().default(true),
  fcpaCompliance: z.boolean().default(true),
  localLawCompliance: z.boolean().default(true),
  ethicalStandards: z.boolean().default(true),
  
  // Performance Standards
  deliveryPerformance: z.string().optional(),
  qualityPerformance: z.string().optional(),
  serviceLevel: z.string().optional(),
  performancePenalties: z.string().optional(),
  
  // Communication
  communicationLanguage: z.enum(['english', 'spanish', 'french', 'german', 'chinese', 'other']).default('english'),
  notificationProcedures: z.string().optional(),
  reportingRequirements: z.string().optional(),
  emergencyContacts: z.string().optional(),
  
  // Termination
  terminationClauses: z.string().optional(),
  breachRemedies: z.string().optional(),
  noticePeriod: z.string().optional(),
  survivalClauses: z.string().optional(),
  
  // Amendment and Modification
  amendmentProcedures: z.string().optional(),
  modificationRequirements: z.string().optional(),
  changeOrderProcess: z.string().optional(),
  approvalHierarchy: z.string().optional(),
  
  // Representations and Warranties
  legalCapacity: z.boolean().default(true),
  authorizations: z.boolean().default(true),
  noConflicts: z.boolean().default(true),
  accurateInformation: z.boolean().default(true),
  
  // Signature Requirements
  exporterSignature: z.boolean().default(true),
  importerSignature: z.boolean().default(true),
  witnessSignatures: z.boolean().default(false),
  notarization: z.boolean().default(false),
  electronicSignature: z.boolean().default(true),
});