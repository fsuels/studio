// src/app/api/exports/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, query, filters, options, action = 'create' } = body;

    switch (action) {
      case 'create':
        return await handleCreateExport(userId, query, filters, options);

      case 'status':
        return await handleGetStatus(body.jobId);

      case 'list':
        return await handleListExports(userId);

      case 'stats':
        return await handleGetStats();

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Export API error:', error);

    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const jobId = searchParams.get('jobId');
    const userId = searchParams.get('userId');
    const action = searchParams.get('action') || 'status';

    switch (action) {
      case 'status':
        if (!jobId) {
          return NextResponse.json(
            { error: 'Job ID is required' },
            { status: 400 },
          );
        }
        return await handleGetStatus(jobId);

      case 'list':
        if (!userId) {
          return NextResponse.json(
            { error: 'User ID is required' },
            { status: 400 },
          );
        }
        return await handleListExports(userId);

      case 'stats':
        return await handleGetStats();

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Export GET API error:', error);

    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}

/**
 * Handle export creation
 */
async function handleCreateExport(
  userId: string,
  query: string,
  filters?: any,
  options?: any,
) {
  if (!userId || !query) {
    return NextResponse.json(
      { error: 'User ID and query are required' },
      { status: 400 },
    );
  }

  // Validate export options
  const validatedOptions = {
    format: options?.format || 'csv',
    includeContent: options?.includeContent !== false,
    includeMetadata: options?.includeMetadata !== false,
    includeFacets: options?.includeFacets || false,
    maxResults: Math.min(options?.maxResults || 1000, 50000), // Cap at 50k
    customFields: options?.customFields || [],
    groupBy: options?.groupBy || 'none',
    sortBy: options?.sortBy || 'relevance',
    sortOrder: options?.sortOrder || 'desc',
  };

  // Check user export limits (in production, implement proper rate limiting)
  const { exportService } = await import('@/lib/vector-search/export-service');
  const userJobs = exportService.getUserExportJobs(userId);
  const recentJobs = userJobs.filter((job) => {
    const jobTime = new Date(job.createdAt).getTime();
    const oneHourAgo = Date.now() - 60 * 60 * 1000;
    return jobTime > oneHourAgo;
  });

  if (recentJobs.length >= 5) {
    return NextResponse.json(
      {
        error: 'Export limit exceeded',
        message: 'Maximum 5 exports per hour allowed',
      },
      { status: 429 },
    );
  }

  const exportJob = await exportService.createExportJob(
    userId,
    query,
    filters,
    validatedOptions,
  );

  return NextResponse.json({
    success: true,
    job: exportJob,
  });
}

/**
 * Handle getting export status
 */
async function handleGetStatus(jobId: string) {
  const { exportService } = await import('@/lib/vector-search/export-service');
  const job = exportService.getExportJob(jobId);

  if (!job) {
    return NextResponse.json(
      { error: 'Export job not found' },
      { status: 404 },
    );
  }

  return NextResponse.json({
    job,
  });
}

/**
 * Handle listing user exports
 */
async function handleListExports(userId: string) {
  const { exportService } = await import('@/lib/vector-search/export-service');
  const jobs = exportService.getUserExportJobs(userId);

  return NextResponse.json({
    jobs,
    total: jobs.length,
  });
}

/**
 * Handle getting export statistics
 */
async function handleGetStats() {
  const { exportService } = await import('@/lib/vector-search/export-service');
  const stats = exportService.getExportStats();

  return NextResponse.json({
    stats,
  });
}
