// src/lib/validation/marketplace-schemas.ts
import { z } from 'zod';

/**
 * Schema for localized text fields
 */
export const LocalizedTextSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  aliases: z.array(z.string()).optional(),
});

/**
 * Schema for creator profile
 */
export const CreatorProfileSchema = z.object({
  userId: z.string().min(1, 'User ID is required'),
  displayName: z.string().min(1, 'Display name is required'),
  bio: z.string().optional(),
  avatar: z.string().url().optional(),
  website: z.string().url().optional(),
  verified: z.boolean().default(false),
  badges: z.array(z.object({
    id: z.string(),
    name: z.string(),
    description: z.string(),
    icon: z.string(),
    earnedAt: z.any(), // Firestore Timestamp
    category: z.enum(['quality', 'popularity', 'contribution', 'expertise']),
  })).default([]),
  totalTemplates: z.number().min(0).default(0),
  totalDownloads: z.number().min(0).default(0),
  totalRevenue: z.number().min(0).default(0),
  averageRating: z.number().min(0).max(5).default(0),
  credentials: z.array(z.string()).optional(),
  specializations: z.array(z.string()).optional(),
  yearsExperience: z.number().min(0).optional(),
});

/**
 * Schema for template pricing
 */
export const TemplatePricingSchema = z.object({
  type: z.enum(['free', 'one-time', 'subscription', 'usage-based']),
  basePrice: z.number().min(0, 'Base price must be non-negative'),
  currency: z.string().min(1, 'Currency is required'),
  subscriptionInterval: z.enum(['month', 'year']).optional(),
  pricePerUse: z.number().min(0).optional(),
  freeUsageLimit: z.number().min(0).optional(),
  creatorShare: z.number().min(0).max(100, 'Creator share must be between 0-100'),
  platformFee: z.number().min(0).max(100, 'Platform fee must be between 0-100'),
  discountedPrice: z.number().min(0).optional(),
  discountExpiry: z.any().optional(), // Firestore Timestamp
  promoCode: z.string().optional(),
});

/**
 * Schema for template statistics
 */
export const TemplateStatsSchema = z.object({
  totalDownloads: z.number().min(0).default(0),
  totalInstalls: z.number().min(0).default(0),
  totalRevenue: z.number().min(0).default(0),
  uniqueUsers: z.number().min(0).default(0),
  downloadsThisMonth: z.number().min(0).default(0),
  downloadsThisWeek: z.number().min(0).default(0),
  revenueThisMonth: z.number().min(0).default(0),
  totalRatings: z.number().min(0).default(0),
  averageRating: z.number().min(0).max(5).default(0),
  completionRate: z.number().min(0).max(100).default(0),
  forkCount: z.number().min(0).default(0),
  favoriteCount: z.number().min(0).default(0),
  reportCount: z.number().min(0).default(0),
  versionCount: z.number().min(0).default(0),
  lastVersionDate: z.any(), // Firestore Timestamp
  updateFrequency: z.number().min(0).default(0),
});

/**
 * Schema for ratings summary
 */
export const RatingsSummarySchema = z.object({
  averageRating: z.number().min(0).max(5).default(0),
  totalRatings: z.number().min(0).default(0),
  ratingDistribution: z.object({
    5: z.number().min(0).default(0),
    4: z.number().min(0).default(0),
    3: z.number().min(0).default(0),
    2: z.number().min(0).default(0),
    1: z.number().min(0).default(0),
  }),
  recentTrend: z.enum(['improving', 'declining', 'stable']).default('stable'),
  trendChange: z.number().default(0),
});

/**
 * Schema for marketplace template
 */
export const MarketplaceTemplateSchema = z.object({
  id: z.string().min(1, 'Template ID is required'),
  
  // Template identity
  name: z.string().min(1, 'Template name is required'),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must be URL-friendly'),
  description: z.string().min(1, 'Description is required'),
  translations: z.record(z.string(), LocalizedTextSchema).optional(),

  // Creator information
  createdBy: z.string().min(1, 'Creator ID is required'),
  creatorProfile: CreatorProfileSchema,
  maintainers: z.array(z.string()).default([]),

  // Template metadata
  category: z.string().min(1, 'Category is required'),
  tags: z.array(z.string()).default([]),
  keywords: z.array(z.string()).default([]), // New keywords field
  jurisdiction: z.string().min(1, 'Jurisdiction is required'),
  states: z.union([z.array(z.string()), z.literal('all')]).optional(),
  languageSupport: z.array(z.string()).min(1, 'At least one language must be supported'),

  // Marketplace-specific fields
  visibility: z.enum(['public', 'private', 'unlisted']).default('public'),
  pricing: TemplatePricingSchema,
  licenseType: z.enum(['free', 'premium', 'commercial']).default('free'),

  // Version management
  currentVersion: z.string().min(1, 'Current version is required'),
  latestVersionId: z.string().min(1, 'Latest version ID is required'),
  versions: z.array(z.string()).default([]),

  // Community metrics
  stats: TemplateStatsSchema,
  ratings: RatingsSummarySchema,

  // Marketplace metadata
  publishedAt: z.any().optional(), // Firestore Timestamp
  lastUpdated: z.any(), // Firestore Timestamp
  featured: z.boolean().default(false),
  verified: z.boolean().default(false),

  // Moderation
  moderationStatus: z.enum(['pending', 'approved', 'rejected', 'flagged']).default('pending'),
  moderatedBy: z.string().optional(),
  moderatedAt: z.any().optional(), // Firestore Timestamp
  flaggedReasons: z.array(z.string()).optional(),
});

/**
 * Schema for changelog entry
 */
export const ChangelogEntrySchema = z.object({
  type: z.enum(['added', 'changed', 'deprecated', 'removed', 'fixed', 'security']),
  description: z.string().min(1, 'Description is required'),
  translations: z.record(z.string(), z.string()).optional(),
  affectedFields: z.array(z.string()).optional(),
  impact: z.enum(['major', 'minor', 'patch']),
});

/**
 * Schema for compatibility information
 */
export const CompatibilityInfoSchema = z.object({
  backwardCompatible: z.boolean(),
  forwardCompatible: z.boolean(),
  minimumAppVersion: z.string().optional(),
  deprecatedFeatures: z.array(z.string()).optional(),
  migrationRequired: z.boolean(),
  migrationGuide: z.string().optional(),
});

/**
 * Schema for validation result
 */
export const ValidationResultSchema = z.object({
  rule: z.string().min(1, 'Rule is required'),
  status: z.enum(['pass', 'fail', 'warning']),
  message: z.string().min(1, 'Message is required'),
  severity: z.enum(['error', 'warning', 'info']),
  timestamp: z.any(), // Firestore Timestamp
});

/**
 * Schema for test result
 */
export const TestResultSchema = z.object({
  testName: z.string().min(1, 'Test name is required'),
  status: z.enum(['pass', 'fail']),
  duration: z.number().min(0, 'Duration must be non-negative'),
  error: z.string().optional(),
  timestamp: z.any(), // Firestore Timestamp
});

/**
 * Schema for template version
 */
export const TemplateVersionSchema = z.object({
  id: z.string().min(1, 'Version ID is required'),
  templateId: z.string().min(1, 'Template ID is required'),
  version: z.string().min(1, 'Version is required').regex(/^\d+\.\d+\.\d+/, 'Version must be semantic version'),
  majorVersion: z.number().min(0),
  minorVersion: z.number().min(0),
  patchVersion: z.number().min(0),
  prerelease: z.string().optional(),

  // Version metadata
  createdAt: z.any(), // Firestore Timestamp
  createdBy: z.string().min(1, 'Creator ID is required'),
  status: z.enum(['draft', 'published', 'deprecated', 'archived']).default('draft'),

  // Template content (LegalDocument is validated separately)
  document: z.any(), // LegalDocument schema would be imported from documents.ts

  // Change tracking
  changelog: z.array(ChangelogEntrySchema).default([]),
  breaking: z.boolean().default(false),
  compatibility: CompatibilityInfoSchema,

  // Quality metrics
  validationResults: z.array(ValidationResultSchema).optional(),
  testResults: z.array(TestResultSchema).optional(),
  reviewStatus: z.enum(['pending', 'approved', 'rejected']).optional(),
  approvedBy: z.string().optional(),
  approvedAt: z.any().optional(), // Firestore Timestamp
});

/**
 * Schema for template review
 */
export const TemplateReviewSchema = z.object({
  id: z.string().min(1, 'Review ID is required'),
  templateId: z.string().min(1, 'Template ID is required'),
  templateVersion: z.string().min(1, 'Template version is required'),

  // Review content
  rating: z.number().min(1).max(5, 'Rating must be between 1-5'),
  title: z.string().optional(),
  comment: z.string().optional(),
  pros: z.array(z.string()).optional(),
  cons: z.array(z.string()).optional(),

  // Reviewer information
  reviewerId: z.string().min(1, 'Reviewer ID is required'),
  reviewerName: z.string().optional(),
  verified: z.boolean().default(false),

  // Review metadata
  createdAt: z.any(), // Firestore Timestamp
  updatedAt: z.any().optional(), // Firestore Timestamp
  helpful: z.number().min(0).default(0),
  notHelpful: z.number().min(0).default(0),

  // Moderation
  flagged: z.boolean().default(false),
  flaggedReasons: z.array(z.string()).optional(),
  moderationStatus: z.enum(['approved', 'pending', 'hidden']).default('pending'),
});

/**
 * Schema for template marketplace search filters
 */
export const MarketplaceSearchFiltersSchema = z.object({
  query: z.string().optional(),
  category: z.string().optional(),
  tags: z.array(z.string()).optional(),
  keywords: z.array(z.string()).optional(), // New keywords filter
  jurisdiction: z.string().optional(),
  states: z.array(z.string()).optional(),
  language: z.string().optional(),
  priceRange: z.object({
    min: z.number().min(0),
    max: z.number().min(0),
  }).optional(),
  rating: z.object({
    min: z.number().min(0).max(5),
  }).optional(),
  createdBy: z.string().optional(),
  verified: z.boolean().optional(),
  featured: z.boolean().optional(),
  sortBy: z.enum(['relevance', 'rating', 'downloads', 'price', 'newest', 'updated']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

// Export validation functions
export const validateMarketplaceTemplate = (data: unknown) => 
  MarketplaceTemplateSchema.parse(data);

export const validateTemplateVersion = (data: unknown) => 
  TemplateVersionSchema.parse(data);

export const validateTemplateReview = (data: unknown) => 
  TemplateReviewSchema.parse(data);

export const validateSearchFilters = (data: unknown) => 
  MarketplaceSearchFiltersSchema.parse(data);