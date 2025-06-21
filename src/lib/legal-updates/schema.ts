// src/lib/legal-updates/schema.ts
import { z } from 'zod';

export const LegalUpdateSourceSchema = z.object({
  id: z.string(),
  name: z.string(),
  jurisdiction: z.string(), // 'federal', 'california', 'texas', etc.
  type: z.enum(['legislative', 'regulatory', 'judicial', 'administrative']),
  rssUrl: z.string().url(),
  apiUrl: z.string().url().optional(),
  category: z.enum(['business', 'employment', 'real_estate', 'family', 'criminal', 'general']),
  priority: z.enum(['high', 'medium', 'low']),
  isActive: z.boolean(),
  lastFetched: z.date().optional(),
  fetchFrequency: z.enum(['hourly', 'daily', 'weekly']),
  createdAt: z.date(),
  updatedAt: z.date()
});

export const RawLegalUpdateSchema = z.object({
  id: z.string(),
  sourceId: z.string(),
  title: z.string(),
  description: z.string(),
  url: z.string().url(),
  publishedDate: z.date(),
  content: z.string().optional(),
  tags: z.array(z.string()),
  rawData: z.record(z.any()), // Original RSS/API data
  processedAt: z.date(),
  status: z.enum(['pending', 'processed', 'failed', 'ignored'])
});

export const ProcessedLegalUpdateSchema = z.object({
  id: z.string(),
  rawUpdateId: z.string(),
  sourceId: z.string(),
  title: z.string(),
  summary: z.string(), // AI-generated summary
  keyPoints: z.array(z.string()), // AI-extracted key points
  actionItems: z.array(z.object({
    description: z.string(),
    deadline: z.date().optional(),
    priority: z.enum(['urgent', 'high', 'medium', 'low']),
    category: z.string()
  })),
  affectedDocuments: z.array(z.string()), // Document types affected
  jurisdiction: z.string(),
  category: z.string(),
  urgency: z.enum(['critical', 'high', 'medium', 'low']),
  compliance: z.object({
    hasDeadline: z.boolean(),
    deadline: z.date().optional(),
    requiresAction: z.boolean(),
    riskLevel: z.enum(['high', 'medium', 'low'])
  }),
  metadata: z.object({
    aiModel: z.string(),
    processingTime: z.number(),
    confidence: z.number().min(0).max(1),
    tags: z.array(z.string()),
    relatedUpdates: z.array(z.string())
  }),
  publishedDate: z.date(),
  processedAt: z.date(),
  status: z.enum(['active', 'archived', 'superseded']),
  notificationStatus: z.object({
    emailSent: z.boolean(),
    emailSentAt: z.date().optional(),
    dashboardShown: z.boolean(),
    dashboardShownAt: z.date().optional()
  })
});

export const UserLegalUpdatePreferencesSchema = z.object({
  userId: z.string(),
  jurisdictions: z.array(z.string()), // ['federal', 'california', 'texas']
  categories: z.array(z.string()), // ['business', 'employment', 'real_estate']
  documentTypes: z.array(z.string()), // ['lease-agreement', 'employment-contract']
  urgencyThreshold: z.enum(['critical', 'high', 'medium', 'low']),
  emailNotifications: z.boolean(),
  dashboardNotifications: z.boolean(),
  frequency: z.enum(['immediate', 'daily', 'weekly']),
  lastNotified: z.date().optional(),
  createdAt: z.date(),
  updatedAt: z.date()
});

export const LegalUpdateAnalyticsSchema = z.object({
  id: z.string(),
  updateId: z.string(),
  userId: z.string().optional(),
  event: z.enum(['viewed', 'clicked', 'shared', 'dismissed', 'action_taken']),
  metadata: z.record(z.any()),
  timestamp: z.date(),
  sessionId: z.string().optional(),
  source: z.enum(['dashboard', 'email', 'push', 'api'])
});

// Type exports
export type LegalUpdateSource = z.infer<typeof LegalUpdateSourceSchema>;
export type RawLegalUpdate = z.infer<typeof RawLegalUpdateSchema>;
export type ProcessedLegalUpdate = z.infer<typeof ProcessedLegalUpdateSchema>;
export type UserLegalUpdatePreferences = z.infer<typeof UserLegalUpdatePreferencesSchema>;
export type LegalUpdateAnalytics = z.infer<typeof LegalUpdateAnalyticsSchema>;

// Firestore collection names
export const COLLECTIONS = {
  LEGAL_UPDATE_SOURCES: 'legal_update_sources',
  RAW_LEGAL_UPDATES: 'raw_legal_updates',
  PROCESSED_LEGAL_UPDATES: 'processed_legal_updates',
  USER_PREFERENCES: 'user_legal_update_preferences',
  ANALYTICS: 'legal_update_analytics'
} as const;

// Default legal update sources
export const DEFAULT_SOURCES: Omit<LegalUpdateSource, 'id' | 'createdAt' | 'updatedAt' | 'lastFetched'>[] = [
  {
    name: 'Federal Register',
    jurisdiction: 'federal',
    type: 'regulatory',
    rssUrl: 'https://www.federalregister.gov/articles.rss',
    category: 'general',
    priority: 'high',
    isActive: true,
    fetchFrequency: 'daily'
  },
  {
    name: 'California Legislative Information',
    jurisdiction: 'california',
    type: 'legislative',
    rssUrl: 'https://leginfo.legislature.ca.gov/faces/billSearchClient.xhtml',
    category: 'general',
    priority: 'high',
    isActive: true,
    fetchFrequency: 'daily'
  },
  {
    name: 'Texas Secretary of State',
    jurisdiction: 'texas',
    type: 'administrative',
    rssUrl: 'https://www.sos.state.tx.us/index.shtml',
    category: 'business',
    priority: 'medium',
    isActive: true,
    fetchFrequency: 'daily'
  },
  {
    name: 'US Supreme Court',
    jurisdiction: 'federal',
    type: 'judicial',
    rssUrl: 'https://www.supremecourt.gov/rss/cases.xml',
    category: 'general',
    priority: 'high',
    isActive: true,
    fetchFrequency: 'daily'
  },
  {
    name: 'SEC Investor Alerts',
    jurisdiction: 'federal',
    type: 'regulatory',
    rssUrl: 'https://www.sec.gov/rss/investor/alerts',
    category: 'business',
    priority: 'medium',
    isActive: true,
    fetchFrequency: 'daily'
  }
];

// Helper functions
export function createUpdateId(): string {
  return `update_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

export function createSourceId(): string {
  return `source_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

export function getUrgencyColor(urgency: ProcessedLegalUpdate['urgency']): string {
  switch (urgency) {
    case 'critical': return 'red';
    case 'high': return 'orange';
    case 'medium': return 'yellow';
    case 'low': return 'blue';
    default: return 'gray';
  }
}

export function isUpdateExpired(update: ProcessedLegalUpdate, daysThreshold = 30): boolean {
  const now = new Date();
  const updateDate = new Date(update.publishedDate);
  const daysDiff = (now.getTime() - updateDate.getTime()) / (1000 * 3600 * 24);
  return daysDiff > daysThreshold;
}