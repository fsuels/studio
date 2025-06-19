// src/lib/documents/us/sale-of-goods/schema.ts
import { z } from 'zod';

export const saleOfGoodsSchema = z.object({
  // Seller Information
  sellerName: z.string().min(1, "Seller name is required"),
  sellerAddress: z.string().min(1, "Seller address is required"),
  sellerType: z.enum(["individual", "corporation", "llc", "partnership"]),
  sellerPhone: z.string().optional(),
  sellerEmail: z.string().email().optional(),

  // Buyer Information  
  buyerName: z.string().min(1, "Buyer name is required"),
  buyerAddress: z.string().min(1, "Buyer address is required"),
  buyerType: z.enum(["individual", "corporation", "llc", "partnership"]),
  buyerPhone: z.string().optional(),
  buyerEmail: z.string().email().optional(),

  // Goods Description
  goodsDescription: z.string().min(1, "Goods description is required"),
  goodsQuantity: z.string().min(1, "Quantity is required"),
  goodsUnit: z.string().min(1, "Unit of measurement is required"),
  goodsCondition: z.enum(["new", "used", "refurbished", "as_is"]),
  goodsCategory: z.enum([
    "equipment",
    "inventory", 
    "materials",
    "vehicles",
    "electronics",
    "furniture",
    "clothing",
    "other"
  ]),
  
  // Identification Numbers
  serialNumbers: z.string().optional(),
  modelNumbers: z.string().optional(),
  partNumbers: z.string().optional(),

  // Price and Payment
  totalPrice: z.string().min(1, "Total price is required"),
  currency: z.enum(["USD", "EUR", "CAD", "GBP"]).default("USD"),
  paymentMethod: z.enum([
    "cash",
    "check", 
    "wire_transfer",
    "credit_card",
    "financing",
    "installments"
  ]),
  paymentTerms: z.string().min(1, "Payment terms are required"),
  downPayment: z.string().optional(),
  balanceDue: z.string().optional(),
  
  // Delivery Terms
  deliveryMethod: z.enum([
    "pickup",
    "seller_delivery",
    "shipping",
    "third_party_carrier"
  ]),
  deliveryLocation: z.string().min(1, "Delivery location is required"),
  deliveryDate: z.string().min(1, "Delivery date is required"),
  deliveryCost: z.string().optional(),
  riskOfLoss: z.enum(["seller", "buyer", "delivery"]),

  // Inspection and Acceptance
  inspectionPeriod: z.string().optional(),
  inspectionRights: z.boolean(),
  acceptanceCriteria: z.string().optional(),
  rejectionRights: z.boolean(),

  // Warranties
  warrantyOffered: z.boolean(),
  warrantyType: z.enum(["express", "implied", "limited", "none"]).optional(),
  warrantyPeriod: z.string().optional(),
  warrantyTerms: z.string().optional(),
  asIsClause: z.boolean(),

  // Title and Ownership
  titleTransfer: z.enum(["delivery", "payment", "acceptance"]),
  titleWarranty: z.boolean(),
  lienDisclosure: z.boolean(),
  encumbranceDisclosure: z.string().optional(),

  // Risk Allocation
  insuranceResponsibility: z.enum(["seller", "buyer", "shared"]),
  damageBeforeDelivery: z.enum(["seller_risk", "buyer_risk"]),
  forcePrejudicante: z.boolean(),

  // Remedies and Default
  defaultRemedies: z.string().optional(),
  specificPerformance: z.boolean(),
  liquidatedDamages: z.string().optional(),
  limitationOfLiability: z.boolean(),

  // Return and Exchange
  returnPolicy: z.boolean(),
  returnPeriod: z.string().optional(),
  returnConditions: z.string().optional(),
  restockingFee: z.string().optional(),

  // Taxes and Fees
  salesTaxResponsibility: z.enum(["seller", "buyer"]),
  otherTaxes: z.string().optional(),
  additionalFees: z.string().optional(),

  // Compliance and Permits
  licensesRequired: z.boolean(),
  permitsRequired: z.boolean(),
  complianceRequirements: z.string().optional(),

  // Confidentiality
  confidentialityClause: z.boolean(),
  nonDisclosureTerms: z.string().optional(),

  // Governing Law
  governingState: z.string().min(1, "Governing state is required"),
  disputeResolution: z.enum(["courts", "arbitration", "mediation"]),
  jurisdiction: z.string().optional(),

  // Contract Terms
  contractDate: z.string().min(1, "Contract date is required"),
  effectiveDate: z.string().min(1, "Effective date is required"),
  expirationDate: z.string().optional(),

  // Modification and Assignment
  modificationRequirements: z.enum(["written", "verbal", "any"]),
  assignmentRights: z.boolean(),
  assignmentRestrictions: z.string().optional(),

  // Additional Terms
  additionalTerms: z.string().optional(),
  specialConditions: z.string().optional(),
  attachments: z.string().optional(),

  // Signatures
  sellerSignature: z.string().min(1, "Seller signature is required"),
  buyerSignature: z.string().min(1, "Buyer signature is required"),
  witnessRequired: z.boolean(),
  witnessName: z.string().optional(),
  witnessSignature: z.string().optional(),
  notaryRequired: z.boolean(),
});