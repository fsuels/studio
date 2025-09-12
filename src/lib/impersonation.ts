// User impersonation system for customer support and QA
import {
  UserRole,
  ImpersonationSession,
  ImpersonationAction,
  RoleAuditEvent,
  UserWithRole,
  ROLE_HIERARCHY,
} from '@/types/roles';

export interface ImpersonationService {
  startImpersonation(
    params: StartImpersonationParams,
  ): Promise<ImpersonationSession>;
  endImpersonation(sessionId: string, reason?: string): Promise<void>;
  getCurrentSession(adminId: string): Promise<ImpersonationSession | null>;
  getActiveSessions(): Promise<ImpersonationSession[]>;
  logAction(
    sessionId: string,
    action: Omit<ImpersonationAction, 'id' | 'sessionId' | 'timestamp'>,
  ): Promise<void>;
  canImpersonate(adminRole: UserRole, targetRole: UserRole): boolean;
  getImpersonationHistory(
    targetUserId?: string,
  ): Promise<ImpersonationSession[]>;
  validateSession(sessionId: string): Promise<boolean>;
}

export interface StartImpersonationParams {
  adminId: string;
  adminEmail: string;
  adminRole: UserRole;
  targetUserId: string;
  targetUserEmail: string;
  targetUserRole: UserRole;
  reason: string;
  duration?: number; // minutes, defaults to role-based limit
  ipAddress: string;
  userAgent: string;
}

export interface ImpersonationContext {
  isImpersonating: boolean;
  session?: ImpersonationSession;
  originalUser?: UserWithRole;
  impersonatedUser?: UserWithRole;
  adminUser?: UserWithRole;
  restrictions: {
    canAccessFinancialData: boolean;
    canModifyUser: boolean;
    canMakePayments: boolean;
    canDeleteData: boolean;
    maxSessionDuration: number;
  };
}

class UserImpersonationService implements ImpersonationService {
  private activeSessions: Map<string, ImpersonationSession> = new Map();
  private sessionActions: Map<string, ImpersonationAction[]> = new Map();

  async startImpersonation(
    params: StartImpersonationParams,
  ): Promise<ImpersonationSession> {
    // Validate permissions
    if (!this.canImpersonate(params.adminRole, params.targetUserRole)) {
      throw new Error(
        `Role ${params.adminRole} cannot impersonate ${params.targetUserRole}`,
      );
    }

    // Check if admin already has an active session
    const existingSession = await this.getCurrentSession(params.adminId);
    if (existingSession) {
      throw new Error('Admin already has an active impersonation session');
    }

    // Determine session duration based on role
    const maxDuration = this.getMaxDurationForRole(params.adminRole);
    const sessionDuration = Math.min(
      params.duration || maxDuration,
      maxDuration,
    );

    // Create impersonation session
    const session: ImpersonationSession = {
      id: crypto.randomUUID(),
      adminId: params.adminId,
      adminEmail: params.adminEmail,
      targetUserId: params.targetUserId,
      targetUserEmail: params.targetUserEmail,
      startedAt: new Date().toISOString(),
      endsAt: new Date(Date.now() + sessionDuration * 60 * 1000).toISOString(),
      reason: params.reason,
      ipAddress: params.ipAddress,
      userAgent: params.userAgent,
      isActive: true,
      actionsPerformed: [],
    };

    // Store session
    this.activeSessions.set(session.id, session);
    this.sessionActions.set(session.id, []);

    // Create audit event
    await this.createAuditEvent({
      type: 'impersonation_started',
      performedBy: params.adminId,
      performedByRole: params.adminRole,
      targetUserId: params.targetUserId,
      description: `Started impersonation of ${params.targetUserEmail} - Reason: ${params.reason}`,
      timestamp: new Date().toISOString(),
      ipAddress: params.ipAddress,
      userAgent: params.userAgent,
      metadata: {
        sessionId: session.id,
        duration: sessionDuration,
        targetRole: params.targetUserRole,
      },
    });

    // Log initial action
    await this.logAction(session.id, {
      action: 'session_started',
      description: `Impersonation session started for ${params.targetUserEmail}`,
      riskLevel: 'medium',
      metadata: {
        reason: params.reason,
        duration: sessionDuration,
      },
    });

    return session;
  }

  async endImpersonation(
    sessionId: string,
    reason: NonNullable<ImpersonationSession['endReason']> = 'manual_end',
  ): Promise<void> {
    const session = this.activeSessions.get(sessionId);
    if (!session) {
      throw new Error('Impersonation session not found');
    }

    if (!session.isActive) {
      throw new Error('Impersonation session is already ended');
    }

    // Update session
    session.isActive = false;
    session.endedAt = new Date().toISOString();
    session.endReason = reason;

    // Log final action
    await this.logAction(sessionId, {
      action: 'session_ended',
      description: `Impersonation session ended: ${reason}`,
      riskLevel: 'low',
      metadata: {
        endReason: reason,
        duration: this.calculateSessionDuration(session),
        totalActions: session.actionsPerformed.length,
      },
    });

    // Create audit event
    await this.createAuditEvent({
      type: 'impersonation_ended',
      performedBy: session.adminId,
      performedByRole: 'admin', // We don't store admin role in session
      targetUserId: session.targetUserId,
      description: `Ended impersonation of ${session.targetUserEmail} - Reason: ${reason}`,
      timestamp: new Date().toISOString(),
      ipAddress: session.ipAddress,
      userAgent: session.userAgent,
      metadata: {
        sessionId,
        endReason: reason,
        duration: this.calculateSessionDuration(session),
        actionsCount: session.actionsPerformed.length,
      },
    });

    // Remove from active sessions
    this.activeSessions.delete(sessionId);
  }

  async getCurrentSession(
    adminId: string,
  ): Promise<ImpersonationSession | null> {
    for (const session of this.activeSessions.values()) {
      if (session.adminId === adminId && session.isActive) {
        // Check if session has expired
        if (new Date() > new Date(session.endsAt)) {
          await this.endImpersonation(session.id, 'timeout');
          return null;
        }
        return session;
      }
    }
    return null;
  }

  async getActiveSessions(): Promise<ImpersonationSession[]> {
    const now = new Date();
    const activeSessions: ImpersonationSession[] = [];

    // Check all sessions for expiration
    for (const session of this.activeSessions.values()) {
      if (now > new Date(session.endsAt)) {
        await this.endImpersonation(session.id, 'timeout');
      } else if (session.isActive) {
        activeSessions.push(session);
      }
    }

    return activeSessions;
  }

  async logAction(
    sessionId: string,
    actionData: Omit<ImpersonationAction, 'id' | 'sessionId' | 'timestamp'>,
  ): Promise<void> {
    const session = this.activeSessions.get(sessionId);
    if (!session) {
      throw new Error('Impersonation session not found');
    }

    const action: ImpersonationAction = {
      id: crypto.randomUUID(),
      sessionId,
      timestamp: new Date().toISOString(),
      ...actionData,
    };

    // Add to session actions
    const actions = this.sessionActions.get(sessionId) || [];
    actions.push(action);
    this.sessionActions.set(sessionId, actions);

    // Add to session object
    session.actionsPerformed.push(action);

    // Log high-risk actions immediately
    if (action.riskLevel === 'high') {
      console.warn('High-risk impersonation action:', action);
      // In production, send alert to security team
    }
  }

  canImpersonate(adminRole: UserRole, targetRole: UserRole): boolean {
    const adminHierarchy = ROLE_HIERARCHY[adminRole];
    return adminHierarchy.canImpersonate.includes(targetRole);
  }

  async getImpersonationHistory(
    targetUserId?: string,
  ): Promise<ImpersonationSession[]> {
    // In production, this would query the database
    const allSessions = Array.from(this.activeSessions.values());

    if (targetUserId) {
      return allSessions.filter(
        (session) => session.targetUserId === targetUserId,
      );
    }

    return allSessions;
  }

  async validateSession(sessionId: string): Promise<boolean> {
    const session = this.activeSessions.get(sessionId);
    if (!session || !session.isActive) {
      return false;
    }

    // Check expiration
    if (new Date() > new Date(session.endsAt)) {
      await this.endImpersonation(sessionId, 'timeout');
      return false;
    }

    return true;
  }

  // Helper methods
  private getMaxDurationForRole(role: UserRole): number {
    const durations: Record<UserRole, number> = {
      super_admin: 480, // 8 hours
      admin: 240, // 4 hours
      support: 120, // 2 hours
      qa: 480, // 8 hours for testing
      user: 0, // Cannot impersonate
      viewer: 0, // Cannot impersonate
    };
    return durations[role] || 0;
  }

  private calculateSessionDuration(session: ImpersonationSession): number {
    const start = new Date(session.startedAt);
    const end = session.endedAt ? new Date(session.endedAt) : new Date();
    return Math.round((end.getTime() - start.getTime()) / (1000 * 60)); // minutes
  }

  private async createAuditEvent(
    event: Omit<RoleAuditEvent, 'id'>,
  ): Promise<void> {
    // In production, save to audit database
    console.log('Impersonation audit event:', event);
  }

  // Get impersonation context for current user
  async getImpersonationContext(adminId: string): Promise<ImpersonationContext> {
    const session = await this.getCurrentSession(adminId);

    if (!session) {
      return {
        isImpersonating: false,
        restrictions: {
          canAccessFinancialData: false,
          canModifyUser: false,
          canMakePayments: false,
          canDeleteData: false,
          maxSessionDuration: 0,
        },
      };
    }

    // Determine restrictions based on admin role
    const restrictions = this.getImpersonationRestrictions(session);

    return {
      isImpersonating: true,
      session,
      restrictions,
    };
  }

  private getImpersonationRestrictions(session: ImpersonationSession) {
    // Base restrictions - more restrictive for lower roles
    const baseRestrictions = {
      canAccessFinancialData: false,
      canModifyUser: false,
      canMakePayments: false,
      canDeleteData: false,
      maxSessionDuration: 120,
    };

    // In production, determine restrictions based on admin role
    // This is a simplified version
    return baseRestrictions;
  }
}

// React hooks for impersonation
export function useImpersonation(adminId?: string) {
  const [impersonationContext, setImpersonationContext] =
    React.useState<ImpersonationContext | null>(null);

  React.useEffect(() => {
    if (adminId) {
      impersonationService
        .getImpersonationContext(adminId)
        .then(setImpersonationContext);
    }
  }, [adminId]);

  const startImpersonation = async (params: StartImpersonationParams) => {
    const session = await impersonationService.startImpersonation(params);
    const context = await impersonationService.getImpersonationContext(
      params.adminId,
    );
    setImpersonationContext(context);
    return session;
  };

  const endImpersonation = async (reason?: string) => {
    if (impersonationContext?.session) {
      await impersonationService.endImpersonation(
        impersonationContext.session.id,
        reason,
      );
      setImpersonationContext(null);
    }
  };

  const logAction = async (
    actionData: Omit<ImpersonationAction, 'id' | 'sessionId' | 'timestamp'>,
  ) => {
    if (impersonationContext?.session) {
      await impersonationService.logAction(
        impersonationContext.session.id,
        actionData,
      );
    }
  };

  return {
    impersonationContext,
    startImpersonation,
    endImpersonation,
    logAction,
    isImpersonating: impersonationContext?.isImpersonating || false,
  };
}

// Impersonation action logger hook
export function useImpersonationLogger() {
  const logAction = React.useCallback(
    async (
      sessionId: string,
      action: string,
      description: string,
      riskLevel: 'low' | 'medium' | 'high' = 'low',
      metadata?: Record<string, unknown>,
    ) => {
      await impersonationService.logAction(sessionId, {
        action,
        description,
        riskLevel,
        metadata,
      });
    },
    [],
  );

  return { logAction };
}

// Security wrapper component for impersonation-sensitive actions
export function ImpersonationGuard({
  children,
  allowDuringImpersonation = false,
  riskLevel = 'medium',
  action,
  fallback = null,
}: {
  children: React.ReactNode;
  allowDuringImpersonation?: boolean;
  riskLevel?: 'low' | 'medium' | 'high';
  action?: string;
  fallback?: React.ReactNode;
}) {
  // This would integrate with your auth context
  const isImpersonating = false; // Get from context

  if (isImpersonating && !allowDuringImpersonation) {
    return fallback;
  }

  // Log the action if during impersonation
  if (isImpersonating && action) {
    // Log action
  }

  return children;
}

// Global impersonation service instance
export const impersonationService = new UserImpersonationService();

// Impersonation utilities
export const ImpersonationUtils = {
  // Check if action is allowed during impersonation
  isActionAllowed: (
    action: string,
    restrictions: ImpersonationContext['restrictions'],
  ): boolean => {
    const highRiskActions = ['delete_user', 'change_billing', 'refund_payment'];
    const mediumRiskActions = [
      'edit_profile',
      'change_password',
      'download_data',
    ];

    if (highRiskActions.includes(action)) {
      return restrictions.canDeleteData;
    }

    if (mediumRiskActions.includes(action)) {
      return restrictions.canModifyUser;
    }

    return true; // Allow low-risk actions
  },

  // Get session time remaining
  getTimeRemaining: (session: ImpersonationSession): number => {
    const now = new Date();
    const end = new Date(session.endsAt);
    return Math.max(
      0,
      Math.round((end.getTime() - now.getTime()) / (1000 * 60)),
    );
  },

  // Format session duration
  formatDuration: (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  },

  // Get risk level for action
  getActionRiskLevel: (action: string): 'low' | 'medium' | 'high' => {
    const highRisk = ['delete', 'payment', 'billing', 'admin'];
    const mediumRisk = ['edit', 'update', 'create', 'modify'];

    if (highRisk.some((keyword) => action.toLowerCase().includes(keyword))) {
      return 'high';
    }

    if (mediumRisk.some((keyword) => action.toLowerCase().includes(keyword))) {
      return 'medium';
    }

    return 'low';
  },
};
