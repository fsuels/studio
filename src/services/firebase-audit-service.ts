import { db } from '@/lib/firebase';
import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  serverTimestamp,
  Timestamp,
  DocumentData,
} from 'firebase/firestore';
import {
  ImmutableAuditTrail,
  ImmutableAuditEvent,
  immutableAuditTrail,
} from '@/lib/immutable-audit-trail';
import { auth } from '@/lib/firebase';

export class FirebaseAuditService {
  private static instance: FirebaseAuditService;
  private auditManager: ImmutableAuditTrail;
  private readonly COLLECTION_NAME = 'audit_events';

  private constructor() {
    this.auditManager = immutableAuditTrail;
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
    eventType: ImmutableAuditEvent['eventType'],
    metadata: Record<string, any>,
    userId?: string,
  ): Promise<void> {
    try {
      const currentUser = auth.currentUser;
      const actualUserId = userId || currentUser?.uid || 'system';

      // Create the audit event using the immutable audit trail library
      const event = this.auditManager.createEvent(eventType, actualUserId, {
        ...metadata,
        userEmail: currentUser?.email || 'unknown',
        timestamp: new Date().toISOString(),
      });

      // Store in Firestore with server timestamp
      await addDoc(collection(db, this.COLLECTION_NAME), {
        ...event,
        userId: actualUserId,
        timestamp: serverTimestamp(),
      });
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
  async exportUserData(userId: string): Promise<any> {
    try {
      const events = await this.getUserAuditTrail(userId, 10000); // Get all events
      return this.auditManager.exportAuditTrail(events, 'json');
    } catch (error) {
      console.error('Failed to export user data:', error);
      throw error;
    }
  }

  /**
   * Verify audit trail integrity
   */
  async verifyIntegrity(events: AuditEvent[]): Promise<boolean> {
    return this.auditManager.verifyIntegrity(events);
  }

  /**
   * Log authentication events
   */
  async logAuthEvent(
    type: 'signin' | 'signup' | 'logout' | 'password_reset',
    metadata: Record<string, any> = {},
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
    metadata: Record<string, any> = {},
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
      | 'consent_given'
      | 'consent_withdrawn',
    metadata: Record<string, any> = {},
  ): Promise<void> {
    const eventTypeMap = {
      terms_accepted: EventType.POLICY_ACCEPTED,
      privacy_viewed: EventType.POLICY_VIEWED,
      consent_given: EventType.CONSENT_GIVEN,
      consent_withdrawn: EventType.CONSENT_WITHDRAWN,
    };

    await this.logEvent(eventTypeMap[type], metadata);
  }
}

// Export singleton instance
export const auditService = FirebaseAuditService.getInstance();
