// src/lib/documents/us/bill-of-sale-general/schema.ts
import { z } from 'zod';

export const billOfSaleGeneralSchema = z.object({
  // Seller Information
  sellerName: z.string().min(1, 'Seller name is required'),
  sellerAddress: z.string().min(1, 'Seller address is required'),
  sellerPhone: z.string().optional(),
  sellerEmail: z.string().email().optional(),

  // Buyer Information
  buyerName: z.string().min(1, 'Buyer name is required'),
  buyerAddress: z.string().min(1, 'Buyer address is required'),
  buyerPhone: z.string().optional(),
  buyerEmail: z.string().email().optional(),

  // Item Details
  itemDescription: z.string().min(1, 'Item description is required'),
  itemCondition: z.enum(['new', 'used', 'refurbished', 'as_is']),
  itemCategory: z.enum([
    'electronics',
    'furniture',
    'appliances',
    'tools',
    'equipment',
    'collectibles',
    'jewelry',
    'artwork',
    'books',
    'clothing',
    'sports_equipment',
    'musical_instruments',
    'other',
  ]),
  serialNumber: z.string().optional(),
  modelNumber: z.string().optional(),
  brandManufacturer: z.string().optional(),
  yearMade: z.string().optional(),

  // Sale Details
  salePrice: z.string().min(1, 'Sale price is required'),
  currency: z.enum(['USD', 'EUR', 'CAD', 'GBP']).default('USD'),
  paymentMethod: z.enum([
    'cash',
    'check',
    'money_order',
    'electronic_transfer',
    'credit_card',
    'other',
  ]),
  paymentReceived: z.boolean(),
  saleDate: z.string().min(1, 'Sale date is required'),

  // Transfer Details
  deliveryMethod: z.enum([
    'immediate_pickup',
    'seller_delivery',
    'buyer_pickup',
    'shipping',
    'other',
  ]),
  deliveryDate: z.string().optional(),
  deliveryLocation: z.string().optional(),

  // Warranties and Condition
  asIsClause: z.boolean(),
  warrantyOffered: z.boolean(),
  warrantyPeriod: z.string().optional(),
  warrantyTerms: z.string().optional(),

  // Legal Aspects
  titleTransfer: z.boolean(),
  lienDisclosure: z.boolean(),
  lienDetails: z.string().optional(),

  // Additional Terms
  additionalTerms: z.string().optional(),
  specialConditions: z.string().optional(),

  // Signatures
  sellerSignature: z.string().min(1, 'Seller signature is required'),
  buyerSignature: z.string().min(1, 'Buyer signature is required'),
  witnessRequired: z.boolean(),
  witnessName: z.string().optional(),
  witnessSignature: z.string().optional(),
  notaryRequired: z.boolean(),
});
