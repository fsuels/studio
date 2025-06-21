// src/app/api/admin/audit-trails/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/server-auth';
import { getDb } from '@/lib/firebase';
import {
  collection,
  query,
  orderBy,
  limit,
  startAfter,
  where,
  getDocs,
  doc,
  getDoc,
} from 'firebase/firestore';

interface AdminAuditQuery {
  userId?: string;
  eventType?: string;
  startDate?: string;
  endDate?: string;
  limit?: number;
  lastDoc?: string;
}

export async function GET(request: NextRequest) {
  try {
    const authResult = await requireAuth(request);
    if (authResult instanceof Response) return authResult;
    const user = authResult;

    // Check if user has admin privileges
    // For now, we'll use a simple check - in production, use proper role-based access
    const isAdmin =
      user.email?.endsWith('@123legaldoc.com') || user.uid === 'admin-user-id';
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 },
      );
    }

    const url = new URL(request.url);
    const params: AdminAuditQuery = {
      userId: url.searchParams.get('userId') || undefined,
      eventType: url.searchParams.get('eventType') || undefined,
      startDate: url.searchParams.get('startDate') || undefined,
      endDate: url.searchParams.get('endDate') || undefined,
      limit: parseInt(url.searchParams.get('limit') || '50'),
      lastDoc: url.searchParams.get('lastDoc') || undefined,
    };

    const db = await getDb();
    const auditCollection = collection(db, 'audit_events');

    // Build query
    let q = query(auditCollection, orderBy('timestamp', 'desc'));

    // Apply filters
    if (params.userId) {
      q = query(q, where('userId', '==', params.userId));
    }

    if (params.eventType) {
      q = query(q, where('eventType', '==', params.eventType));
    }

    if (params.startDate) {
      const startTimestamp = new Date(params.startDate);
      q = query(q, where('timestamp', '>=', startTimestamp));
    }

    if (params.endDate) {
      const endTimestamp = new Date(params.endDate);
      q = query(q, where('timestamp', '<=', endTimestamp));
    }

    // Apply pagination
    if (params.lastDoc) {
      const lastDocRef = doc(db, 'audit_events', params.lastDoc);
      const lastDocSnap = await getDoc(lastDocRef);
      if (lastDocSnap.exists()) {
        q = query(q, startAfter(lastDocSnap));
      }
    }

    q = query(q, limit(params.limit || 50));

    const snapshot = await getDocs(q);
    const events = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      timestamp:
        doc.data().timestamp?.toDate?.()?.toISOString() || doc.data().timestamp,
    }));

    // Get summary statistics
    const stats = await getAuditStats(db, params);

    return NextResponse.json({
      events,
      pagination: {
        hasMore: snapshot.docs.length === (params.limit || 50),
        lastDoc: snapshot.docs[snapshot.docs.length - 1]?.id || null,
        count: snapshot.docs.length,
      },
      stats,
      filters: params,
    });
  } catch (error) {
    console.error('Admin audit trail error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch audit trails' },
      { status: 500 },
    );
  }
}

async function getAuditStats(db: any, params: AdminAuditQuery) {
  try {
    // Get event type counts for the current filter
    let statsQuery = query(collection(db, 'audit_events'));

    if (params.userId) {
      statsQuery = query(statsQuery, where('userId', '==', params.userId));
    }

    if (params.startDate) {
      const startTimestamp = new Date(params.startDate);
      statsQuery = query(statsQuery, where('timestamp', '>=', startTimestamp));
    }

    if (params.endDate) {
      const endTimestamp = new Date(params.endDate);
      statsQuery = query(statsQuery, where('timestamp', '<=', endTimestamp));
    }

    const statsSnapshot = await getDocs(query(statsQuery, limit(1000))); // Limit for performance

    const eventTypeCounts: Record<string, number> = {};
    const userCounts: Record<string, number> = {};
    let totalEvents = 0;

    statsSnapshot.docs.forEach((doc) => {
      const data = doc.data();
      totalEvents++;

      // Count by event type
      eventTypeCounts[data.eventType] =
        (eventTypeCounts[data.eventType] || 0) + 1;

      // Count by user
      userCounts[data.userId] = (userCounts[data.userId] || 0) + 1;
    });

    return {
      totalEvents,
      eventTypes: Object.entries(eventTypeCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10), // Top 10 event types
      topUsers: Object.entries(userCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10), // Top 10 most active users
      dateRange: {
        start: params.startDate || null,
        end: params.endDate || null,
      },
    };
  } catch (error) {
    console.error('Error getting audit stats:', error);
    return {
      totalEvents: 0,
      eventTypes: [],
      topUsers: [],
      dateRange: { start: null, end: null },
    };
  }
}

// POST endpoint for admin actions (like integrity verification)
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireAuth(request);
    if (authResult instanceof Response) return authResult;
    const user = authResult;

    // Check admin privileges
    const isAdmin =
      user.email?.endsWith('@123legaldoc.com') || user.uid === 'admin-user-id';
    if (!isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { action, ...params } = body;

    switch (action) {
      case 'verify_integrity':
        return await handleIntegrityVerification(params);

      case 'generate_compliance_report':
        return await handleComplianceReport(params);

      default:
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Admin audit action error:', error);
    return NextResponse.json(
      { error: 'Failed to process admin action' },
      { status: 500 },
    );
  }
}

async function handleIntegrityVerification(params: any) {
  try {
    const db = await getDb();
    const auditCollection = collection(db, 'audit_events');

    let q = query(auditCollection, orderBy('timestamp', 'asc'));

    if (params.userId) {
      q = query(q, where('userId', '==', params.userId));
    }

    if (params.limit) {
      q = query(q, limit(params.limit));
    }

    const snapshot = await getDocs(q);
    const events = snapshot.docs.map((doc) => doc.data());

    // Simple integrity check - in production, use the actual audit service
    let integrityIssues = 0;
    let verifiedEvents = 0;

    for (const event of events) {
      if (
        event.hash &&
        typeof event.hash === 'string' &&
        event.hash.length > 0
      ) {
        verifiedEvents++;
      } else {
        integrityIssues++;
      }
    }

    return NextResponse.json({
      totalEvents: events.length,
      verifiedEvents,
      integrityIssues,
      isValid: integrityIssues === 0,
      verificationDate: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Integrity verification error:', error);
    return NextResponse.json(
      { error: 'Failed to verify integrity' },
      { status: 500 },
    );
  }
}

async function handleComplianceReport(params: any) {
  try {
    const db = await getDb();
    const auditCollection = collection(db, 'audit_events');

    // Generate compliance report based on parameters
    let q = query(auditCollection);

    if (params.startDate) {
      const startDate = new Date(params.startDate);
      q = query(q, where('timestamp', '>=', startDate));
    }

    if (params.endDate) {
      const endDate = new Date(params.endDate);
      q = query(q, where('timestamp', '<=', endDate));
    }

    q = query(q, limit(10000)); // Limit for performance

    const snapshot = await getDocs(q);
    const events = snapshot.docs.map((doc) => doc.data());

    // Generate compliance metrics
    const complianceMetrics = {
      totalEvents: events.length,
      authenticationEvents: events.filter((e) => e.eventType?.includes('USER_'))
        .length,
      dataAccessEvents: events.filter((e) => e.eventType === 'DATA_ACCESS')
        .length,
      policyEvents: events.filter((e) => e.eventType?.includes('POLICY_'))
        .length,
      documentEvents: events.filter((e) => e.eventType?.includes('DOCUMENT_'))
        .length,
      reportPeriod: {
        start: params.startDate || 'All time',
        end: params.endDate || 'Present',
      },
      generatedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      report: complianceMetrics,
      events: events.slice(0, 100), // Sample of events
      summary: `Generated compliance report for ${events.length} events`,
    });
  } catch (error) {
    console.error('Compliance report error:', error);
    return NextResponse.json(
      { error: 'Failed to generate compliance report' },
      { status: 500 },
    );
  }
}
