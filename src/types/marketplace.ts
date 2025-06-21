// src/types/marketplace.ts
import type { z } from 'zod';
import type { Timestamp } from 'firebase/firestore';
import type { LegalDocument, LocalizedText } from './documents';

// ===================================================================
// TEMPLATE MARKETPLACE & VERSIONING TYPES
// ===================================================================

/**
 * Semantic version string (e.g., "1.2.3", "2.0.0-beta.1")
 */
export type SemanticVersion = string;

/**
 * Template version with full metadata and change tracking
 */
export interface TemplateVersion {
  id: string; // version-specific ID
  templateId: string; // parent template ID
  version: SemanticVersion; // e.g., "1.2.3"
  majorVersion: number;
  minorVersion: number;
  patchVersion: number;
  prerelease?: string; // e.g., "beta.1", "alpha.2"
  
  // Version metadata
  createdAt: Timestamp;
  createdBy: string; // creator userId
  status: 'draft' | 'published' | 'deprecated' | 'archived';
  
  // Template content (extends LegalDocument)
  document: LegalDocument;
  
  // Change tracking
  changelog: ChangelogEntry[];
  breaking: boolean; // true if this version has breaking changes
  compatibility: CompatibilityInfo;
  
  // Quality metrics
  validationResults?: ValidationResult[];
  testResults?: TestResult[];
  reviewStatus?: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  approvedAt?: Timestamp;
}

/**
 * Changelog entry for version history
 */
export interface ChangelogEntry {
  type: 'added' | 'changed' | 'deprecated' | 'removed' | 'fixed' | 'security';
  description: string;
  translations?: {
    [lang: string]: string;
  };
  affectedFields?: string[]; // which template fields were changed
  impact: 'major' | 'minor' | 'patch';
}

/**
 * Version compatibility information
 */
export interface CompatibilityInfo {
  backwardCompatible: boolean;
  forwardCompatible: boolean;
  minimumAppVersion?: string;
  deprecatedFeatures?: string[];
  migrationRequired: boolean;
  migrationGuide?: string;
}

/**
 * Template validation results
 */
export interface ValidationResult {
  rule: string;
  status: 'pass' | 'fail' | 'warning';
  message: string;
  severity: 'error' | 'warning' | 'info';
  timestamp: Timestamp;
}

/**
 * Template test results
 */
export interface TestResult {
  testName: string;
  status: 'pass' | 'fail';
  duration: number; // milliseconds
  error?: string;
  timestamp: Timestamp;
}

/**
 * Community marketplace template (extends base template system)
 */
export interface MarketplaceTemplate {
  id: string;
  
  // Template identity
  name: string;
  slug: string; // URL-friendly identifier
  description: string;
  translations?: {
    [lang: string]: LocalizedText;
  };
  
  // Creator information
  createdBy: string; // userId of template creator
  creatorProfile: CreatorProfile;
  maintainers: string[]; // additional userIds who can update
  
  // Template metadata
  category: string;
  tags: string[];
  jurisdiction: string;
  states?: string[] | 'all';
  languageSupport: string[];
  
  // Marketplace-specific fields
  visibility: 'public' | 'private' | 'unlisted';
  pricing: TemplatePricing;
  licenseType: 'free' | 'premium' | 'commercial';
  
  // Version management
  currentVersion: SemanticVersion;
  latestVersionId: string;
  versions: string[]; // array of version IDs
  
  // Community metrics
  stats: TemplateStats;
  ratings: RatingsSummary;
  
  // Marketplace metadata
  publishedAt?: Timestamp;
  lastUpdated: Timestamp;
  featured: boolean;
  verified: boolean; // official verification badge
  
  // Moderation
  moderationStatus: 'pending' | 'approved' | 'rejected' | 'flagged';
  moderatedBy?: string;
  moderatedAt?: Timestamp;
  flaggedReasons?: string[];
}

/**
 * Template creator profile
 */
export interface CreatorProfile {
  userId: string;
  displayName: string;
  bio?: string;
  avatar?: string;
  website?: string;
  verified: boolean;
  badges: CreatorBadge[];
  
  // Creator stats
  totalTemplates: number;
  totalDownloads: number;
  totalRevenue: number;
  averageRating: number;
  
  // Professional info (optional)
  credentials?: string[];
  specializations?: string[];
  yearsExperience?: number;
}

/**
 * Creator achievement badges
 */
export interface CreatorBadge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: Timestamp;
  category: 'quality' | 'popularity' | 'contribution' | 'expertise';
}

/**
 * Template pricing structure
 */
export interface TemplatePricing {
  type: 'free' | 'one-time' | 'subscription' | 'usage-based';
  basePrice: number; // in cents
  currency: string;
  
  // Subscription pricing (if applicable)
  subscriptionInterval?: 'month' | 'year';
  
  // Usage-based pricing (if applicable)
  pricePerUse?: number;
  freeUsageLimit?: number;
  
  // Revenue sharing
  creatorShare: number; // percentage (0-100)
  platformFee: number; // percentage (0-100)
  
  // Promotional pricing
  discountedPrice?: number;
  discountExpiry?: Timestamp;
  promoCode?: string;
}

/**
 * Template usage and engagement statistics
 */
export interface TemplateStats {
  totalDownloads: number;
  totalInstalls: number;
  totalRevenue: number;
  uniqueUsers: number;
  
  // Time-based metrics
  downloadsThisMonth: number;
  downloadsThisWeek: number;
  revenueThisMonth: number;
  
  // Quality metrics
  totalRatings: number;
  averageRating: number;
  completionRate: number; // percentage of users who complete documents
  
  // Engagement metrics
  forkCount: number; // how many times template was forked/customized
  favoriteCount: number;
  reportCount: number;
  
  // Version metrics
  versionCount: number;
  lastVersionDate: Timestamp;
  updateFrequency: number; // days between updates
}

/**
 * Ratings and reviews summary
 */
export interface RatingsSummary {
  averageRating: number;
  totalRatings: number;
  
  // Rating distribution
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  
  // Recent ratings trend
  recentTrend: 'improving' | 'declining' | 'stable';
  trendChange: number; // percentage change
}

/**
 * Individual template review/rating
 */
export interface TemplateReview {
  id: string;
  templateId: string;
  templateVersion: SemanticVersion;
  
  // Review content
  rating: 1 | 2 | 3 | 4 | 5;
  title?: string;
  comment?: string;
  pros?: string[];
  cons?: string[];
  
  // Reviewer information
  reviewerId: string;
  reviewerName?: string; // anonymized if preferred
  verified: boolean; // verified purchase/usage
  
  // Review metadata
  createdAt: Timestamp;
  updatedAt?: Timestamp;
  helpful: number; // helpful votes count
  notHelpful: number; // not helpful votes count
  
  // Moderation
  flagged: boolean;
  flaggedReasons?: string[];
  moderationStatus: 'approved' | 'pending' | 'hidden';
}

/**
 * Template installation/purchase record
 */
export interface TemplateInstallation {
  id: string;
  userId: string;
  templateId: string;
  templateVersion: SemanticVersion;
  
  // Installation details
  installedAt: Timestamp;
  installationType: 'free' | 'purchased' | 'trial' | 'subscription';
  
  // Payment information (if applicable)
  paymentId?: string;
  amountPaid?: number;
  currency?: string;
  
  // Usage tracking
  firstUsed?: Timestamp;
  lastUsed?: Timestamp;
  usageCount: number;
  documentsGenerated: number;
  
  // Installation status
  status: 'active' | 'expired' | 'cancelled' | 'refunded';
  expiresAt?: Timestamp;
  
  // User feedback
  satisfactionRating?: 1 | 2 | 3 | 4 | 5;
  recommendationLikelihood?: number; // 0-10 NPS score
}

/**
 * Template marketplace search/filter criteria
 */
export interface MarketplaceSearchFilters {
  query?: string;
  category?: string;
  tags?: string[];
  jurisdiction?: string;
  states?: string[];
  language?: string;
  priceRange?: {
    min: number;
    max: number;
  };
  rating?: {
    min: number;
  };
  createdBy?: string;
  verified?: boolean;
  featured?: boolean;
  sortBy?: 'relevance' | 'rating' | 'downloads' | 'price' | 'newest' | 'updated';
  sortOrder?: 'asc' | 'desc';
}

/**
 * Template marketplace search results
 */
export interface MarketplaceSearchResult {
  template: MarketplaceTemplate;
  currentVersion: TemplateVersion;
  relevanceScore?: number;
  matchedFields?: string[];
}

/**
 * Template fork/customization record
 */
export interface TemplateFork {
  id: string;
  originalTemplateId: string;
  originalVersion: SemanticVersion;
  forkedBy: string;
  forkedAt: Timestamp;
  
  // Fork details
  name: string;
  description?: string;
  visibility: 'private' | 'public';
  
  // Customizations made
  changes: ChangelogEntry[];
  customFields?: Record<string, any>;
  
  // Fork status
  status: 'draft' | 'published' | 'archived';
  parentSync: boolean; // whether fork stays synced with original
  lastSyncedVersion?: SemanticVersion;
}

/**
 * Template collection/bundle
 */
export interface TemplateCollection {
  id: string;
  name: string;
  description: string;
  createdBy: string;
  
  // Collection content
  templateIds: string[];
  templateVersions: { [templateId: string]: SemanticVersion };
  
  // Collection metadata
  category: string;
  tags: string[];
  featured: boolean;
  
  // Pricing (if different from individual templates)
  bundlePrice?: number;
  discount?: number; // percentage discount from individual prices
  
  // Collection stats
  downloadCount: number;
  rating: number;
  
  // Timestamps
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ===================================================================
// FIRESTORE COLLECTIONS STRUCTURE
// ===================================================================

/**
 * Firestore collections for Template Marketplace:
 * 
 * /marketplace-templates/{templateId}
 * /marketplace-templates/{templateId}/versions/{versionId}
 * /marketplace-templates/{templateId}/reviews/{reviewId}
 * /marketplace-templates/{templateId}/installations/{installationId}
 * /marketplace-templates/{templateId}/forks/{forkId}
 * 
 * /template-collections/{collectionId}
 * /creator-profiles/{userId}
 * /marketplace-stats/{templateId}
 * 
 * User-scoped:
 * /users/{userId}/installed-templates/{templateId}
 * /users/{userId}/template-purchases/{purchaseId}
 * /users/{userId}/created-templates/{templateId}
 * /users/{userId}/template-favorites/{templateId}
 * /users/{userId}/template-reviews/{reviewId}
 */

export type MarketplaceCollections = {
  'marketplace-templates': MarketplaceTemplate;
  'template-versions': TemplateVersion;
  'template-reviews': TemplateReview;
  'template-installations': TemplateInstallation;
  'template-forks': TemplateFork;
  'template-collections': TemplateCollection;
  'creator-profiles': CreatorProfile;
};