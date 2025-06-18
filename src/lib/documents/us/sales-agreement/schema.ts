// src/lib/documents/us/sales-agreement/schema.ts
import { z } from 'zod';

export const SalesAgreementSchema = z.object({
  // Parties
  sellerName: z.string().min(1, 'Seller name is required'),
  sellerAddress: z.string().min(1, 'Seller address is required'),
  sellerPhone: z.string().optional(),
  sellerEmail: z.string().email().optional(),
  
  buyerName: z.string().min(1, 'Buyer name is required'),
  buyerAddress: z.string().min(1, 'Buyer address is required'),
  buyerPhone: z.string().optional(),
  buyerEmail: z.string().email().optional(),
  
  // Product/Goods Information
  productDescription: z.string().min(1, 'Product description is required'),
  productCategory: z.enum(['electronics', 'furniture', 'vehicle', 'equipment', 'inventory', 'other']),
  quantity: z.number().positive('Quantity must be positive'),
  unitOfMeasure: z.string().optional(),
  productCondition: z.enum(['new', 'used', 'refurbished', 'as-is']),
  
  // Pricing
  unitPrice: z.number().positive('Unit price must be positive'),
  totalPrice: z.number().positive('Total price must be positive'),
  currency: z.string().default('USD'),
  taxesIncluded: z.boolean().default(false),
  salesTax: z.number().min(0, 'Sales tax cannot be negative').optional(),
  
  // Payment Terms
  paymentMethod: z.enum(['cash', 'check', 'wire-transfer', 'credit-card', 'financing']),
  paymentSchedule: z.enum(['full-upfront', 'deposit-and-balance', 'installments']),
  depositAmount: z.number().min(0, 'Deposit cannot be negative').optional(),
  balanceAmount: z.number().min(0, 'Balance cannot be negative').optional(),
  paymentDueDate: z.string().optional(),
  
  // Delivery Terms
  deliveryRequired: z.boolean().default(false),
  deliveryAddress: z.string().optional(),
  deliveryDate: z.string().optional(),
  deliveryMethod: z.string().optional(),
  deliveryCost: z.number().min(0, 'Delivery cost cannot be negative').optional(),
  riskOfLoss: z.enum(['seller', 'buyer', 'upon-delivery']).optional(),
  
  // Warranties and Guarantees
  warrantyOffered: z.boolean().default(false),
  warrantyPeriod: z.string().optional(),
  warrantyTerms: z.string().optional(),
  
  // Inspection and Acceptance
  inspectionPeriod: z.string().optional(),
  inspectionTerms: z.string().optional(),
  acceptanceCriteria: z.string().optional(),
  
  // Returns and Refunds
  returnPolicy: z.boolean().default(false),
  returnPeriod: z.string().optional(),
  returnConditions: z.string().optional(),
  refundPolicy: z.string().optional(),
  
  // Title and Ownership
  titleTransferDate: z.string().optional(),
  titleDocuments: z.string().optional(),
  lienInformation: z.string().optional(),
  
  // Additional Terms
  specialConditions: z.string().optional(),
  additionalTerms: z.string().optional(),
  
  // Signatures
  sellerSignatureDate: z.string().optional(),
  buyerSignatureDate: z.string().optional(),
});