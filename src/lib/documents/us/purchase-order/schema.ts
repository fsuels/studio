// src/lib/documents/us/purchase-order/schema.ts
import { z } from 'zod';

export const purchaseOrderSchema = z.object({
  // Purchase Order Header
  poNumber: z.string().min(1, 'Purchase order number is required'),
  poDate: z.string().min(1, 'Purchase order date is required'),
  requisitionNumber: z.string().optional(),
  priority: z.enum(['standard', 'urgent', 'rush']),

  // Buyer Information
  buyerCompany: z.string().min(1, 'Buyer company name is required'),
  buyerAddress: z.string().min(1, 'Buyer address is required'),
  buyerContact: z.string().min(1, 'Buyer contact person is required'),
  buyerPhone: z.string().min(1, 'Buyer phone is required'),
  buyerEmail: z.string().email('Valid email is required'),
  buyerDepartment: z.string().optional(),

  // Vendor/Supplier Information
  vendorCompany: z.string().min(1, 'Vendor company name is required'),
  vendorAddress: z.string().min(1, 'Vendor address is required'),
  vendorContact: z.string().optional(),
  vendorPhone: z.string().optional(),
  vendorEmail: z.string().email().optional(),
  vendorAccountNumber: z.string().optional(),

  // Shipping Information
  shipToCompany: z.string().min(1, 'Ship to company is required'),
  shipToAddress: z.string().min(1, 'Ship to address is required'),
  shipToContact: z.string().optional(),
  shipToPhone: z.string().optional(),
  shippingMethod: z.enum([
    'ground',
    'express',
    'overnight',
    'freight',
    'pickup',
    'standard',
  ]),
  requestedDeliveryDate: z
    .string()
    .min(1, 'Requested delivery date is required'),

  // Billing Information
  billToCompany: z.string().min(1, 'Bill to company is required'),
  billToAddress: z.string().min(1, 'Bill to address is required'),
  billToContact: z.string().optional(),
  billToPhone: z.string().optional(),

  // Line Items (as JSON string for single schema)
  lineItems: z.string().min(1, 'At least one line item is required'),

  // Totals
  subtotal: z.string().min(1, 'Subtotal is required'),
  taxRate: z.string().optional(),
  taxAmount: z.string().optional(),
  shippingCost: z.string().optional(),
  discountAmount: z.string().optional(),
  totalAmount: z.string().min(1, 'Total amount is required'),

  // Payment Terms
  paymentTerms: z.enum([
    'net_15',
    'net_30',
    'net_45',
    'net_60',
    'due_on_receipt',
    'cod',
    'prepaid',
    'other',
  ]),
  paymentTermsOther: z.string().optional(),
  paymentMethod: z.enum([
    'check',
    'ach',
    'wire_transfer',
    'credit_card',
    'purchase_card',
    'other',
  ]),

  // Delivery Terms
  deliveryTerms: z.enum([
    'fob_origin',
    'fob_destination',
    'cif',
    'exw',
    'dap',
    'other',
  ]),
  deliveryTermsOther: z.string().optional(),

  // Special Instructions
  specialInstructions: z.string().optional(),
  packingInstructions: z.string().optional(),
  qualityRequirements: z.string().optional(),

  // Approval Information
  approvedBy: z.string().min(1, 'Approver name is required'),
  approverTitle: z.string().optional(),
  approvalDate: z.string().min(1, 'Approval date is required'),
  budgetCode: z.string().optional(),
  projectCode: z.string().optional(),

  // Terms and Conditions
  warrantyRequirements: z.string().optional(),
  returnPolicy: z.string().optional(),
  cancellationPolicy: z.string().optional(),
  complianceRequirements: z.string().optional(),

  // Vendor Response
  vendorConfirmationRequired: z.boolean(),
  vendorResponseDeadline: z.string().optional(),

  // Contract Reference
  contractReference: z.string().optional(),
  agreementNumber: z.string().optional(),

  // Additional Fields
  currency: z.enum(['USD', 'EUR', 'CAD', 'GBP']).default('USD'),
  taxExempt: z.boolean(),
  taxExemptNumber: z.string().optional(),

  // Attachments
  attachments: z.string().optional(),
  technicalSpecifications: z.string().optional(),
  drawingsRequired: z.boolean(),

  // Tracking
  expedite: z.boolean(),
  expediteReason: z.string().optional(),
  followUpRequired: z.boolean(),
  followUpDate: z.string().optional(),

  // Notes
  internalNotes: z.string().optional(),
  vendorNotes: z.string().optional(),
});
