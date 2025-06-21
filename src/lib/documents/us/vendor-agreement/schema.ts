import { z } from 'zod';

export const vendorAgreementSchema = z.object({
  // Parties
  companyName: z.string().min(1, 'Company name is required'),
  companyAddress: z.string().min(1, 'Company address is required'),
  vendorName: z.string().min(1, 'Vendor name is required'),
  vendorAddress: z.string().min(1, 'Vendor address is required'),

  // Agreement Type
  agreementType: z.enum(['goods', 'services', 'both']),

  // Products/Services
  productsServices: z
    .array(
      z.object({
        name: z.string().min(1, 'Product/service name is required'),
        description: z.string().optional(),
        unitPrice: z.number().min(0).optional(),
        unit: z.string().optional(),
      }),
    )
    .min(1, 'At least one product or service is required'),

  // Terms
  contractTerm: z.string().min(1, 'Contract term is required'),
  renewalTerms: z.string().optional(),
  minimumOrder: z.string().optional(),

  // Payment Terms
  paymentTerms: z.object({
    paymentMethod: z.enum([
      'net-30',
      'net-60',
      'net-90',
      'cod',
      'prepaid',
      'other',
    ]),
    currency: z.string().default('USD'),
    lateFees: z.boolean().default(true),
    lateFeeRate: z.number().min(0).optional(),
  }),

  // Delivery Terms
  deliveryTerms: z.object({
    deliveryMethod: z.string().optional(),
    deliveryTime: z.string().optional(),
    shippingTerms: z.string().optional(),
    riskOfLoss: z
      .enum(['vendor', 'company', 'fob-origin', 'fob-destination'])
      .default('vendor'),
  }),

  // Quality and Standards
  qualityStandards: z.string().optional(),
  inspectionPeriod: z.string().default('5 business days'),
  returnPolicy: z.string().optional(),

  // Confidentiality
  confidentialityClause: z.boolean().default(true),

  // Warranties
  warranties: z.object({
    qualityWarranty: z.boolean().default(true),
    warrantyPeriod: z.string().default('1 year'),
    warrantyTerms: z.string().optional(),
  }),

  // Limitation of Liability
  limitationOfLiability: z.boolean().default(true),

  // Termination
  terminationClause: z.object({
    terminationNotice: z.string().default('30 days'),
    terminationForCause: z.boolean().default(true),
    terminationForConvenience: z.boolean().default(true),
  }),

  // Compliance
  complianceRequirements: z
    .array(z.string())
    .default([
      'All applicable laws and regulations',
      'Industry standards',
      'Safety requirements',
    ]),

  // Insurance
  insuranceRequired: z.boolean().default(false),
  insuranceRequirements: z.string().optional(),

  // Additional Terms
  additionalTerms: z.string().optional(),

  // Execution
  agreementDate: z.string().min(1, 'Agreement date is required'),
});
