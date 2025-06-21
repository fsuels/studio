// Enhanced role-based access control system for legal document SaaS
export type UserRole =
  | 'super_admin'
  | 'admin'
  | 'support'
  | 'qa'
  | 'user'
  | 'viewer';

export type Permission =
  // Admin permissions
  | 'admin.full_access'
  | 'admin.user_management'
  | 'admin.role_management'
  | 'admin.system_settings'
  | 'admin.feature_toggles'
  | 'admin.impersonate_users'
  | 'admin.view_audit_logs'
  | 'admin.manage_compliance'
  | 'admin.financial_data'

  // Support permissions
  | 'support.view_customers'
  | 'support.impersonate_customers'
  | 'support.view_orders'
  | 'support.manage_tickets'
  | 'support.view_documents'
  | 'support.refund_orders'
  | 'support.send_emails'
  | 'support.view_basic_analytics'

  // QA permissions
  | 'qa.test_environments'
  | 'qa.feature_preview'
  | 'qa.impersonate_test_users'
  | 'qa.view_test_data'
  | 'qa.manage_test_scenarios'
  | 'qa.access_dev_tools'

  // User permissions
  | 'user.create_documents'
  | 'user.view_own_documents'
  | 'user.download_documents'
  | 'user.edit_profile'
  | 'user.view_billing'
  | 'user.upgrade_plan'

  // Document permissions
  | 'documents.create'
  | 'documents.view_all'
  | 'documents.edit_all'
  | 'documents.delete_all'
  | 'documents.manage_templates'

  // Analytics permissions
  | 'analytics.view_revenue'
  | 'analytics.view_user_data'
  | 'analytics.view_compliance'
  | 'analytics.export_data';

export interface RoleDefinition {
  name: UserRole;
  displayName: string;
  description: string;
  permissions: Permission[];
  inheritsFrom?: UserRole[];
  isSystemRole: boolean;
  maxImpersonationDuration?: number; // minutes
  canImpersonate: UserRole[];
  features: string[]; // Feature flags this role has access to
  restrictions?: {
    maxCustomersAccess?: number;
    dataRetentionDays?: number;
    allowedEnvironments?: ('production' | 'staging' | 'development')[];
  };
}

export interface UserWithRole {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  permissions: Permission[];
  features: string[];
  createdAt: string;
  lastLogin?: string;
  isActive: boolean;
  teamId?: string;
  managedBy?: string; // ID of the admin who manages this user
  impersonationSettings?: {
    allowImpersonation: boolean;
    maxDuration: number;
    auditRequired: boolean;
  };
}

export interface ImpersonationSession {
  id: string;
  adminId: string;
  adminEmail: string;
  targetUserId: string;
  targetUserEmail: string;
  startedAt: string;
  endsAt: string;
  reason: string;
  ipAddress: string;
  userAgent: string;
  isActive: boolean;
  endedAt?: string;
  endReason?:
    | 'manual_end'
    | 'timeout'
    | 'admin_terminated'
    | 'system_terminated';
  actionsPerformed: ImpersonationAction[];
}

export interface ImpersonationAction {
  id: string;
  sessionId: string;
  action: string;
  description: string;
  timestamp: string;
  metadata?: Record<string, any>;
  riskLevel: 'low' | 'medium' | 'high';
}

export interface FeatureToggle {
  key: string;
  name: string;
  description: string;
  enabled: boolean;
  rolloutStrategy: {
    type: 'all' | 'percentage' | 'roles' | 'users' | 'environments';
    percentage?: number;
    roles?: UserRole[];
    userIds?: string[];
    environments?: string[];
  };
  startDate?: string;
  endDate?: string;
  owner: string;
  tags: string[];
  metadata?: Record<string, any>;
}

export interface RoleAuditEvent {
  id: string;
  type:
    | 'role_assigned'
    | 'role_removed'
    | 'permission_granted'
    | 'permission_revoked'
    | 'impersonation_started'
    | 'impersonation_ended'
    | 'feature_toggle_changed'
    | 'role_created'
    | 'role_modified'
    | 'user_activated'
    | 'user_deactivated';
  performedBy: string;
  performedByRole: UserRole;
  targetUserId?: string;
  targetRole?: UserRole;
  targetPermission?: Permission;
  targetFeature?: string;
  description: string;
  timestamp: string;
  ipAddress: string;
  userAgent: string;
  metadata?: Record<string, any>;
  complianceFlags?: string[];
}

export interface TeamRole {
  id: string;
  name: string;
  description: string;
  roles: UserRole[];
  permissions: Permission[];
  features: string[];
  members: string[]; // User IDs
  managedBy: string; // Admin user ID
  createdAt: string;
  updatedAt: string;
}

// Role hierarchy and permission checking
export interface RoleHierarchy {
  role: UserRole;
  level: number;
  canManage: UserRole[];
  canImpersonate: UserRole[];
}

// Feature flag evaluation context
export interface FeatureContext {
  userId: string;
  userRole: UserRole;
  teamId?: string;
  environment: 'production' | 'staging' | 'development';
  metadata?: Record<string, any>;
}

// Role management operations
export interface RoleManagementOperation {
  type:
    | 'assign_role'
    | 'remove_role'
    | 'grant_permission'
    | 'revoke_permission'
    | 'enable_feature'
    | 'disable_feature'
    | 'start_impersonation'
    | 'end_impersonation';
  targetUserId: string;
  targetRole?: UserRole;
  targetPermission?: Permission;
  targetFeature?: string;
  reason: string;
  duration?: number; // For temporary operations like impersonation
  metadata?: Record<string, any>;
}

// Default role definitions
export const DEFAULT_ROLES: Record<UserRole, RoleDefinition> = {
  super_admin: {
    name: 'super_admin',
    displayName: 'Super Administrator',
    description: 'Full system access with all permissions',
    permissions: [
      'admin.full_access',
      'admin.user_management',
      'admin.role_management',
      'admin.system_settings',
      'admin.feature_toggles',
      'admin.impersonate_users',
      'admin.view_audit_logs',
      'admin.manage_compliance',
      'admin.financial_data',
      'analytics.view_revenue',
      'analytics.view_user_data',
      'analytics.view_compliance',
      'analytics.export_data',
      'documents.view_all',
      'documents.edit_all',
      'documents.delete_all',
      'documents.manage_templates',
    ],
    isSystemRole: true,
    canImpersonate: ['admin', 'support', 'qa', 'user', 'viewer'],
    maxImpersonationDuration: 480, // 8 hours
    features: ['*'], // All features
  },

  admin: {
    name: 'admin',
    displayName: 'Administrator',
    description: 'Administrative access with user and system management',
    permissions: [
      'admin.user_management',
      'admin.system_settings',
      'admin.feature_toggles',
      'admin.impersonate_users',
      'admin.view_audit_logs',
      'admin.manage_compliance',
      'support.view_customers',
      'support.view_orders',
      'support.manage_tickets',
      'support.view_documents',
      'analytics.view_user_data',
      'analytics.view_compliance',
      'documents.view_all',
      'documents.manage_templates',
    ],
    isSystemRole: true,
    canImpersonate: ['support', 'qa', 'user', 'viewer'],
    maxImpersonationDuration: 240, // 4 hours
    features: ['admin_dashboard', 'advanced_analytics', 'feature_management'],
  },

  support: {
    name: 'support',
    displayName: 'Customer Support',
    description: 'Customer support with limited administrative access',
    permissions: [
      'support.view_customers',
      'support.impersonate_customers',
      'support.view_orders',
      'support.manage_tickets',
      'support.view_documents',
      'support.refund_orders',
      'support.send_emails',
      'support.view_basic_analytics',
      'documents.view_all',
    ],
    isSystemRole: true,
    canImpersonate: ['user', 'viewer'],
    maxImpersonationDuration: 120, // 2 hours
    features: ['support_dashboard', 'customer_timeline', 'ticket_management'],
    restrictions: {
      maxCustomersAccess: 1000,
      dataRetentionDays: 90,
      allowedEnvironments: ['production', 'staging'],
    },
  },

  qa: {
    name: 'qa',
    displayName: 'Quality Assurance',
    description: 'QA testing with access to test environments and features',
    permissions: [
      'qa.test_environments',
      'qa.feature_preview',
      'qa.impersonate_test_users',
      'qa.view_test_data',
      'qa.manage_test_scenarios',
      'qa.access_dev_tools',
      'user.create_documents',
      'user.view_own_documents',
      'documents.create',
    ],
    isSystemRole: true,
    canImpersonate: ['user', 'viewer'],
    maxImpersonationDuration: 480, // 8 hours for testing
    features: ['qa_dashboard', 'feature_preview', 'test_tools', 'debug_mode'],
    restrictions: {
      allowedEnvironments: ['staging', 'development'],
    },
  },

  user: {
    name: 'user',
    displayName: 'User',
    description: 'Standard user with document creation and management',
    permissions: [
      'user.create_documents',
      'user.view_own_documents',
      'user.download_documents',
      'user.edit_profile',
      'user.view_billing',
      'user.upgrade_plan',
      'documents.create',
    ],
    isSystemRole: false,
    canImpersonate: [],
    features: ['document_creation', 'basic_templates', 'user_dashboard'],
  },

  viewer: {
    name: 'viewer',
    displayName: 'Viewer',
    description: 'Read-only access to documents',
    permissions: [
      'user.view_own_documents',
      'user.download_documents',
      'user.edit_profile',
    ],
    isSystemRole: false,
    canImpersonate: [],
    features: ['document_viewing'],
  },
};

// Role hierarchy levels (higher number = more privileged)
export const ROLE_HIERARCHY: Record<UserRole, RoleHierarchy> = {
  super_admin: {
    role: 'super_admin',
    level: 100,
    canManage: ['admin', 'support', 'qa', 'user', 'viewer'],
    canImpersonate: ['admin', 'support', 'qa', 'user', 'viewer'],
  },
  admin: {
    role: 'admin',
    level: 80,
    canManage: ['support', 'qa', 'user', 'viewer'],
    canImpersonate: ['support', 'qa', 'user', 'viewer'],
  },
  support: {
    role: 'support',
    level: 60,
    canManage: ['user', 'viewer'],
    canImpersonate: ['user', 'viewer'],
  },
  qa: {
    role: 'qa',
    level: 60,
    canManage: [],
    canImpersonate: ['user', 'viewer'],
  },
  user: {
    role: 'user',
    level: 40,
    canManage: [],
    canImpersonate: [],
  },
  viewer: {
    role: 'viewer',
    level: 20,
    canManage: [],
    canImpersonate: [],
  },
};
