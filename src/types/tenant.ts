export interface Tenant {
  id: string;
  slug: string; // URL-friendly identifier
  name: string;
  description?: string;

  // Contact Information
  ownerUserId: string;
  contactEmail: string;
  contactPhone?: string;

  // Branding
  branding: TenantBranding;

  // Domain Configuration
  domains: TenantDomain[];

  // Subscription & Billing
  subscription: TenantSubscription;

  // Features & Limits
  features: TenantFeatures;
  limits: TenantLimits;

  // Status & Timestamps
  status: 'active' | 'inactive' | 'suspended' | 'trial';
  createdAt: string;
  updatedAt: string;
  trialEndsAt?: string;

  // Settings
  settings: TenantSettings;
}

export interface TenantBranding {
  logoUrl?: string;
  faviconUrl?: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor?: string;
  fontFamily?: string;
  customCss?: string;

  // Company Details
  companyName: string;
  tagline?: string;
  footerText?: string;

  // Legal
  termsUrl?: string;
  privacyUrl?: string;
  supportEmail?: string;
}

export interface TenantDomain {
  id: string;
  domain: string;
  isPrimary: boolean;
  isCustom: boolean; // false for subdomains like lawfirm.123legaldoc.com
  status: 'pending' | 'active' | 'failed' | 'expired';
  sslStatus: 'pending' | 'active' | 'failed' | 'expired';
  cloudflareZoneId?: string;
  verificationToken?: string;
  createdAt: string;
  verifiedAt?: string;
}

export interface TenantSubscription {
  plan: 'trial' | 'starter' | 'professional' | 'enterprise';
  status: 'active' | 'canceled' | 'past_due' | 'unpaid';
  currentPeriodStart: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;

  // Usage-based billing
  monthlyDocumentQuota: number;
  documentsUsedThisMonth: number;
  ovageRate: number; // per document over quota
}

export interface TenantFeatures {
  customDomain: boolean;
  whiteLabel: boolean;
  apiAccess: boolean;
  advancedBranding: boolean;
  chatSupport: boolean;
  auditTrail: boolean;
  ssoIntegration: boolean;
  bulkOperations: boolean;
  customTemplates: boolean;
  advancedAnalytics: boolean;
}

export interface TenantLimits {
  maxUsers: number;
  maxDocumentsPerMonth: number;
  maxStorageGB: number;
  maxCustomTemplates: number;
  maxInviteTokens: number;
}

export interface TenantSettings {
  allowPublicSignup: boolean;
  requireEmailVerification: boolean;
  documentRetentionDays: number;
  defaultUserRole: 'viewer' | 'editor' | 'admin';
  enableGuestAccess: boolean;
  enableDocumentSharing: boolean;
  enableComments: boolean;
  timezone: string;
  dateFormat: string;

  // Email notifications
  emailNotifications: {
    newUserSignup: boolean;
    documentCreated: boolean;
    documentShared: boolean;
    documentCompleted: boolean;
    systemUpdates: boolean;
  };

  // Security
  security: {
    enforcePasswordPolicy: boolean;
    sessionTimeoutMinutes: number;
    ipWhitelist?: string[];
    twoFactorRequired: boolean;
  };
}

// Tenant User Management
export interface TenantUser {
  id: string;
  tenantId: string;
  userId: string; // Reference to main user table
  role: TenantUserRole;
  status: 'active' | 'invited' | 'suspended';
  permissions: TenantPermission[];
  invitedAt?: string;
  joinedAt?: string;
  invitedBy?: string;
  lastActiveAt?: string;
}

export type TenantUserRole =
  | 'admin'
  | 'manager'
  | 'editor'
  | 'viewer'
  | 'guest';

export type TenantPermission =
  | 'tenant.manage_settings'
  | 'tenant.manage_users'
  | 'tenant.manage_billing'
  | 'tenant.manage_branding'
  | 'tenant.view_analytics'
  | 'documents.create'
  | 'documents.edit_all'
  | 'documents.view_all'
  | 'documents.delete'
  | 'documents.share'
  | 'templates.create'
  | 'templates.edit'
  | 'templates.delete';

// Invitation System
export interface TenantInvite {
  id: string;
  tenantId: string;
  token: string; // JWT token for secure invites
  email: string;
  role: TenantUserRole;
  permissions: TenantPermission[];

  // Invitation Details
  invitedBy: string; // User ID of inviter
  inviteMessage?: string;
  expiresAt: string;
  acceptedAt?: string;

  // Status
  status: 'pending' | 'accepted' | 'expired' | 'revoked';
  createdAt: string;

  // Access Control
  restrictToIpRange?: string;
  maxUses?: number;
  usesCount: number;
}

// Chat Room for Tenant
export interface TenantChatRoom {
  id: string;
  tenantId: string;
  documentId?: string; // Optional: room can be document-specific
  name: string;
  description?: string;
  type: 'general' | 'document' | 'support' | 'private';

  // Stream Chat Integration
  streamChannelId: string;
  streamChannelType: 'team' | 'messaging';

  // Members
  members: string[]; // User IDs
  admins: string[]; // User IDs with admin rights

  // Settings
  isPrivate: boolean;
  allowGuestAccess: boolean;
  retentionDays?: number;

  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

// Audit Trail for Tenant
export interface TenantAuditEvent {
  id: string;
  tenantId: string;
  userId: string;
  userEmail: string;
  userRole: TenantUserRole;

  // Event Details
  action: TenantAuditAction;
  resourceType:
    | 'document'
    | 'user'
    | 'tenant'
    | 'template'
    | 'invite'
    | 'billing';
  resourceId?: string;

  // Context
  description: string;
  metadata?: Record<string, any>;
  ipAddress: string;
  userAgent: string;
  timestamp: string;

  // Risk Assessment
  riskLevel: 'low' | 'medium' | 'high';
  complianceFlags?: string[];
}

export type TenantAuditAction =
  | 'tenant.created'
  | 'tenant.updated'
  | 'tenant.suspended'
  | 'tenant.reactivated'
  | 'user.invited'
  | 'user.added'
  | 'user.removed'
  | 'user.role_changed'
  | 'document.created'
  | 'document.edited'
  | 'document.shared'
  | 'document.deleted'
  | 'template.created'
  | 'template.modified'
  | 'billing.subscription_changed'
  | 'billing.payment_failed'
  | 'settings.updated'
  | 'branding.updated'
  | 'domain.added'
  | 'domain.verified'
  | 'domain.removed';

// Analytics for Tenant
export interface TenantAnalytics {
  tenantId: string;
  period: 'day' | 'week' | 'month' | 'quarter' | 'year';
  startDate: string;
  endDate: string;

  // Usage Metrics
  metrics: {
    documentsCreated: number;
    documentsCompleted: number;
    documentsShared: number;
    activeUsers: number;
    newUsers: number;
    totalUsers: number;

    // Engagement
    avgSessionDuration: number;
    avgDocumentsPerUser: number;
    userRetentionRate: number;

    // Performance
    avgDocumentCompletionTime: number;
    documentSuccessRate: number;
    errorRate: number;
  };

  // Top Documents
  topDocuments: Array<{
    documentType: string;
    count: number;
    completionRate: number;
  }>;

  // User Activity
  userActivity: Array<{
    userId: string;
    documentsCreated: number;
    lastActive: string;
  }>;

  generatedAt: string;
}

// Default tenant configurations
export const DEFAULT_TENANT_FEATURES: TenantFeatures = {
  customDomain: false,
  whiteLabel: true,
  apiAccess: false,
  advancedBranding: false,
  chatSupport: true,
  auditTrail: true,
  ssoIntegration: false,
  bulkOperations: false,
  customTemplates: false,
  advancedAnalytics: false,
};

export const DEFAULT_TENANT_LIMITS: TenantLimits = {
  maxUsers: 10,
  maxDocumentsPerMonth: 100,
  maxStorageGB: 5,
  maxCustomTemplates: 5,
  maxInviteTokens: 50,
};

export const TENANT_PLANS = {
  trial: {
    name: 'Trial',
    price: 0,
    features: {
      ...DEFAULT_TENANT_FEATURES,
      customDomain: false,
      advancedBranding: false,
    },
    limits: { ...DEFAULT_TENANT_LIMITS, maxUsers: 3, maxDocumentsPerMonth: 10 },
  },
  starter: {
    name: 'Starter',
    price: 299,
    features: { ...DEFAULT_TENANT_FEATURES, customDomain: true },
    limits: {
      ...DEFAULT_TENANT_LIMITS,
      maxUsers: 25,
      maxDocumentsPerMonth: 500,
    },
  },
  professional: {
    name: 'Professional',
    price: 799,
    features: {
      ...DEFAULT_TENANT_FEATURES,
      customDomain: true,
      advancedBranding: true,
      apiAccess: true,
    },
    limits: {
      ...DEFAULT_TENANT_LIMITS,
      maxUsers: 100,
      maxDocumentsPerMonth: 2000,
      maxStorageGB: 25,
    },
  },
  enterprise: {
    name: 'Enterprise',
    price: 1999,
    features: {
      ...DEFAULT_TENANT_FEATURES,
      customDomain: true,
      advancedBranding: true,
      apiAccess: true,
      ssoIntegration: true,
      bulkOperations: true,
      customTemplates: true,
      advancedAnalytics: true,
    },
    limits: {
      ...DEFAULT_TENANT_LIMITS,
      maxUsers: -1, // unlimited
      maxDocumentsPerMonth: -1, // unlimited
      maxStorageGB: 100,
      maxCustomTemplates: -1, // unlimited
    },
  },
} as const;

// Role Permissions
export const TENANT_ROLE_PERMISSIONS: Record<
  TenantUserRole,
  TenantPermission[]
> = {
  admin: [
    'tenant.manage_settings',
    'tenant.manage_users',
    'tenant.manage_billing',
    'tenant.manage_branding',
    'tenant.view_analytics',
    'documents.create',
    'documents.edit_all',
    'documents.view_all',
    'documents.delete',
    'documents.share',
    'templates.create',
    'templates.edit',
    'templates.delete',
  ],
  manager: [
    'tenant.manage_users',
    'tenant.view_analytics',
    'documents.create',
    'documents.edit_all',
    'documents.view_all',
    'documents.share',
    'templates.create',
    'templates.edit',
  ],
  editor: ['documents.create', 'documents.view_all', 'documents.share'],
  viewer: ['documents.view_all'],
  guest: ['documents.view_all'],
};
