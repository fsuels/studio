// src/lib/documents/us/auto-repair-agreement/schema.ts
import { z } from 'zod';

export const AutoRepairAgreementSchema = z.object({
  // Shop Information
  shopName: z.string().min(1, 'Shop name is required'),
  shopAddress: z.string().min(1, 'Shop address is required'),
  shopPhone: z.string().min(1, 'Shop phone is required'),
  shopEmail: z.string().email().optional(),
  shopLicense: z.string().optional(),

  // Customer Information
  customerName: z.string().min(1, 'Customer name is required'),
  customerAddress: z.string().min(1, 'Customer address is required'),
  customerPhone: z.string().min(1, 'Customer phone is required'),
  customerEmail: z.string().email().optional(),

  // Vehicle Information
  vehicleYear: z.string().min(1, 'Vehicle year is required'),
  vehicleMake: z.string().min(1, 'Vehicle make is required'),
  vehicleModel: z.string().min(1, 'Vehicle model is required'),
  vehicleVin: z.string().optional(),
  vehicleLicense: z.string().optional(),
  vehicleMileage: z.string().optional(),
  vehicleColor: z.string().optional(),

  // Repair Details
  repairDescription: z.string().min(1, 'Repair description is required'),
  problemDescription: z.string().optional(),
  diagnosticRequired: z.boolean().default(true),
  estimatedCost: z.string().optional(),
  maximumCost: z.string().optional(),

  // Authorization
  repairAuthorization: z.boolean().default(true),
  additionalWorkAuthorization: z.boolean().default(false),
  costApprovalRequired: z.boolean().default(true),
  approvalThreshold: z.string().optional(),

  // Parts and Labor
  partsWarranty: z.string().optional(),
  laborWarranty: z.string().optional(),
  usedPartsAcceptable: z.boolean().default(false),
  aftermarketPartsAcceptable: z.boolean().default(true),
  oemPartsRequired: z.boolean().default(false),

  // Timeline
  estimatedCompletionDate: z.string().optional(),
  workStartDate: z.string().optional(),
  urgentRepair: z.boolean().default(false),

  // Payment Terms
  paymentMethod: z
    .enum(['cash', 'check', 'credit-card', 'financing'])
    .default('credit-card'),
  depositRequired: z.boolean().default(false),
  depositAmount: z.string().optional(),
  paymentDue: z.enum(['completion', 'pickup', 'net-30']).default('pickup'),

  // Liability and Insurance
  liabilityLimitation: z.boolean().default(true),
  storageResponsibility: z.boolean().default(true),
  abandonedVehiclePolicy: z.string().optional(),

  // Signature Requirements
  requireShopSignature: z.boolean().default(true),
  requireCustomerSignature: z.boolean().default(true),
  witnessRequired: z.boolean().default(false),
  notarizationRequired: z.boolean().default(false),
  electronicSignatureAccepted: z.boolean().default(true),
});
