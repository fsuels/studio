// src/app/api/marketplace/templates/route.ts
import { NextRequest, NextResponse } from 'next/server';
import type {
  CreatorProfile,
  MarketplaceTemplate,
  MarketplaceSearchFilters,
  MarketplaceSearchResult,
  TemplateVersion,
} from '@/types/marketplace';
import { DOCUMENT_MANIFEST } from '@/lib/documents/manifest.generated';
import type { DocumentManifestEntry } from '@/lib/documents/manifest.generated';
import type { Timestamp } from 'firebase/firestore';

const PLACEHOLDER_TEMPLATE_VERSION = {} as TemplateVersion;

const SYSTEM_CREATOR_PROFILE_BASE: Omit<CreatorProfile, 'totalTemplates' | 'totalDownloads' | 'totalRevenue' | 'averageRating'> = {
  userId: 'system',
  displayName: '123LegalDoc Publishing',
  bio: 'Curated manifest-backed templates generated from the internal library.',
  avatar: '',
  website: 'https://123legaldoc.example',
  verified: true,
  badges: [],
  credentials: [],
  specializations: [],
  yearsExperience: 12,
};

const MANIFEST_TEMPLATES: MarketplaceTemplate[] = DOCUMENT_MANIFEST.map((entry, index) =>
  createMarketplaceTemplate(entry, index),
);

function toTimestamp(date: Date): Timestamp {
  return {
    seconds: Math.floor(date.getTime() / 1000),
    nanoseconds: ((date.getTime() % 1000) * 1_000_000) >>> 0,
    toDate: () => date,
    toMillis: () => date.getTime(),
    isEqual: (other: Timestamp) =>
      typeof other?.toMillis === 'function' && other.toMillis() === date.getTime(),
    valueOf: () => date.getTime(),
  } as unknown as Timestamp;
}

function createMarketplaceTemplate(entry: DocumentManifestEntry, index: number): MarketplaceTemplate {
  const { meta } = entry;
  const createdAt = new Date(Date.UTC(2024, 0, 1 + (index % 28)));
  const updatedAt = new Date(createdAt.getTime() + (index % 14) * 86_400_000);

  const tagWeight = (meta.tags?.length ?? 0) * 15;
  const aliasWeight = (meta.aliases?.length ?? 0) * 5;
  const totalDownloads = 200 + tagWeight + aliasWeight + index * 7;
  const downloadsThisMonth = Math.max(10, Math.floor(totalDownloads * 0.25));
  const downloadsThisWeek = Math.max(5, Math.floor(totalDownloads * 0.1));

  const pricingType = meta.requiresNotary ? 'one-time' : 'free';
  const basePrice = meta.requiresNotary ? 2500 : 0; // cents

  const totalRevenue = Math.round((basePrice * totalDownloads) / 100);
  const monthlyRevenue = Math.round((basePrice * downloadsThisMonth) / 100);

  const totalRatings = Math.max(1, Math.floor(totalDownloads * 0.05));
  const ratingDistribution = {
    5: Math.max(1, Math.floor(totalRatings * 0.6)),
    4: Math.floor(totalRatings * 0.25),
    3: Math.floor(totalRatings * 0.1),
    2: Math.floor(totalRatings * 0.03),
    1: Math.max(0, totalRatings - Math.floor(totalRatings * 0.98)),
  } as const;
  const averageRating = Math.min(5, 4 + (aliasWeight % 10) / 20);

  const languageSupport = ['en'];
  if (meta.translations?.es?.name) {
    languageSupport.push('es');
  }

  const tags = meta.tags ?? [];
  const keywords = Array.from(
    new Set(
      [
        ...tags,
        ...(meta.aliases ?? []),
        meta.title,
        meta.category,
      ]
        .filter(Boolean)
        .map((value) => value!.toLowerCase()),
    ),
  );

  const creatorProfile: CreatorProfile = {
    ...SYSTEM_CREATOR_PROFILE_BASE,
    totalTemplates: DOCUMENT_MANIFEST.length,
    totalDownloads,
    totalRevenue,
    averageRating,
    specializations: [meta.category],
  };

  return {
    id: entry.id,
    slug: entry.id,
    name: meta.title ?? entry.id,
    description: meta.description ?? '',
    translations: meta.translations,
    createdBy: 'system',
    creatorProfile,
    maintainers: [],
    category: meta.category ?? 'General',
    tags,
    keywords,
    jurisdiction: meta.jurisdiction,
    states: meta.states && meta.states.length ? meta.states : 'all',
    languageSupport,
    visibility: 'public',
    pricing: {
      type: pricingType,
      basePrice,
      currency: 'USD',
      subscriptionInterval: pricingType === 'subscription' ? 'month' : undefined,
      pricePerUse: pricingType === 'usage-based' ? 25 : undefined,
      freeUsageLimit: pricingType === 'usage-based' ? 5 : undefined,
      creatorShare: 70,
      platformFee: 30,
    },
    licenseType: basePrice > 0 ? 'commercial' : 'free',
    currentVersion: '1.0.0',
    latestVersionId: 'v1',
    versions: ['v1'],
    stats: {
      totalDownloads,
      totalInstalls: Math.max(totalDownloads - 25, 0),
      totalRevenue,
      uniqueUsers: Math.max(Math.floor(totalDownloads * 0.8), 1),
      downloadsThisMonth,
      downloadsThisWeek,
      revenueThisMonth: monthlyRevenue,
      totalRatings,
      averageRating,
      completionRate: 94,
      forkCount: Math.floor(totalDownloads * 0.02),
      favoriteCount: Math.floor(totalDownloads * 0.1),
      reportCount: 0,
      versionCount: 1,
      lastVersionDate: toTimestamp(updatedAt),
      updateFrequency: 45,
    },
    ratings: {
      averageRating,
      totalRatings,
      ratingDistribution,
      recentTrend: 'stable',
      trendChange: 0,
    },
    publishedAt: toTimestamp(createdAt),
    lastUpdated: toTimestamp(updatedAt),
    featured: Boolean(meta.tags?.includes('featured')), 
    verified: true,
    moderationStatus: 'approved',
    moderatedBy: 'system',
    moderatedAt: toTimestamp(updatedAt),
    flaggedReasons: undefined,
  };
}

function filterTemplates(templates: MarketplaceTemplate[], filters: MarketplaceSearchFilters) {
  return templates.filter((template) => {
    if (filters.category && template.category !== filters.category) return false;
    if (filters.jurisdiction && template.jurisdiction !== filters.jurisdiction) return false;
    if (filters.verified !== undefined && template.verified !== filters.verified) return false;
    if (filters.featured !== undefined && template.featured !== filters.featured) return false;
    if (filters.tags && filters.tags.length > 0) {
      const tagMatch = filters.tags.some((tag) => template.tags.includes(tag));
      if (!tagMatch) return false;
    }
    if (filters.states && filters.states.length > 0) {
      if (Array.isArray(template.states)) {
        const stateMatch = filters.states.some((state) => template.states!.includes(state));
        if (!stateMatch) return false;
      } else if (template.states !== 'all') {
        return false;
      }
    }
    if (filters.language && !template.languageSupport.includes(filters.language)) {
      return false;
    }
    if (filters.priceRange) {
      if (
        template.pricing.basePrice < filters.priceRange.min ||
        template.pricing.basePrice > filters.priceRange.max
      ) {
        return false;
      }
    }
    if (filters.rating) {
      if (template.ratings.averageRating < filters.rating.min) {
        return false;
      }
    }
    if (filters.createdBy && template.createdBy !== filters.createdBy) {
      return false;
    }
    if (filters.query) {
      const needle = filters.query.toLowerCase();
      const matchesKeyword = template.keywords.some((keyword) => keyword.includes(needle));
      const matchesName = template.name.toLowerCase().includes(needle);
      const matchesDescription = template.description.toLowerCase().includes(needle);
      if (!matchesKeyword && !matchesName && !matchesDescription) {
        return false;
      }
    }

    return true;
  });
}

function sortTemplates(templates: MarketplaceTemplate[], filters: MarketplaceSearchFilters) {
  const sortBy = filters.sortBy ?? (filters.query ? 'relevance' : 'updated');
  if (sortBy === 'relevance') {
    return [...templates];
  }

  const sortOrder = filters.sortOrder ?? 'desc';
  const multiplier = sortOrder === 'asc' ? 1 : -1;

  const sorted = [...templates];

  const toMillis = (timestamp?: Timestamp) => {
    const maybe = timestamp as unknown as { toMillis?: () => number };
    return maybe?.toMillis ? maybe.toMillis() : 0;
  };

  switch (sortBy) {
    case 'rating':
      sorted.sort((a, b) => multiplier * (a.ratings.averageRating - b.ratings.averageRating));
      break;
    case 'downloads':
      sorted.sort((a, b) => multiplier * (a.stats.totalDownloads - b.stats.totalDownloads));
      break;
    case 'price':
      sorted.sort((a, b) => multiplier * (a.pricing.basePrice - b.pricing.basePrice));
      break;
    case 'newest':
      sorted.sort((a, b) => multiplier * (toMillis(a.publishedAt) - toMillis(b.publishedAt)));
      break;
    case 'updated':
    default:
      sorted.sort((a, b) => multiplier * (toMillis(a.lastUpdated) - toMillis(b.lastUpdated)));
      break;
  }

  return sorted;
}

function computeStartIndex(
  templates: MarketplaceTemplate[],
  page: number,
  pageSize: number,
  cursor?: string,
) {
  if (cursor) {
    const cursorIndex = templates.findIndex((template) => template.id === cursor);
    if (cursorIndex >= 0) {
      return cursorIndex + 1;
    }
  }

  return Math.max(0, (page - 1) * pageSize);
}

function calculateRelevanceScore(template: MarketplaceTemplate, query?: string) {
  if (!query) return undefined;

  const needle = query.toLowerCase();
  let score = 0;

  if (template.name.toLowerCase().includes(needle)) {
    score += 10;
  }
  if (template.description.toLowerCase().includes(needle)) {
    score += 5;
  }
  if (template.tags.some((tag) => tag.toLowerCase().includes(needle))) {
    score += 3;
  }
  if (template.keywords.some((keyword) => keyword.includes(needle))) {
    score += 2;
  }

  score += template.ratings.averageRating;
  score += Math.log(template.stats.totalDownloads + 1);

  if (template.verified) score += 5;
  if (template.featured) score += 8;

  return score;
}

function collectMatchedFields(template: MarketplaceTemplate, query?: string) {
  if (!query) return [] as string[];

  const needle = query.toLowerCase();
  const fields = new Set<string>();

  if (template.name.toLowerCase().includes(needle)) {
    fields.add('name');
  }
  if (template.description.toLowerCase().includes(needle)) {
    fields.add('description');
  }
  if (template.tags.some((tag) => tag.toLowerCase().includes(needle))) {
    fields.add('tags');
  }
  if (template.keywords.some((keyword) => keyword.includes(needle))) {
    fields.add('keywords');
  }

  return Array.from(fields);
}

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
              min: parseInt(searchParams.minPrice || '0', 10),
              max: parseInt(searchParams.maxPrice || '999999', 10),
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
      sortBy: (searchParams.sortBy as MarketplaceSearchFilters['sortBy']) || undefined,
      sortOrder: (searchParams.sortOrder as 'asc' | 'desc') || undefined,
    };

    const page = Math.max(1, parseInt(searchParams.page || '1', 10));
    const pageSize = Math.min(Math.max(parseInt(searchParams.limit || '20', 10), 1), 50);

    const filteredTemplates = filterTemplates(MANIFEST_TEMPLATES, filters);
    const sortedTemplates = sortTemplates(filteredTemplates, filters);

    const startIndex = computeStartIndex(sortedTemplates, page, pageSize, searchParams.cursor);
    const paginatedTemplates = sortedTemplates.slice(startIndex, startIndex + pageSize);
    const hasMore = startIndex + pageSize < sortedTemplates.length;
    const nextCursor = hasMore
      ? sortedTemplates[Math.min(startIndex + pageSize - 1, sortedTemplates.length - 1)]?.id ?? null
      : null;

    const results: MarketplaceSearchResult[] = paginatedTemplates.map((template) => {
      const relevanceScore = calculateRelevanceScore(template, filters.query);
      const matchedFields = collectMatchedFields(template, filters.query);

      return {
        template,
        currentVersion: PLACEHOLDER_TEMPLATE_VERSION,
        relevanceScore: relevanceScore ?? undefined,
        matchedFields: matchedFields.length ? matchedFields : undefined,
      };
    });

    if (filters.query && (filters.sortBy ?? 'relevance') === 'relevance') {
      results.sort((a, b) => (b.relevanceScore ?? 0) - (a.relevanceScore ?? 0));
    }

    return NextResponse.json({
      success: true,
      data: {
        templates: results,
        pagination: {
          page,
          limit: pageSize,
          total: sortedTemplates.length,
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
