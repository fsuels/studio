// Lazy-load Firebase modules to keep client bundles slim
let fsModulePromise: Promise<typeof import('firebase/firestore')> | null = null;
async function FS() {
  if (!fsModulePromise) fsModulePromise = import('firebase/firestore');
  return fsModulePromise;
}

async function DB() {
  const { getDb } = await import('@/lib/firebase');
  return getDb();
}

async function AUTH() {
  // Importing from our firebase wrapper ensures the app is initialized
  const mod = await import('@/lib/firebase');
  return mod.auth;
}

// Define EventType enum for compatibility
export enum EventType {
  USER_LOGIN = 'user_login',
  USER_LOGOUT = 'user_logout',
  USER_REGISTRATION = 'user_registration',
  PASSWORD_RESET = 'password_reset',
  DOCUMENT_CREATED = 'document_created',
  DOCUMENT_UPDATED = 'document_updated',
  DATA_ACCESS = 'data_access',
  DATA_EXPORT = 'data_export',
  DATA_DELETION = 'data_deletion',
  POLICY_ACCEPTED = 'policy_accepted',
  POLICY_VIEWED = 'policy_viewed',
  CONSENT_GIVEN = 'consent_given',
  CONSENT_WITHDRAWN = 'consent_withdrawn',
  LEGAL_UPDATE_INTERACTION = 'legal_update_interaction',
}

// Define AuditEvent interface for compatibility
export interface AuditEvent {
  id?: string;
  eventType: string;
  userId: string;
  timestamp: unknown;
  metadata: Record<string, unknown>;
}

export class FirebaseAuditService {
  private static instance: FirebaseAuditService;
  private readonly COLLECTION_NAME = 'audit_events';

  private constructor() {
    // Using simplified audit logging for authentication events
  }

  static getInstance(): FirebaseAuditService {
    if (!FirebaseAuditService.instance) {
      FirebaseAuditService.instance = new FirebaseAuditService();
    }
    return FirebaseAuditService.instance;
  }

  /**
   * Log an audit event to Firestore
   */
  async logEvent(
    eventType: string,
    metadata: Record<string, unknown>,
    userId?: string,
  ): Promise<void> {
    try {
      const auth = await AUTH();
      const currentUser = auth?.currentUser || null;
      const actualUserId = userId || currentUser?.uid || 'system';

      // Create a simple audit event for Firestore
      const db = await DB();
      const { addDoc, collection, serverTimestamp } = await FS();

      const event: AuditEvent = {
        eventType,
        userId: actualUserId,
        timestamp: serverTimestamp(),
        metadata: {
          ...metadata,
          userEmail: currentUser?.email || 'unknown',
          timestamp: new Date().toISOString(),
        },
      };

      await addDoc(collection(db, this.COLLECTION_NAME), event);
    } catch (error) {
      console.error('Failed to log audit event:', error);
      // Don't throw - audit logging should not break the application
    }
  }

  /**
   * Get audit events for a specific user
   */
  async getUserAuditTrail(
    userId: string,
    limitCount: number = 100,
  ): Promise<AuditEvent[]> {
    try {
      const db = await DB();
      const { query, collection, where, orderBy, limit, getDocs } =
        await FS();
      const q = query(
        collection(db, this.COLLECTION_NAME),
        where('userId', '==', userId),
        orderBy('timestamp', 'desc'),
        limit(limitCount),
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      })) as AuditEvent[];
    } catch (error) {
      console.error('Failed to fetch user audit trail:', error);
      return [];
    }
  }

  /**
   * Get audit events by type
   */
  async getEventsByType(
    eventType: EventType,
    limitCount: number = 100,
  ): Promise<AuditEvent[]> {
    try {
      const db = await DB();
      const { query, collection, where, orderBy, limit, getDocs } =
        await FS();
      const q = query(
        collection(db, this.COLLECTION_NAME),
        where('eventType', '==', eventType),
        orderBy('timestamp', 'desc'),
        limit(limitCount),
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      })) as AuditEvent[];
    } catch (error) {
      console.error('Failed to fetch events by type:', error);
      return [];
    }
  }

  /**
   * Export user data for DSAR/SAR compliance
   */
  async exportUserData(userId: string): Promise<{
    userId: string;
    exportedAt: string;
    totalEvents: number;
    events: AuditEvent[];
  }> {
    try {
      const events = await this.getUserAuditTrail(userId, 10000); // Get all events
      return {
        userId,
        exportedAt: new Date().toISOString(),
        totalEvents: events.length,
        events,
      };
    } catch (error) {
      console.error('Failed to export user data:', error);
      throw error;
    }
  }

  /**
   * Verify audit trail integrity
   */
  async verifyIntegrity(events: AuditEvent[]): Promise<boolean> {
    // Simplified integrity check - for full cryptographic verification, 
    // use the ImmutableAuditTrail system
    return events.every(event => 
      event.eventType && 
      event.userId && 
      event.timestamp && 
      event.metadata
    );
  }

  /**
   * Log authentication events
   */
  async logAuthEvent(
    type: 'signin' | 'signup' | 'logout' | 'password_reset',
    metadata: Record<string, unknown> = {},
  ): Promise<void> {
    const eventTypeMap = {
      signin: EventType.USER_LOGIN,
      signup: EventType.USER_REGISTRATION,
      logout: EventType.USER_LOGOUT,
      password_reset: EventType.PASSWORD_RESET,
    };

    await this.logEvent(eventTypeMap[type], {
      ...metadata,
      ipAddress: metadata.ipAddress || 'unknown',
      userAgent: metadata.userAgent || 'unknown',
    });
  }

  /**
   * Log document operations
   */
  async logDocumentEvent(
    operation: 'create' | 'view' | 'edit' | 'download' | 'delete',
    documentId: string,
    documentType: string,
    metadata: Record<string, unknown> = {},
  ): Promise<void> {
    const eventTypeMap = {
      create: EventType.DOCUMENT_CREATED,
      view: EventType.DATA_ACCESS,
      edit: EventType.DOCUMENT_UPDATED,
      download: EventType.DATA_EXPORT,
      delete: EventType.DATA_DELETION,
    };

    await this.logEvent(eventTypeMap[operation], {
      documentId,
      documentType,
      ...metadata,
    });
  }

  /**
   * Log compliance events
   */
  async logComplianceEvent(
    type:
      | 'terms_accepted'
      | 'privacy_viewed'
      | 'policy_viewed'
      | 'consent_given'
      | 'consent_withdrawn'
      | 'legal_update_interaction',
    metadata: Record<string, unknown> = {},
  ): Promise<void> {
    const eventTypeMap = {
      terms_accepted: EventType.POLICY_ACCEPTED,
      privacy_viewed: EventType.POLICY_VIEWED,
      policy_viewed: EventType.POLICY_VIEWED,
      consent_given: EventType.CONSENT_GIVEN,
      consent_withdrawn: EventType.CONSENT_WITHDRAWN,
      legal_update_interaction: EventType.LEGAL_UPDATE_INTERACTION,
    };

    await this.logEvent(eventTypeMap[type], metadata);
  }
}

// Export singleton instance
export const auditService = FirebaseAuditService.getInstance();

