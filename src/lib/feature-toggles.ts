// Role-based feature toggle system for 123LegalDoc
import {
  UserRole,
  Permission,
  FeatureToggle,
  FeatureContext,
  UserWithRole,
  RoleAuditEvent,
} from '@/types/roles';

export interface FeatureToggleService {
  isFeatureEnabled(featureKey: string, context: FeatureContext): boolean;
  getEnabledFeatures(context: FeatureContext): string[];
  toggleFeature(
    featureKey: string,
    enabled: boolean,
    adminId: string,
  ): Promise<void>;
  createFeature(feature: Omit<FeatureToggle, 'key'>): Promise<FeatureToggle>;
  updateFeature(
    featureKey: string,
    updates: Partial<FeatureToggle>,
  ): Promise<FeatureToggle>;
  getFeatureUsage(featureKey: string): Promise<FeatureUsageStats>;
}

export interface FeatureUsageStats {
  featureKey: string;
  totalUsers: number;
  activeUsers: number;
  usageByRole: Record<UserRole, number>;
  lastUsed: string;
  errorRate: number;
}

class RoleBasedFeatureToggleService implements FeatureToggleService {
  private features: Map<string, FeatureToggle> = new Map();
  private usageStats: Map<string, FeatureUsageStats> = new Map();

  constructor() {
    this.initializeDefaultFeatures();
  }

  private initializeDefaultFeatures() {
    const defaultFeatures: FeatureToggle[] = [
      {
        key: 'admin_dashboard',
        name: 'Admin Dashboard',
        description: 'Full administrative dashboard access',
        enabled: true,
        rolloutStrategy: {
          type: 'roles',
          roles: ['super_admin', 'admin'],
        },
        owner: 'Platform Team',
        tags: ['admin', 'core'],
      },
      {
        key: 'customer_360',
        name: 'Customer 360 View',
        description: 'Complete customer timeline and analytics',
        enabled: true,
        rolloutStrategy: {
          type: 'roles',
          roles: ['super_admin', 'admin', 'support'],
        },
        owner: 'Customer Success',
        tags: ['analytics', 'support'],
      },
      {
        key: 'user_impersonation',
        name: 'User Impersonation',
        description: 'Login as another user for support',
        enabled: true,
        rolloutStrategy: {
          type: 'roles',
          roles: ['super_admin', 'admin', 'support'],
        },
        owner: 'Support Team',
        tags: ['support', 'security'],
      },
      {
        key: 'advanced_analytics',
        name: 'Advanced Analytics',
        description: 'Revenue and compliance analytics',
        enabled: true,
        rolloutStrategy: {
          type: 'roles',
          roles: ['super_admin', 'admin'],
        },
        owner: 'Analytics Team',
        tags: ['analytics', 'financial'],
      },
      {
        key: 'feature_management',
        name: 'Feature Toggle Management',
        description: 'Manage feature flags and rollouts',
        enabled: true,
        rolloutStrategy: {
          type: 'roles',
          roles: ['super_admin', 'admin'],
        },
        owner: 'Engineering',
        tags: ['admin', 'engineering'],
      },
      {
        key: 'qa_tools',
        name: 'QA Testing Tools',
        description: 'Quality assurance and testing utilities',
        enabled: true,
        rolloutStrategy: {
          type: 'roles',
          roles: ['super_admin', 'admin', 'qa'],
        },
        owner: 'QA Team',
        tags: ['qa', 'testing'],
      },
      {
        key: 'debug_mode',
        name: 'Debug Mode',
        description: 'Enhanced debugging and development tools',
        enabled: true,
        rolloutStrategy: {
          type: 'roles',
          roles: ['super_admin', 'qa'],
        },
        owner: 'Engineering',
        tags: ['development', 'debugging'],
      },
      {
        key: 'ai_chat_suggestion',
        name: 'AI Chat Suggestions',
        description: 'AI-powered document suggestions and chat',
        enabled: true,
        rolloutStrategy: {
          type: 'percentage',
          percentage: 50,
        },
        owner: 'AI Team',
        tags: ['ai', 'user_experience'],
      },
      {
        key: 'wizard_v4',
        name: 'Document Wizard V4',
        description: 'Next generation document creation wizard',
        enabled: true,
        rolloutStrategy: {
          type: 'percentage',
          percentage: 25,
        },
        owner: 'UX Team',
        tags: ['wizard', 'user_experience'],
      },
      {
        key: 'premium_templates',
        name: 'Premium Document Templates',
        description: 'Access to premium legal document templates',
        enabled: true,
        rolloutStrategy: {
          type: 'roles',
          roles: ['user'],
        },
        owner: 'Content Team',
        tags: ['templates', 'premium'],
      },
      {
        key: 'bulk_document_generation',
        name: 'Bulk Document Generation',
        description: 'Generate multiple documents in batch',
        enabled: false,
        rolloutStrategy: {
          type: 'roles',
          roles: ['user'],
        },
        owner: 'Product Team',
        tags: ['documents', 'productivity'],
      },
      {
        key: 'advanced_customization',
        name: 'Advanced Document Customization',
        description: 'Advanced editing and customization options',
        enabled: true,
        rolloutStrategy: {
          type: 'percentage',
          percentage: 75,
        },
        owner: 'Product Team',
        tags: ['customization', 'advanced'],
      },
      {
        key: 'compliance_monitoring',
        name: 'Real-time Compliance Monitoring',
        description: 'Live compliance tracking and alerts',
        enabled: true,
        rolloutStrategy: {
          type: 'roles',
          roles: ['super_admin', 'admin'],
        },
        owner: 'Compliance Team',
        tags: ['compliance', 'monitoring'],
      },
      {
        key: 'fraud_detection',
        name: 'Advanced Fraud Detection',
        description: 'AI-powered fraud detection and prevention',
        enabled: true,
        rolloutStrategy: {
          type: 'roles',
          roles: ['super_admin', 'admin', 'support'],
        },
        owner: 'Security Team',
        tags: ['security', 'fraud'],
      },
    ];

    defaultFeatures.forEach((feature) => {
      this.features.set(feature.key, feature);
    });
  }

  isFeatureEnabled(featureKey: string, context: FeatureContext): boolean {
    const feature = this.features.get(featureKey);
    if (!feature) {
      console.warn(`Feature "${featureKey}" not found`);
      return false;
    }

    if (!feature.enabled) {
      return false;
    }

    // Check date restrictions
    const now = new Date();
    if (feature.startDate && new Date(feature.startDate) > now) {
      return false;
    }
    if (feature.endDate && new Date(feature.endDate) < now) {
      return false;
    }

    // Check rollout strategy
    const { rolloutStrategy } = feature;

    switch (rolloutStrategy.type) {
      case 'all':
        return true;

      case 'roles':
        return rolloutStrategy.roles?.includes(context.userRole) || false;

      case 'users':
        return rolloutStrategy.userIds?.includes(context.userId) || false;

      case 'environments':
        return (
          rolloutStrategy.environments?.includes(context.environment) || false
        );

      case 'percentage':
        // Use consistent hash based on userId for stable rollout
        const hash = this.hashUserId(context.userId);
        const threshold = (rolloutStrategy.percentage || 0) / 100;
        return hash < threshold;

      default:
        return false;
    }
  }

  getEnabledFeatures(context: FeatureContext): string[] {
    return Array.from(this.features.keys()).filter((featureKey) =>
      this.isFeatureEnabled(featureKey, context),
    );
  }

  async toggleFeature(
    featureKey: string,
    enabled: boolean,
    adminId: string,
  ): Promise<void> {
    const feature = this.features.get(featureKey);
    if (!feature) {
      throw new Error(`Feature "${featureKey}" not found`);
    }

    const updatedFeature = { ...feature, enabled };
    this.features.set(featureKey, updatedFeature);

    // Create audit event
    const auditEvent: Omit<RoleAuditEvent, 'id'> = {
      type: 'feature_toggle_changed',
      performedBy: adminId,
      performedByRole: 'admin',
      targetFeature: featureKey,
      description: `Feature "${featureKey}" ${enabled ? 'enabled' : 'disabled'}`,
      timestamp: new Date().toISOString(),
      ipAddress: 'system',
      userAgent: 'system',
      metadata: {
        previousState: feature.enabled,
        newState: enabled,
        featureName: feature.name,
      },
    };

    this.auditFeatureChange(auditEvent);
  }

  async createFeature(
    featureData: Omit<FeatureToggle, 'key'>,
  ): Promise<FeatureToggle> {
    const key = this.generateFeatureKey(featureData.name);
    const feature: FeatureToggle = {
      key,
      ...featureData,
    };

    this.features.set(key, feature);
    return feature;
  }

  async updateFeature(
    featureKey: string,
    updates: Partial<FeatureToggle>,
  ): Promise<FeatureToggle> {
    const feature = this.features.get(featureKey);
    if (!feature) {
      throw new Error(`Feature "${featureKey}" not found`);
    }

    const updatedFeature = { ...feature, ...updates };
    this.features.set(featureKey, updatedFeature);
    return updatedFeature;
  }

  async getFeatureUsage(featureKey: string): Promise<FeatureUsageStats> {
    // In production, this would query actual usage data
    const mockStats: FeatureUsageStats = {
      featureKey,
      totalUsers: 1250,
      activeUsers: 890,
      usageByRole: {
        super_admin: 5,
        admin: 12,
        support: 45,
        qa: 8,
        user: 820,
        viewer: 0,
      },
      lastUsed: new Date().toISOString(),
      errorRate: 0.02,
    };

    return mockStats;
  }

  getAllFeatures(): FeatureToggle[] {
    return Array.from(this.features.values());
  }

  getFeaturesByRole(role: UserRole): FeatureToggle[] {
    return this.getAllFeatures().filter((feature) => {
      if (feature.rolloutStrategy.type === 'roles') {
        return feature.rolloutStrategy.roles?.includes(role);
      }
      if (feature.rolloutStrategy.type === 'all') {
        return true;
      }
      return false;
    });
  }

  // Check if user has permission to manage features
  canManageFeature(userRole: UserRole, featureKey: string): boolean {
    const feature = this.features.get(featureKey);
    if (!feature) return false;

    // Super admins can manage all features
    if (userRole === 'super_admin') return true;

    // Admins can manage most features except system-critical ones
    if (userRole === 'admin') {
      const restrictedFeatures = ['super_admin_only', 'system_critical'];
      return !feature.tags.some((tag) => restrictedFeatures.includes(tag));
    }

    return false;
  }

  private hashUserId(userId: string): number {
    let hash = 0;
    for (let i = 0; i < userId.length; i++) {
      const char = userId.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash) / Math.pow(2, 31);
  }

  private generateFeatureKey(name: string): string {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_|_$/g, '');
  }

  private auditFeatureChange(auditEvent: Omit<RoleAuditEvent, 'id'>): void {
    // In production, save to audit log database
    console.log('Feature toggle audit event:', auditEvent);
  }
}

// React hook for feature toggles
export function useFeatureToggle(
  featureKey: string,
  context?: Partial<FeatureContext>,
) {
  const defaultContext: FeatureContext = {
    userId: 'anonymous',
    userRole: 'viewer',
    environment: 'production',
    ...context,
  };

  const isEnabled = featureToggleService.isFeatureEnabled(
    featureKey,
    defaultContext,
  );

  return {
    isEnabled,
    toggle: async (enabled: boolean, adminId: string) => {
      await featureToggleService.toggleFeature(featureKey, enabled, adminId);
    },
  };
}

// React hook for getting all enabled features
export function useEnabledFeatures(context?: Partial<FeatureContext>) {
  const defaultContext: FeatureContext = {
    userId: 'anonymous',
    userRole: 'viewer',
    environment: 'production',
    ...context,
  };

  return featureToggleService.getEnabledFeatures(defaultContext);
}

// Permission-based feature access helper
export function hasFeatureAccess(
  userRole: UserRole,
  permissions: Permission[],
  featureKey: string,
): boolean {
  const feature = featureToggleService
    .getAllFeatures()
    .find((f) => f.key === featureKey);
  if (!feature) return false;

  // Check if feature is enabled for this role
  const context: FeatureContext = {
    userId: 'check',
    userRole,
    environment: 'production',
  };

  if (!featureToggleService.isFeatureEnabled(featureKey, context)) {
    return false;
  }

  // Additional permission checks can be added here
  return true;
}

// Feature flag evaluation for conditional rendering
export function FeatureFlag({
  feature,
  userRole,
  children,
  fallback = null,
}: {
  feature: string;
  userRole: UserRole;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const context: FeatureContext = {
    userId: 'current_user',
    userRole,
    environment:
      process.env.NODE_ENV === 'development' ? 'development' : 'production',
  };

  const isEnabled = featureToggleService.isFeatureEnabled(feature, context);

  return isEnabled ? children : fallback;
}

// Global feature toggle service instance
export const featureToggleService = new RoleBasedFeatureToggleService();

// Feature toggle utilities
export const FeatureUtils = {
  // Get features by category/tag
  getFeaturesByTag: (tag: string): FeatureToggle[] => {
    return featureToggleService
      .getAllFeatures()
      .filter((feature) => feature.tags.includes(tag));
  },

  // Check if feature is in beta/preview
  isPreviewFeature: (featureKey: string): boolean => {
    const feature = featureToggleService
      .getAllFeatures()
      .find((f) => f.key === featureKey);
    return (
      feature?.tags.includes('preview') ||
      feature?.tags.includes('beta') ||
      false
    );
  },

  // Get feature rollout percentage
  getRolloutPercentage: (featureKey: string): number => {
    const feature = featureToggleService
      .getAllFeatures()
      .find((f) => f.key === featureKey);
    if (feature?.rolloutStrategy.type === 'percentage') {
      return feature.rolloutStrategy.percentage || 0;
    }
    return feature?.enabled ? 100 : 0;
  },

  // Check if user can see feature management UI
  canManageFeatures: (userRole: UserRole): boolean => {
    return ['super_admin', 'admin'].includes(userRole);
  },
};
