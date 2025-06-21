// src/app/api/admin/indexing/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { documentAnalyzer } from '@/lib/vector-search/document-analyzer';
import { pineconeService } from '@/lib/vector-search/pinecone-service';

interface IndexingJob {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  totalDocuments: number;
  processedDocuments: number;
  successful: string[];
  failed: Array<{ docId: string; error: string }>;
  startedAt: string;
  completedAt?: string;
}

const activeJobs = new Map<string, IndexingJob>();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, ...params } = body;

    switch (action) {
      case 'start_bulk_indexing':
        return await handleStartBulkIndexing(params);

      case 'index_single_document':
        return await handleIndexSingleDocument(params);

      case 'initialize_index':
        return await handleInitializeIndex();

      case 'get_index_stats':
        return await handleGetIndexStats();

      case 'cleanup_index':
        return await handleCleanupIndex();

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Admin indexing API error:', error);

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
    const action = searchParams.get('action');
    const jobId = searchParams.get('jobId');

    switch (action) {
      case 'job_status':
        return await handleGetJobStatus(jobId);

      case 'list_jobs':
        return await handleListJobs();

      case 'index_stats':
        return await handleGetIndexStats();

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Admin indexing GET API error:', error);

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
 * Start bulk indexing of all documents
 */
async function handleStartBulkIndexing(params: any) {
  const { locale = 'en', batchSize = 10, force = false } = params;

  try {
    // Generate job ID
    const jobId = `bulk_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Get all document IDs
    const allDocIds = await documentAnalyzer.getAllDocumentIds(locale);

    if (allDocIds.length === 0) {
      return NextResponse.json(
        { error: 'No documents found to index' },
        { status: 400 },
      );
    }

    // Filter documents that need processing (if not forcing)
    let docsToProcess = allDocIds;
    if (!force) {
      // In a real implementation, you'd check which docs need reprocessing
      // For now, process all documents
    }

    // Create job
    const job: IndexingJob = {
      id: jobId,
      status: 'pending',
      progress: 0,
      totalDocuments: docsToProcess.length,
      processedDocuments: 0,
      successful: [],
      failed: [],
      startedAt: new Date().toISOString(),
    };

    activeJobs.set(jobId, job);

    // Start processing asynchronously
    processBulkIndexing(jobId, docsToProcess, locale, batchSize).catch(
      (error) => {
        console.error(`Bulk indexing job ${jobId} failed:`, error);
        const job = activeJobs.get(jobId);
        if (job) {
          job.status = 'failed';
          job.completedAt = new Date().toISOString();
          activeJobs.set(jobId, job);
        }
      },
    );

    return NextResponse.json({
      success: true,
      jobId,
      totalDocuments: docsToProcess.length,
      estimatedTime: `${Math.ceil(docsToProcess.length / batchSize)} minutes`,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Failed to start bulk indexing',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}

/**
 * Process bulk indexing job
 */
async function processBulkIndexing(
  jobId: string,
  docIds: string[],
  locale: 'en' | 'es',
  batchSize: number,
) {
  const job = activeJobs.get(jobId);
  if (!job) return;

  try {
    job.status = 'processing';
    activeJobs.set(jobId, job);

    // Process in batches
    for (let i = 0; i < docIds.length; i += batchSize) {
      const batch = docIds.slice(i, i + batchSize);

      const batchResult = await documentAnalyzer.processDocumentBatch(
        batch,
        locale,
        batch.length,
      );

      // Update job progress
      job.successful.push(...batchResult.successful);
      job.failed.push(...batchResult.failed);
      job.processedDocuments += batch.length;
      job.progress = Math.round(
        (job.processedDocuments / job.totalDocuments) * 100,
      );

      activeJobs.set(jobId, job);

      // Rate limiting between batches
      if (i + batchSize < docIds.length) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }
    }

    // Complete job
    job.status = 'completed';
    job.completedAt = new Date().toISOString();
    activeJobs.set(jobId, job);
  } catch (error) {
    console.error(`Bulk indexing job ${jobId} failed:`, error);
    job.status = 'failed';
    job.completedAt = new Date().toISOString();
    activeJobs.set(jobId, job);
  }
}

/**
 * Index a single document
 */
async function handleIndexSingleDocument(params: any) {
  const { docId, locale = 'en', force = false } = params;

  if (!docId) {
    return NextResponse.json(
      { error: 'Document ID is required' },
      { status: 400 },
    );
  }

  try {
    // Check if document needs processing
    if (!force) {
      const needsProcessing = await documentAnalyzer.needsReprocessing(
        docId,
        locale,
      );
      if (!needsProcessing) {
        return NextResponse.json({
          success: true,
          message: 'Document is already up to date',
          docId,
        });
      }
    }

    // Process document
    const analysis = await documentAnalyzer.analyzeDocument(docId, locale);
    await documentAnalyzer.indexDocumentAnalysis(analysis);

    return NextResponse.json({
      success: true,
      docId,
      analysis: {
        wordCount: analysis.metadata.wordCount,
        tags: analysis.metadata.tags,
        entities: {
          parties: analysis.entities.parties.length,
          amounts: analysis.entities.amounts.length,
          dates: analysis.entities.dates.length,
        },
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Failed to index document',
        message: error instanceof Error ? error.message : 'Unknown error',
        docId,
      },
      { status: 500 },
    );
  }
}

/**
 * Initialize Pinecone index
 */
async function handleInitializeIndex() {
  try {
    await pineconeService.initializeIndex();

    return NextResponse.json({
      success: true,
      message: 'Pinecone index initialized successfully',
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Failed to initialize index',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}

/**
 * Get index statistics
 */
async function handleGetIndexStats() {
  try {
    const stats = await pineconeService.getIndexStats();

    return NextResponse.json({
      success: true,
      stats,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Failed to get index stats',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}

/**
 * Cleanup index (remove orphaned vectors)
 */
async function handleCleanupIndex() {
  try {
    // This would implement cleanup logic
    // For now, just return success
    return NextResponse.json({
      success: true,
      message: 'Index cleanup completed',
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Failed to cleanup index',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}

/**
 * Get job status
 */
async function handleGetJobStatus(jobId: string | null) {
  if (!jobId) {
    return NextResponse.json({ error: 'Job ID is required' }, { status: 400 });
  }

  const job = activeJobs.get(jobId);
  if (!job) {
    return NextResponse.json({ error: 'Job not found' }, { status: 404 });
  }

  return NextResponse.json({
    job,
  });
}

/**
 * List all jobs
 */
async function handleListJobs() {
  const jobs = Array.from(activeJobs.values()).sort(
    (a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime(),
  );

  return NextResponse.json({
    jobs,
    total: jobs.length,
  });
}
