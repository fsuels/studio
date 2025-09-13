// src/app/api/search/semantic/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { stringify } from 'csv-stringify/sync';

interface SearchParams {
  q: string;
  category?: string[];
  complexity?: string[];
  jurisdiction?: string[];
  governingLaw?: string[];
  dateStart?: string;
  dateEnd?: string;
  tags?: string[];
  parties?: string[];
  topK?: number;
  minScore?: number;
  format?: 'json' | 'csv';
  includeFacets?: boolean;
  savedView?: string;
}

interface SavedSearchView {
  id: string;
  name: string;
  query: string;
  filters: any;
  userId: string;
  createdAt: string;
  lastUsed: string;
  useCount: number;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const params = parseSearchParams(searchParams);

    // Validate required parameters
    if (!params.q?.trim()) {
      return NextResponse.json(
        { error: 'Query parameter "q" is required' },
        { status: 400 },
      );
    }

    // Build filters object
    const filters = {
      category: params.category,
      complexity: params.complexity,
      jurisdiction: params.jurisdiction,
      governingLaw: params.governingLaw,
      dateRange:
        params.dateStart && params.dateEnd
          ? {
              start: params.dateStart,
              end: params.dateEnd,
            }
          : undefined,
      tags: params.tags,
      parties: params.parties,
    };

    // Remove undefined values
    Object.keys(filters).forEach((key) => {
      if (filters[key as keyof typeof filters] === undefined) {
        delete filters[key as keyof typeof filters];
      }
    });

    // Search options
    const options = {
      topK: params.topK || 20,
      minScore: params.minScore || 0.7,
      includeMetadata: true,
      includeFacets: params.includeFacets !== false,
    };

    // Perform semantic search
    const { pineconeService } = await import('@/lib/vector-search/pinecone-service');
    const searchResponse = await pineconeService.semanticSearch(
      params.q,
      Object.keys(filters).length > 0 ? filters : undefined,
      options,
    );

    // Handle CSV export
    if (params.format === 'csv') {
      const csvData = generateCSV(searchResponse.results);
      const filename = `legal-docs-search-${Date.now()}.csv`;

      return new NextResponse(csvData, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="${filename}"`,
        },
      });
    }

    // Log search analytics (async, don't wait)
    logSearchAnalytics(params.q, filters, searchResponse.totalResults).catch(
      console.error,
    );

    // Update saved view usage if applicable
    if (params.savedView) {
      updateSavedViewUsage(params.savedView).catch(console.error);
    }

    // Return JSON response
    return NextResponse.json({
      query: params.q,
      filters: Object.keys(filters).length > 0 ? filters : undefined,
      results: searchResponse.results,
      totalResults: searchResponse.totalResults,
      facets: searchResponse.facets,
      suggestions: searchResponse.suggestions,
      responseTime: Date.now(),
    });
  } catch (error) {
    console.error('Semantic search API error:', error);

    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, ...params } = body;

    switch (action) {
      case 'bulk_search':
        return await handleBulkSearch(params);

      case 'save_view':
        return await handleSaveView(params);

      case 'export_async':
        return await handleAsyncExport(params);

      case 'similar_docs':
        return await handleSimilarDocuments(params);

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Semantic search POST error:', error);

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
 * Parse search parameters from URL
 */
function parseSearchParams(searchParams: URLSearchParams): SearchParams {
  return {
    q: searchParams.get('q') || '',
    category: searchParams.getAll('category').filter(Boolean),
    complexity: searchParams.getAll('complexity').filter(Boolean),
    jurisdiction: searchParams.getAll('jurisdiction').filter(Boolean),
    governingLaw: searchParams.getAll('governingLaw').filter(Boolean),
    dateStart: searchParams.get('dateStart') || undefined,
    dateEnd: searchParams.get('dateEnd') || undefined,
    tags: searchParams.getAll('tags').filter(Boolean),
    parties: searchParams.getAll('parties').filter(Boolean),
    topK: parseInt(searchParams.get('topK') || '20'),
    minScore: parseFloat(searchParams.get('minScore') || '0.7'),
    format: (searchParams.get('format') as 'json' | 'csv') || 'json',
    includeFacets: searchParams.get('includeFacets') !== 'false',
    savedView: searchParams.get('savedView') || undefined,
  };
}

/**
 * Generate CSV from search results
 */
function generateCSV(results: any[]): string {
  const csvData = results.map((result) => ({
    'Document ID': result.id,
    Title: result.metadata.title,
    Category: result.metadata.category,
    Complexity: result.metadata.complexity,
    Jurisdiction: result.metadata.jurisdiction || '',
    'Governing Law': result.metadata.governingLaw || '',
    'Created Date': result.metadata.createdAt,
    'Last Modified': result.metadata.lastModified,
    'Relevance Score': result.score.toFixed(3),
    Tags: Array.isArray(result.metadata.tags)
      ? result.metadata.tags.join('; ')
      : '',
    Parties: Array.isArray(result.metadata.parties)
      ? result.metadata.parties.join('; ')
      : '',
    Amounts: Array.isArray(result.metadata.amounts)
      ? result.metadata.amounts.join('; ')
      : '',
    'Key Dates': Array.isArray(result.metadata.dates)
      ? result.metadata.dates.join('; ')
      : '',
    Explanation: result.explanation || '',
    'Content Preview': result.metadata.content?.slice(0, 200) + '...' || '',
  }));

  return stringify(csvData, {
    header: true,
    quoted: true,
  });
}

/**
 * Handle bulk search requests
 */
async function handleBulkSearch(params: any) {
  const { queries, filters, options } = params;

  if (!Array.isArray(queries) || queries.length === 0) {
    return NextResponse.json(
      { error: 'Queries array is required' },
      { status: 400 },
    );
  }

  if (queries.length > 50) {
    return NextResponse.json(
      { error: 'Maximum 50 queries allowed per bulk request' },
      { status: 400 },
    );
  }

  const { pineconeService } = await import('@/lib/vector-search/pinecone-service');
  const results = await Promise.allSettled(
    queries.map(async (query: string) => {
      const searchResponse = await pineconeService.semanticSearch(
        query,
        filters,
        options,
      );
      return {
        query,
        results: searchResponse.results,
        totalResults: searchResponse.totalResults,
      };
    }),
  );

  const successfulResults = results
    .filter(
      (result): result is PromiseFulfilledResult<any> =>
        result.status === 'fulfilled',
    )
    .map((result) => result.value);

  const failedResults = results
    .filter(
      (result): result is PromiseRejectedResult => result.status === 'rejected',
    )
    .map((result, index) => ({
      query: queries[index],
      error: result.reason.message,
    }));

  return NextResponse.json({
    successful: successfulResults,
    failed: failedResults,
    totalQueries: queries.length,
  });
}

/**
 * Handle saving search views
 */
async function handleSaveView(params: any) {
  // This would integrate with your user authentication and database
  // For now, return a mock response
  const { name, query, filters, userId } = params;

  if (!name || !query || !userId) {
    return NextResponse.json(
      { error: 'Name, query, and userId are required' },
      { status: 400 },
    );
  }

  const savedView: SavedSearchView = {
    id: `view_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name,
    query,
    filters,
    userId,
    createdAt: new Date().toISOString(),
    lastUsed: new Date().toISOString(),
    useCount: 1,
  };

  // TODO: Save to database
  console.log('Saving search view:', savedView);

  return NextResponse.json({
    success: true,
    savedView,
  });
}

/**
 * Handle async export requests
 */
async function handleAsyncExport(params: any) {
  const { query, filters, format, email } = params;

  if (!query || !email) {
    return NextResponse.json(
      { error: 'Query and email are required for async export' },
      { status: 400 },
    );
  }

  // Generate export job ID
  const jobId = `export_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  // TODO: Queue export job using Cloud Tasks or similar
  console.log('Queuing export job:', {
    jobId,
    query,
    filters,
    format,
    email,
  });

  return NextResponse.json({
    success: true,
    jobId,
    estimatedTime: '5-10 minutes',
    message: 'Export job queued. You will receive an email when ready.',
  });
}

/**
 * Handle similar documents requests
 */
async function handleSimilarDocuments(params: any) {
  const { docId, topK = 10, minScore = 0.8 } = params;

  if (!docId) {
    return NextResponse.json(
      { error: 'Document ID is required' },
      { status: 400 },
    );
  }

  try {
    const similarDocs = await pineconeService.findSimilarDocuments(
      docId,
      topK,
      minScore,
    );

    return NextResponse.json({
      docId,
      similarDocuments: similarDocs,
      totalFound: similarDocs.length,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: 'Failed to find similar documents',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}

/**
 * Log search analytics (async)
 */
async function logSearchAnalytics(
  query: string,
  filters: any,
  totalResults: number,
): Promise<void> {
  try {
    // TODO: Implement analytics logging
    console.log('Search analytics:', {
      query,
      filters,
      totalResults,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Failed to log search analytics:', error);
  }
}

/**
 * Update saved view usage (async)
 */
async function updateSavedViewUsage(viewId: string): Promise<void> {
  try {
    // TODO: Update saved view usage in database
    console.log('Updating saved view usage:', viewId);
  } catch (error) {
    console.error('Failed to update saved view usage:', error);
  }
}
