// API endpoints for session replay functionality
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { SessionReplayAPI } from '@/lib/support-toolkit/session-replay';

export async function GET(request: NextRequest) {
  // Require admin authentication
  const adminResult = await requireAdmin(request);
  if (adminResult instanceof Response) {
    return adminResult;
  }

  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');
    const ticketId = url.searchParams.get('ticketId');
    const hasErrors = url.searchParams.get('hasErrors') === 'true';
    const startDate = url.searchParams.get('startDate');
    const endDate = url.searchParams.get('endDate');
    const documentTypes = url.searchParams.get('documentTypes')?.split(',').filter(Boolean);
    const tags = url.searchParams.get('tags')?.split(',').filter(Boolean);
    const limit = parseInt(url.searchParams.get('limit') || '10');

    let sessions;

    if (ticketId) {
      // Get sessions linked to a specific support ticket
      sessions = await SessionReplayAPI.getSessionsByTicket(ticketId);
    } else if (userId) {
      // Get sessions for a specific user
      sessions = await SessionReplayAPI.getSessionsByUser(userId, limit);
    } else {
      // Search sessions with filters
      const filters = {
        hasErrors,
        documentTypes,
        tags,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
      };

      sessions = await SessionReplayAPI.searchSessions(filters);
    }

    // Calculate session analytics
    const analytics = {
      totalSessions: sessions.length,
      errorRate: sessions.filter(s => s.events.some(e => e.type === 'error')).length / sessions.length,
      averageDuration: sessions.reduce((sum, s) => sum + (s.duration || 0), 0) / sessions.length,
      topDocumentTypes: getTopDocumentTypes(sessions),
      commonErrorPatterns: getCommonErrorPatterns(sessions),
    };

    return NextResponse.json({
      success: true,
      data: {
        sessions: sessions.slice(0, limit),
        analytics,
        total: sessions.length,
      }
    });

  } catch (error) {
    console.error('Session replay API error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to retrieve session replays' 
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const adminResult = await requireAdmin(request);
  if (adminResult instanceof Response) {
    return adminResult;
  }

  try {
    const body = await request.json();
    const { action, sessionId, ticketId, tags } = body;

    switch (action) {
      case 'link_to_ticket':
        if (!sessionId || !ticketId) {
          return NextResponse.json(
            { success: false, error: 'Session ID and Ticket ID are required' },
            { status: 400 }
          );
        }
        
        await SessionReplayAPI.linkSessionToTicket(sessionId, ticketId);
        return NextResponse.json({ success: true, message: 'Session linked to ticket' });

      case 'add_tags':
        if (!sessionId || !tags || !Array.isArray(tags)) {
          return NextResponse.json(
            { success: false, error: 'Session ID and tags array are required' },
            { status: 400 }
          );
        }
        
        await SessionReplayAPI.addSessionTags(sessionId, tags);
        return NextResponse.json({ success: true, message: 'Tags added to session' });

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Session replay POST error:', error);
    
    return NextResponse.json(
      { success: false, error: 'Failed to process request' },
      { status: 500 }
    );
  }
}

// Helper functions for analytics
function getTopDocumentTypes(sessions: any[]): Array<{ type: string; count: number }> {
  const documentTypes = new Map<string, number>();
  
  sessions.forEach(session => {
    session.events
      .filter((event: any) => event.type === 'document_action')
      .forEach((event: any) => {
        const type = event.data.documentType;
        if (type) {
          documentTypes.set(type, (documentTypes.get(type) || 0) + 1);
        }
      });
  });

  return Array.from(documentTypes.entries())
    .map(([type, count]) => ({ type, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
}

function getCommonErrorPatterns(sessions: any[]): Array<{ pattern: string; count: number; impact: string }> {
  const errorPatterns = new Map<string, number>();
  
  sessions.forEach(session => {
    session.events
      .filter((event: any) => event.type === 'error')
      .forEach((event: any) => {
        const errorMessage = event.data.errorMessage || 'Unknown error';
        const pattern = extractErrorPattern(errorMessage);
        errorPatterns.set(pattern, (errorPatterns.get(pattern) || 0) + 1);
      });
  });

  return Array.from(errorPatterns.entries())
    .map(([pattern, count]) => ({
      pattern,
      count,
      impact: count > 10 ? 'high' : count > 5 ? 'medium' : 'low'
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
}

function extractErrorPattern(errorMessage: string): string {
  // Extract common error patterns
  if (errorMessage.includes('Network Error')) return 'Network connectivity issues';
  if (errorMessage.includes('Timeout')) return 'Request timeout errors';
  if (errorMessage.includes('TypeError')) return 'JavaScript type errors';
  if (errorMessage.includes('Firebase')) return 'Firebase/database errors';
  if (errorMessage.includes('Stripe')) return 'Payment processing errors';
  if (errorMessage.includes('PDF')) return 'Document generation errors';
  if (errorMessage.includes('Auth')) return 'Authentication errors';
  
  // Return first 50 characters if no pattern matches
  return errorMessage.slice(0, 50) + (errorMessage.length > 50 ? '...' : '');
}