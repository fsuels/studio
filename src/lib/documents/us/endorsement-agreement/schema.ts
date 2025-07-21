import { z } from 'zod';

export const endorsementAgreementSchema = z.object({
  // Parties
  companyName: z.string().min(1, 'Company name is required'),
  companyAddress: z.string().min(1, 'Company address is required'),
  endorserName: z.string().min(1, 'Endorser name is required'),
  endorserAddress: z.string().min(1, 'Endorser address is required'),

  // Product/Service Details
  productService: z
    .string()
    .min(1, 'Product or service being endorsed is required'),
  brandName: z.string().min(1, 'Brand name is required'),

  // Endorsement Details
  endorsementType: z
    .array(
      z.enum([
        'social-media',
        'television',
        'print',
        'radio',
        'events',
        'product-placement',
        'testimonial',
      ]),
    )
    .min(1, 'At least one endorsement type is required'),

  // Social Media Requirements
  socialMediaPlatforms: z.array(z.string()).optional(),
  minimumPosts: z.number().min(0).optional(),
  postingSchedule: z.string().optional(),
  hashtags: z.array(z.string()).optional(),

  // Content Requirements
  contentApproval: z.boolean().default(true),
  contentDeadlines: z.string().optional(),
  imageRights: z.boolean().default(true),
  videoRights: z.boolean().default(true),

  // Compensation
  compensationType: z.enum([
    'fixed-fee',
    'per-post',
    'commission',
    'product-only',
    'hybrid',
  ]),
  totalCompensation: z.number().min(0).optional(),
  paymentSchedule: z.string().min(1, 'Payment schedule is required'),
  productCompensation: z.string().optional(),

  // Performance Metrics
  performanceRequirements: z
    .object({
      minimumReach: z.number().min(0).optional(),
      minimumEngagement: z.number().min(0).optional(),
      trackingMethods: z.array(z.string()).optional(),
    })
    .optional(),

  // Term and Exclusivity
  agreementTerm: z.string().min(1, 'Agreement term is required'),
  exclusivityClause: z.boolean().default(false),
  exclusivityScope: z.string().optional(),
  competitorRestrictions: z.array(z.string()).optional(),

  // Compliance and Disclosure
  ftcDisclosure: z.boolean().default(true),
  disclosureLanguage: z.string().default('#ad #sponsored'),

  // Rights and Usage
  usageRights: z.object({
    duration: z.string().default('Term of agreement'),
    territory: z.string().default('Worldwide'),
    mediaTypes: z.array(z.string()).default(['Digital', 'Print', 'Broadcast']),
  }),

  // Termination
  terminationClause: z.boolean().default(true),
  terminationNotice: z.string().default('30 days'),

  // Additional Terms
  additionalTerms: z.string().optional(),

  // Execution
  agreementDate: z.string().min(1, 'Agreement date is required'),
});
