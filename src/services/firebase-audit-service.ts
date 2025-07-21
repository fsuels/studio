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
// Note: Removed ImmutableAuditTrail imports - using simplified audit logging for authentication events
import { auth } from '@/lib/firebase';

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
}

// Define AuditEvent interface for compatibility
export interface AuditEvent {
  id?: string;
  eventType: string;
  userId: string;
  timestamp: any;
  metadata: Record<string, any>;
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
    metadata: Record<string, any>,
    userId?: string,
  ): Promise<void> {
    try {
      const currentUser = auth.currentUser;
      const actualUserId = userId || currentUser?.uid || 'system';

      // Create a simple audit event for Firestore
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

      // Store in Firestore
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
