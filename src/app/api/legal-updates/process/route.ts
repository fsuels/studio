// src/app/api/legal-updates/process/route.ts
import { NextRequest, NextResponse } from 'next/server';

interface ProcessingResult {
  success: boolean;
  timestamp: string;
  rssResults: {
    totalUpdates: number;
    sourceResults: Array<{
      sourceId: string;
      sourceName: string;
      updateCount: number;
      success: boolean;
      error?: string;
    }>;
  };
  aiResults: {
    processed: number;
    failed: number;
    results: Array<{
      id: string;
      title: string;
      success: boolean;
      error?: string;
    }>;
  };
  error?: string;
}

// Authentication helper
function validateSchedulerRequest(request: NextRequest): boolean {
  // For Cloud Scheduler requests, validate the header
  const schedulerToken = request.headers.get('x-scheduler-token');
  const expectedToken = process.env.CLOUD_SCHEDULER_TOKEN;

  if (expectedToken && schedulerToken === expectedToken) {
    return true;
  }

  // For manual admin requests, validate admin token
  const authHeader = request.headers.get('authorization');
  const adminToken = authHeader?.replace('Bearer ', '');
  const expectedAdminToken = process.env.ADMIN_API_TOKEN;

  return adminToken === expectedAdminToken;
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    // Validate authentication
    if (!validateSchedulerRequest(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('Starting legal updates processing...');

    // Step 1: Fetch new updates from RSS feeds (lazy import heavy modules)
    console.log('Step 1: Fetching updates from RSS sources...');
    const { legalUpdateRSSParser } = await import(
      '@/lib/legal-updates/rss-parser'
    );
    const rssResults = await legalUpdateRSSParser.processAllSources();

    console.log(
      `RSS Processing complete: ${rssResults.totalUpdates} new updates`,
    );

    // Step 2: Process raw updates with AI (lazy import)
    console.log('Step 2: Processing updates with AI...');
    const { legalUpdateAISummarizer } = await import(
      '@/lib/legal-updates/ai-summarizer'
    );
    const aiResults = await legalUpdateAISummarizer.processPendingUpdates();

    console.log(
      `AI Processing complete: ${aiResults.processed} processed, ${aiResults.failed} failed`,
    );

    // Step 3: Log audit event (lazy import)
    const { auditService } = await import('@/services/firebase-audit-service');
    await auditService.logComplianceEvent('legal_updates_processed', {
      processingTime: Date.now() - startTime,
      rssUpdates: rssResults.totalUpdates,
      aiProcessed: aiResults.processed,
      aiFailed: aiResults.failed,
      timestamp: new Date().toISOString(),
    });

    const result: ProcessingResult = {
      success: true,
      timestamp: new Date().toISOString(),
      rssResults,
      aiResults,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Legal updates processing error:', error);

    // Log error event (lazy import)
    const { auditService } = await import('@/services/firebase-audit-service');
    await auditService.logComplianceEvent('legal_updates_error', {
      error: error instanceof Error ? error.message : 'Unknown error',
      processingTime: Date.now() - startTime,
      timestamp: new Date().toISOString(),
    });

    const result: ProcessingResult = {
      success: false,
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
      rssResults: { totalUpdates: 0, sourceResults: [] },
      aiResults: { processed: 0, failed: 0, results: [] },
    };

    return NextResponse.json(result, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    // Simple health check and manual trigger option
    const searchParams = request.nextUrl.searchParams;
    const action = searchParams.get('action');
    const adminToken = searchParams.get('admin_token');

    if (adminToken !== process.env.ADMIN_API_TOKEN) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    switch (action) {
      case 'status':
        return NextResponse.json({
          status: 'healthy',
          timestamp: new Date().toISOString(),
          service: 'legal-updates-processor',
        });

      case 'sources': {
        const { legalUpdateRSSParser } = await import(
          '@/lib/legal-updates/rss-parser'
        );
        const sources = await legalUpdateRSSParser.fetchAllActiveSources();
        return NextResponse.json({
          sources: sources.map((s) => ({
            id: s.id,
            name: s.name,
            jurisdiction: s.jurisdiction,
            type: s.type,
            isActive: s.isActive,
            lastFetched: s.lastFetched,
          })),
        });
      }

      case 'stats': {
        // Return processing statistics
        const { getAdmin } = await import('@/lib/firebase-admin');
        const { COLLECTIONS } = await import('@/lib/legal-updates/schema');
        const db = getAdmin().firestore();

        const [rawCount, processedCount] = await Promise.all([
          db.collection(COLLECTIONS.RAW_LEGAL_UPDATES).count().get(),
          db.collection(COLLECTIONS.PROCESSED_LEGAL_UPDATES).count().get(),
        ]);

        return NextResponse.json({
          statistics: {
            totalRawUpdates: rawCount.data().count,
            totalProcessedUpdates: processedCount.data().count,
            timestamp: new Date().toISOString(),
          },
        });
      }

      default:
        return NextResponse.json({
          message: 'Legal Updates Processing API',
          actions: ['status', 'sources', 'stats'],
          timestamp: new Date().toISOString(),
        });
    }
  } catch (error) {
    console.error('Legal updates API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
