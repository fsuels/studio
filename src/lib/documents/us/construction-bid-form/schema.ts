// src/lib/documents/us/construction-bid-form/schema.ts
import { z } from 'zod';

export const constructionbidformSchema = z.object({
  // Project Information
  projectName: z.string().min(1, 'Project name is required'),
  projectNumber: z.string().optional(),
  projectLocation: z.string().min(1, 'Project location is required'),
  bidOpeningDate: z.string().min(1, 'Bid opening date is required'),
  bidOpeningTime: z.string().optional(),

  // Owner Information
  ownerName: z.string().min(1, 'Owner name is required'),
  ownerAddress: z.string().min(1, 'Owner address is required'),
  ownerPhone: z.string().optional(),
  ownerEmail: z.string().email().optional(),

  // Architect/Engineer Information
  architectName: z.string().optional(),
  architectAddress: z.string().optional(),
  architectPhone: z.string().optional(),

  // Bidder Information
  contractorName: z.string().min(1, 'Contractor name is required'),
  contractorAddress: z.string().min(1, 'Contractor address is required'),
  contractorPhone: z.string().min(1, 'Contractor phone is required'),
  contractorEmail: z.string().email().optional(),
  contractorLicense: z.string().min(1, 'Contractor license number is required'),

  // Bid Information
  bidAmount: z.string().min(1, 'Bid amount is required'),
  bidAmountWords: z.string().min(1, 'Bid amount in words is required'),
  bidValidityPeriod: z.string().optional(),
  proposedStartDate: z.string().optional(),
  proposedCompletionDate: z.string().optional(),

  // Base Bid Items
  baseBidItems: z
    .array(
      z.object({
        itemNumber: z.string(),
        description: z.string(),
        quantity: z.string(),
        unit: z.string(),
        unitPrice: z.string(),
        totalPrice: z.string(),
      }),
    )
    .default([]),

  // Alternate Bid Items
  alternateBids: z
    .array(
      z.object({
        alternateNumber: z.string(),
        description: z.string(),
        addDeduct: z.enum(['add', 'deduct']),
        amount: z.string(),
      }),
    )
    .default([]),

  // Unit Price Schedule
  unitPrices: z
    .array(
      z.object({
        itemNumber: z.string(),
        description: z.string(),
        unit: z.string(),
        estimatedQuantity: z.string(),
        unitPrice: z.string(),
        totalPrice: z.string(),
      }),
    )
    .default([]),

  // Allowances
  allowances: z
    .array(
      z.object({
        allowanceItem: z.string(),
        amount: z.string(),
        description: z.string(),
      }),
    )
    .default([]),

  // Bid Bond Information
  bidBondRequired: z.boolean().default(false),
  bidBondAmount: z.string().optional(),
  bidBondType: z
    .enum(['surety-bond', 'certified-check', 'cashiers-check', 'bid-bond'])
    .optional(),
  bidBondSuretyCompany: z.string().optional(),

  // Performance Bond
  performanceBondRequired: z.boolean().default(false),
  performanceBondAmount: z.string().optional(),
  performanceBondSuretyCompany: z.string().optional(),

  // Payment Bond
  paymentBondRequired: z.boolean().default(false),
  paymentBondAmount: z.string().optional(),
  paymentBondSuretyCompany: z.string().optional(),

  // Insurance Requirements
  generalLiabilityRequired: z.boolean().default(true),
  generalLiabilityAmount: z.string().optional(),
  workersCompRequired: z.boolean().default(true),
  vehicleInsuranceRequired: z.boolean().default(false),
  builderRiskRequired: z.boolean().default(false),

  // Experience and Qualifications
  yearsInBusiness: z.string().optional(),
  similarProjectsCompleted: z.string().optional(),
  currentWorkload: z.string().optional(),

  // Key Personnel
  projectManager: z.string().optional(),
  superintendent: z.string().optional(),
  keyPersonnel: z
    .array(
      z.object({
        name: z.string(),
        position: z.string(),
        experience: z.string(),
      }),
    )
    .default([]),

  // Subcontractors
  majorSubcontractors: z
    .array(
      z.object({
        trade: z.string(),
        companyName: z.string(),
        licenseNumber: z.string(),
        experience: z.string(),
      }),
    )
    .default([]),

  // References
  projectReferences: z
    .array(
      z.object({
        projectName: z.string(),
        ownerName: z.string(),
        ownerContact: z.string(),
        contractAmount: z.string(),
        completionDate: z.string(),
      }),
    )
    .default([]),

  // Financial Information
  financialStatement: z.boolean().default(false),
  bankingReferences: z
    .array(
      z.object({
        bankName: z.string(),
        accountType: z.string(),
        contactPerson: z.string(),
        phoneNumber: z.string(),
      }),
    )
    .default([]),

  // Equipment and Resources
  equipmentOwned: z.array(z.string()).default([]),
  equipmentLeased: z.array(z.string()).default([]),

  // Schedule Information
  proposedSchedule: z.string().optional(),
  criticalPath: z.string().optional(),
  weatherDays: z.string().optional(),

  // Materials and Suppliers
  majorMaterialSuppliers: z
    .array(
      z.object({
        material: z.string(),
        supplierName: z.string(),
        location: z.string(),
      }),
    )
    .default([]),

  // Safety Information
  safetyRecord: z.string().optional(),
  safetyProgram: z.boolean().default(false),
  oshaRecordable: z.string().optional(),

  // Quality Assurance
  qualityControlPlan: z.boolean().default(false),
  qualityCertifications: z.array(z.string()).default([]),

  // Environmental Compliance
  environmentalCompliance: z.boolean().default(true),
  environmentalCertifications: z.array(z.string()).default([]),

  // Special Requirements
  specialRequirements: z.array(z.string()).default([]),
  technicalSpecifications: z.string().optional(),

  // Bid Conditions
  bidConditions: z.array(z.string()).default([]),
  clarifications: z.array(z.string()).default([]),
  exceptions: z.array(z.string()).default([]),

  // Acknowledgments
  acknowledgeAddenda: z.boolean().default(false),
  addendaNumbers: z.array(z.string()).default([]),
  receivedDocuments: z.array(z.string()).default([]),

  // Withdrawal and Modification
  bidWithdrawalRights: z.boolean().default(true),
  bidModificationRights: z.boolean().default(false),

  // Award Conditions
  acceptAwardConditions: z.boolean().default(true),
  contractExecutionTime: z.string().optional(),

  // Signatures and Certification
  bidderSignature: z.boolean().default(true),
  bidderTitle: z.string().optional(),
  witnessSignature: z.boolean().default(false),
  notarization: z.boolean().default(false),
  certificationStatement: z.boolean().default(true),
});
