// Session Recording and Replay System for Support
import { db } from '@/lib/firebase';
import {
  collection,
  addDoc,
  query,
  where,
  orderBy,
  getDocs,
  doc,
  updateDoc,
} from 'firebase/firestore';

export interface SessionEvent {
  id: string;
  sessionId: string;
  userId?: string;
  timestamp: number;
  type:
    | 'click'
    | 'scroll'
    | 'input'
    | 'navigation'
    | 'error'
    | 'form_submit'
    | 'document_action';
  data: {
    element?: string;
    url?: string;
    value?: string;
    coordinates?: { x: number; y: number };
    viewport?: { width: number; height: number };
    documentType?: string;
    errorMessage?: string;
    stackTrace?: string;
    metadata?: Record<string, any>;
  };
}

export interface SessionReplay {
  id: string;
  sessionId: string;
  userId?: string;
  startTime: number;
  endTime?: number;
  duration?: number;
  userAgent: string;
  ip?: string;
  events: SessionEvent[];
  metadata: {
    documentTypes?: string[];
    completedSteps?: string[];
    errors?: number;
    supportTicketId?: string;
    customerSatisfaction?: number;
  };
  tags: string[];
  isActive: boolean;
}

export interface SessionSearchFilters {
  userId?: string;
  startDate?: Date;
  endDate?: Date;
  hasErrors?: boolean;
  documentTypes?: string[];
  tags?: string[];
}

class SessionRecorder {
  private sessionId: string;
  private userId?: string;
  private events: SessionEvent[] = [];
  private isRecording = false;
  private debounceTimer?: NodeJS.Timeout;
  private eventBuffer: SessionEvent[] = [];

  constructor() {
    this.sessionId = this.generateSessionId();
    this.setupEventListeners();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  startRecording(userId?: string) {
    this.userId = userId;
    this.isRecording = true;
    this.recordEvent('navigation', {
      url: window.location.href,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
    });
  }

  stopRecording() {
    this.isRecording = false;
    this.flushEvents();
  }

  private setupEventListeners() {
    // Mouse clicks
    document.addEventListener('click', (e) => {
      if (!this.isRecording) return;

      const target = e.target as HTMLElement;
      this.recordEvent('click', {
        element: this.getElementSelector(target),
        coordinates: { x: e.clientX, y: e.clientY },
        metadata: {
          tagName: target.tagName,
          className: target.className,
          textContent: target.textContent?.slice(0, 100),
        },
      });
    });

    // Form inputs
    document.addEventListener('input', (e) => {
      if (!this.isRecording) return;

      const target = e.target as HTMLInputElement;
      if (target.type === 'password') return; // Don't record passwords

      this.recordEvent('input', {
        element: this.getElementSelector(target),
        value: this.sanitizeValue(target.value),
        metadata: {
          inputType: target.type,
          name: target.name,
        },
      });
    });

    // Scroll events (debounced)
    document.addEventListener('scroll', () => {
      if (!this.isRecording) return;

      clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(() => {
        this.recordEvent('scroll', {
          coordinates: { x: window.scrollX, y: window.scrollY },
        });
      }, 100);
    });

    // Navigation changes
    window.addEventListener('popstate', () => {
      if (!this.isRecording) return;

      this.recordEvent('navigation', {
        url: window.location.href,
      });
    });

    // Error tracking
    window.addEventListener('error', (e) => {
      if (!this.isRecording) return;

      this.recordEvent('error', {
        errorMessage: e.message,
        url: e.filename,
        metadata: {
          lineno: e.lineno,
          colno: e.colno,
          stack: e.error?.stack,
        },
      });
    });

    // Form submissions
    document.addEventListener('submit', (e) => {
      if (!this.isRecording) return;

      const form = e.target as HTMLFormElement;
      this.recordEvent('form_submit', {
        element: this.getElementSelector(form),
        metadata: {
          action: form.action,
          method: form.method,
        },
      });
    });
  }

  private recordEvent(type: SessionEvent['type'], data: SessionEvent['data']) {
    const event: SessionEvent = {
      id: `evt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      sessionId: this.sessionId,
      userId: this.userId,
      timestamp: Date.now(),
      type,
      data,
    };

    this.events.push(event);
    this.eventBuffer.push(event);

    // Flush events periodically or when buffer is full
    if (this.eventBuffer.length >= 50) {
      this.flushEvents();
    }
  }

  private async flushEvents() {
    if (this.eventBuffer.length === 0) return;

    try {
      const eventsToFlush = [...this.eventBuffer];
      this.eventBuffer = [];

      // Save to Firestore in batches
      const sessionData: Partial<SessionReplay> = {
        sessionId: this.sessionId,
        userId: this.userId,
        startTime: this.events[0]?.timestamp || Date.now(),
        userAgent: navigator.userAgent,
        events: eventsToFlush,
        metadata: {
          errors: eventsToFlush.filter((e) => e.type === 'error').length,
        },
        tags: [],
        isActive: this.isRecording,
      };

      await addDoc(collection(db, 'sessionReplays'), sessionData);
    } catch (error) {
      console.error('Failed to save session events:', error);
    }
  }

  private getElementSelector(element: Element): string {
    if (element.id) return `#${element.id}`;
    if (element.className) {
      const classes = element.className.split(' ').filter((c) => c);
      if (classes.length > 0) return `.${classes[0]}`;
    }
    return element.tagName.toLowerCase();
  }

  private sanitizeValue(value: string): string {
    // Remove potential PII
    if (value.includes('@')) return '[email]';
    if (/^\d{4}/.test(value) && value.length >= 15) return '[card_number]';
    if (/^\d{3}-\d{2}-\d{4}$/.test(value)) return '[ssn]';

    return value.length > 50 ? value.slice(0, 50) + '...' : value;
  }

  // Public API for tracking specific events
  trackDocumentAction(
    documentType: string,
    action: string,
    metadata?: Record<string, any>,
  ) {
    this.recordEvent('document_action', {
      documentType,
      metadata: { action, ...metadata },
    });
  }

  tagSession(tags: string[]) {
    // Update session tags in Firestore
    // This would be called when support identifies session characteristics
  }

  getSessionId(): string {
    return this.sessionId;
  }
}

// Session Replay API for support team
export class SessionReplayAPI {
  static async getSessionsByUser(
    userId: string,
    limit = 10,
  ): Promise<SessionReplay[]> {
    const q = query(
      collection(db, 'sessionReplays'),
      where('userId', '==', userId),
      orderBy('startTime', 'desc'),
      // limit(limit) // Uncomment when Firestore composite index is created
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() }) as SessionReplay,
    );
  }

  static async getSessionsByTicket(ticketId: string): Promise<SessionReplay[]> {
    const q = query(
      collection(db, 'sessionReplays'),
      where('metadata.supportTicketId', '==', ticketId),
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() }) as SessionReplay,
    );
  }

  static async searchSessions(filters: SessionSearchFilters): Promise<SessionReplay[]> {
    let q = query(collection(db, 'sessionReplays'));

    if (filters.userId) {
      q = query(q, where('userId', '==', filters.userId));
    }

    if (filters.startDate) {
      q = query(q, where('startTime', '>=', filters.startDate.getTime()));
    }

    if (filters.endDate) {
      q = query(q, where('startTime', '<=', filters.endDate.getTime()));
    }

    const snapshot = await getDocs(q);
    let results = snapshot.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() }) as SessionReplay,
    );

    // Client-side filtering for complex conditions
    if (filters.hasErrors) {
      results = results.filter((session) =>
        session.events.some((event) => event.type === 'error'),
      );
    }

    if (filters.documentTypes?.length) {
      results = results.filter((session) =>
        session.events.some(
          (event) =>
            event.type === 'document_action' &&
            filters.documentTypes!.includes(event.data.documentType!),
        ),
      );
    }

    if (filters.tags?.length) {
      results = results.filter((session) =>
        filters.tags!.some((tag) => session.tags.includes(tag)),
      );
    }

    return results.sort((a, b) => b.startTime - a.startTime);
  }

  static async linkSessionToTicket(
    sessionId: string,
    ticketId: string,
  ): Promise<void> {
    await updateDoc(doc(db, 'sessionReplays', sessionId), {
      'metadata.supportTicketId': ticketId,
    });
  }

  static async addSessionTags(
    sessionId: string,
    tags: string[],
  ): Promise<void> {
    const sessionDoc = doc(db, 'sessionReplays', sessionId);
    await updateDoc(sessionDoc, {
      tags: tags,
    });
  }
}

// Global session recorder instance
export const sessionRecorder =
  typeof window !== 'undefined' ? new SessionRecorder() : null;

// Auto-start recording for authenticated users
if (typeof window !== 'undefined') {
  // Start recording when user is detected
  const startRecordingWhenReady = () => {
    // This would integrate with your auth system
    const user = null; // Get from your auth context
    if (user && sessionRecorder) {
      sessionRecorder.startRecording(user.uid);
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startRecordingWhenReady);
  } else {
    startRecordingWhenReady();
  }
}
