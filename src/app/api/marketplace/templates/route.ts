// src/app/api/marketplace/templates/route.ts
import { NextRequest, NextResponse } from 'next/server';
import type {
  MarketplaceTemplate,
  MarketplaceSearchFilters,
  MarketplaceSearchResult,
} from '@/types/marketplace';

/**
 * GET /api/marketplace/templates
 * Browse and search marketplace templates
 */
export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const searchParams = Object.fromEntries(url.searchParams);

    const filters: MarketplaceSearchFilters = {
      query: (searchParams.query || searchParams.search) || undefined,
      category: searchParams.category || undefined,
      tags: searchParams.tags ? searchParams.tags.split(',') : undefined,
      jurisdiction: searchParams.jurisdiction || undefined,
      states: searchParams.states ? searchParams.states.split(',') : undefined,
      language: searchParams.language || undefined,
      priceRange:
        searchParams.minPrice || searchParams.maxPrice
          ? {
              min: parseInt(searchParams.minPrice || '0'),
              max: parseInt(searchParams.maxPrice || '999999'),
            }
          : undefined,
      rating: searchParams.minRating
        ? {
            min: parseFloat(searchParams.minRating),
          }
        : undefined,
      createdBy: searchParams.createdBy || undefined,
      verified: searchParams.verified === 'true' || undefined,
      featured: searchParams.featured === 'true' || undefined,
      sortBy: (searchParams.sortBy as any) || 'relevance',
      sortOrder: (searchParams.sortOrder as 'asc' | 'desc') || 'desc',
    };

    const page = parseInt(searchParams.page || '1');
    const pageSize = Math.min(parseInt(searchParams.limit || '20'), 50); // Max 50 per page

    const db = await (await import('@/lib/firebase')).getDb();
    const { collection, query, where, orderBy, limit, startAfter, getDocs, doc, getDoc } =
      await import('firebase/firestore');
    const templatesRef = collection(db, 'marketplace-templates');

    // Build query based on filters
    let q = query(templatesRef);

    // Add filters
    if (filters.category) {
      q = query(q, where('category', '==', filters.category));
    }

    if (filters.jurisdiction) {
      q = query(q, where('jurisdiction', '==', filters.jurisdiction));
    }

    if (filters.verified !== undefined) {
      q = query(q, where('verified', '==', filters.verified));
    }

    if (filters.featured !== undefined) {
      q = query(q, where('featured', '==', filters.featured));
    }

    // Only show published templates
    q = query(q, where('moderationStatus', '==', 'approved'));
    q = query(q, where('visibility', '==', 'public'));

    // Add sorting
    switch (filters.sortBy) {
      case 'rating':
        q = query(q, orderBy('ratings.averageRating', filters.sortOrder));
        break;
      case 'downloads':
        q = query(q, orderBy('stats.totalDownloads', filters.sortOrder));
        break;
      case 'price':
        q = query(q, orderBy('pricing.basePrice', filters.sortOrder));
        break;
      case 'newest':
        q = query(q, orderBy('publishedAt', filters.sortOrder));
        break;
      case 'updated':
        q = query(q, orderBy('lastUpdated', filters.sortOrder));
        break;
      default:
        // Default to last updated for relevance
        q = query(q, orderBy('lastUpdated', 'desc'));
    }

    // Add pagination
    q = query(q, limit(pageSize));

    // Handle pagination cursor
    if (page > 1 && searchParams.cursor) {
      const cursorDoc = await getDoc(
        doc(db, 'marketplace-templates', searchParams.cursor),
      );
      if (cursorDoc.exists()) {
        q = query(q, startAfter(cursorDoc));
      }
    }

    const snapshot = await getDocs(q);
    let templates = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as MarketplaceTemplate[];

    // Apply client-side filters (for complex queries not supported by Firestore)
    if (filters.query) {
      const queryLower = filters.query.toLowerCase();
      templates = templates.filter(
        (template) =>
          template.name.toLowerCase().includes(queryLower) ||
          template.description.toLowerCase().includes(queryLower) ||
          template.tags.some((tag) => tag.toLowerCase().includes(queryLower)),
      );
    }

    if (filters.tags && filters.tags.length > 0) {
      templates = templates.filter((template) =>
        filters.tags!.some((tag) => template.tags.includes(tag)),
      );
    }

    if (filters.states && filters.states.length > 0) {
      templates = templates.filter(
        (template) =>
          template.states === 'all' ||
          (Array.isArray(template.states) &&
            filters.states!.some((state) => template.states.includes(state))),
      );
    }

    if (filters.language) {
      templates = templates.filter((template) =>
        template.languageSupport.includes(filters.language!),
      );
    }

    if (filters.priceRange) {
      templates = templates.filter(
        (template) =>
          template.pricing.basePrice >= filters.priceRange!.min &&
          template.pricing.basePrice <= filters.priceRange!.max,
      );
    }

    if (filters.rating) {
      templates = templates.filter(
        (template) => template.ratings.averageRating >= filters.rating!.min,
      );
    }

    if (filters.createdBy) {
      templates = templates.filter(
        (template) => template.createdBy === filters.createdBy,
      );
    }

    // Calculate relevance scores if searching
    const results: MarketplaceSearchResult[] = templates.map((template) => {
      let relevanceScore = 0;

      if (filters.query) {
        const query = filters.query.toLowerCase();

        // Higher score for exact matches in name
        if (template.name.toLowerCase().includes(query)) {
          relevanceScore += 10;
        }

        // Medium score for description matches
        if (template.description.toLowerCase().includes(query)) {
          relevanceScore += 5;
        }

        // Lower score for tag matches
        if (template.tags.some((tag) => tag.toLowerCase().includes(query))) {
          relevanceScore += 3;
        }

        // Boost score based on template quality
        relevanceScore += template.ratings.averageRating;
        relevanceScore += Math.log(template.stats.totalDownloads + 1);

        if (template.verified) relevanceScore += 5;
        if (template.featured) relevanceScore += 8;
      }

      return {
        template,
        currentVersion: undefined, // We'll fetch this separately if needed
        relevanceScore: relevanceScore || undefined,
      };
    });

    // Sort by relevance if searching
    if (filters.query && filters.sortBy === 'relevance') {
      results.sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0));
    }

    // Pagination info
    const hasMore = snapshot.docs.length >= pageSize;
    const lastDoc = snapshot.docs[snapshot.docs.length - 1];
    const nextCursor = hasMore ? lastDoc?.id : null;

    return NextResponse.json({
      success: true,
      data: {
        templates: results,
        pagination: {
          page,
          limit: pageSize,
          total: results.length,
          hasMore,
          nextCursor,
        },
        filters,
      },
    });
  } catch (error) {
    console.error('Marketplace templates API error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch templates',
      },
      { status: 500 },
    );
  }
}

/**
 * POST /api/marketplace/templates
 * Submit a new template to the marketplace
 */
export async function POST(request: NextRequest) {
  try {
    // Auth check
    const { getCurrentUser } = await import('@/lib/auth');
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse JSON safely
    let body: any;
    try {
      body = await request.json();
    } catch (_e) {
      return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
    }

    // Basic validation
    const name = (body.templateName || '').trim();
    if (!name || !(body.description || '').trim() || !(body.category || '').trim()) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    if (!body.pricing || typeof body.pricing.basePrice !== 'number' || body.pricing.basePrice < 0) {
      return NextResponse.json({ error: 'Invalid pricing' }, { status: 400 });
    }

    const { isValidVersion } = await import('@/lib/versioning/semantic-version');
    if (!isValidVersion(body.version)) {
      return NextResponse.json({ error: 'Invalid version' }, { status: 400 });
    }

    // Call submission workflow (mocked in tests)
    const { TemplateSubmissionWorkflow } = await import('@/lib/marketplace/template-submission-workflow');
    const workflow = new TemplateSubmissionWorkflow();
    try {
      const result = await (workflow as any).createTemplateDraft(user.uid, body);
      return NextResponse.json(
        {
          templateId: result.templateId,
          versionId: result.versionId,
        },
        { status: 201 },
      );
    } catch (submissionError) {
      console.error('Template submission workflow error:', submissionError);
      return NextResponse.json({ error: 'Submission failed' }, { status: 500 });
    }
  } catch (error) {
    console.error('Template submission error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to submit template',
      },
      { status: 500 },
    );
  }
}

