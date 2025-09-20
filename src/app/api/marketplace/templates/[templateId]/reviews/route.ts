// src/app/api/marketplace/templates/[templateId]/reviews/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/firebase';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  serverTimestamp,
} from 'firebase/firestore';
import type {
  TemplateReview,
  MarketplaceTemplate,
  RatingsSummary,
} from '@/types/marketplace';

/**
 * GET /api/marketplace/templates/[templateId]/reviews
 * Get reviews for a template with pagination and filtering
 */
export async function GET(
  request: NextRequest,
  context: { params: { templateId: string } },
) {
  try {
    const { templateId } = context.params;
    const url = new URL(request.url);

    const page = parseInt(url.searchParams.get('page') || '1');
    const pageSize = Math.min(
      parseInt(url.searchParams.get('limit') || '10'),
      50,
    );
    const rating = url.searchParams.get('rating');
    const sortBy = url.searchParams.get('sortBy') || 'newest';
    const verified = url.searchParams.get('verified') === 'true';

    const db = await getDb();

    // Check if template exists
    const templateRef = doc(db, 'marketplace-templates', templateId);
    const templateSnap = await getDoc(templateRef);

    if (!templateSnap.exists()) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 },
      );
    }

    const template = templateSnap.data() as MarketplaceTemplate;

    // Build query
    const reviewsRef = collection(
      db,
      'marketplace-templates',
      templateId,
      'reviews',
    );
    let q = query(reviewsRef);

    // Add filters
    if (rating) {
      q = query(q, where('rating', '==', parseInt(rating)));
    }

    if (verified) {
      q = query(q, where('verified', '==', true));
    }

    // Only show approved reviews
    q = query(q, where('moderationStatus', '==', 'approved'));

    // Add sorting
    switch (sortBy) {
      case 'oldest':
        q = query(q, orderBy('createdAt', 'asc'));
        break;
      case 'rating-high':
        q = query(q, orderBy('rating', 'desc'), orderBy('createdAt', 'desc'));
        break;
      case 'rating-low':
        q = query(q, orderBy('rating', 'asc'), orderBy('createdAt', 'desc'));
        break;
      case 'helpful':
        q = query(q, orderBy('helpful', 'desc'), orderBy('createdAt', 'desc'));
        break;
      default: // newest
        q = query(q, orderBy('createdAt', 'desc'));
    }

    // Add pagination
    const offset = (page - 1) * pageSize;
    q = query(q, limit(pageSize));

    // Handle cursor-based pagination for large datasets
    if (page > 1) {
      const prevQuery = query(
        collection(db, 'marketplace-templates', templateId, 'reviews'),
        orderBy('createdAt', 'desc'),
        limit(offset),
      );
      const prevSnap = await getDocs(prevQuery);
      if (prevSnap.docs.length > 0) {
        const lastDoc = prevSnap.docs[prevSnap.docs.length - 1];
        q = query(q, startAfter(lastDoc));
      }
    }

    const reviewsSnap = await getDocs(q);
    const reviews = reviewsSnap.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as TemplateReview[];

    // Calculate pagination info
    const hasMore = reviews.length === pageSize;

    return NextResponse.json({
      success: true,
      data: {
        reviews,
        pagination: {
          page,
          limit: pageSize,
          hasMore,
          total: template.ratings.totalRatings,
        },
        summary: template.ratings,
        filters: {
          rating,
          sortBy,
          verified,
        },
      },
    });
  } catch (error) {
    console.error('Get reviews error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch reviews',
      },
      { status: 500 },
    );
  }
}

/**
 * POST /api/marketplace/templates/[templateId]/reviews
 * Create a new review for a template
 */
export async function POST(
  request: NextRequest,
  context: { params: { templateId: string } },
) {
  try {
    // TODO: Add authentication
    // const user = await getCurrentUser(request);
    // if (!user) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const { templateId } = context.params;
    const body = await request.json();
    const { rating, title, comment, pros, cons, templateVersion } = body;

    // Validate required fields
    if (!rating || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: 'Valid rating (1-5) is required' },
        { status: 400 },
      );
    }

    const userId = 'user-id'; // TODO: Get from auth
    const db = await getDb();

    // Check if template exists
    const templateRef = doc(db, 'marketplace-templates', templateId);
    const templateSnap = await getDoc(templateRef);

    if (!templateSnap.exists()) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 },
      );
    }

    const template = templateSnap.data() as MarketplaceTemplate;

    // Check if user has already reviewed this template
    const existingReviewQuery = query(
      collection(db, 'marketplace-templates', templateId, 'reviews'),
      where('reviewerId', '==', userId),
    );
    const existingReviewSnap = await getDocs(existingReviewQuery);

    if (!existingReviewSnap.empty) {
      return NextResponse.json(
        { error: 'You have already reviewed this template' },
        { status: 409 },
      );
    }

    // Check if user has installed/purchased the template
    const installationQuery = query(
      collection(db, 'users', userId, 'template-installations'),
      where('templateId', '==', templateId),
      where('status', 'in', ['active', 'expired']),
    );
    const installationSnap = await getDocs(installationQuery);
    const hasInstalled = !installationSnap.empty;

    // Create review
    const reviewRef = doc(
      collection(db, 'marketplace-templates', templateId, 'reviews'),
    );
    const review: TemplateReview = {
      id: reviewRef.id,
      templateId,
      templateVersion: templateVersion || template.currentVersion,
      rating: rating as 1 | 2 | 3 | 4 | 5,
      title: title || undefined,
      comment: comment || undefined,
      pros: pros || undefined,
      cons: cons || undefined,
      reviewerId: userId,
      reviewerName: undefined, // TODO: Get from user profile or anonymize
      verified: hasInstalled,
      createdAt: serverTimestamp() as any,
      helpful: 0,
      notHelpful: 0,
      flagged: false,
      moderationStatus: 'approved', // TODO: Add moderation workflow for sensitive content
    };

    await setDoc(reviewRef, review);

    // Update template ratings
    await updateTemplateRatings(templateId, template, rating);

    return NextResponse.json({
      success: true,
      data: {
        review,
        message: 'Review submitted successfully',
      },
    });
  } catch (error) {
    console.error('Create review error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to submit review',
      },
      { status: 500 },
    );
  }
}

/**
 * Update template ratings summary
 */
async function updateTemplateRatings(
  templateId: string,
  template: MarketplaceTemplate,
  newRating: number,
) {
  const db = await getDb();
  const templateRef = doc(db, 'marketplace-templates', templateId);

  const currentRatings = template.ratings;
  const totalRatings = currentRatings.totalRatings + 1;

  // Calculate new average
  const currentTotal =
    currentRatings.averageRating * currentRatings.totalRatings;
  const newAverage = (currentTotal + newRating) / totalRatings;

  // Update rating distribution
  const newDistribution = { ...currentRatings.ratingDistribution };
  newDistribution[newRating as keyof typeof newDistribution]++;

  // Calculate trend (simplified - compare with previous period)
  let recentTrend: 'improving' | 'declining' | 'stable' = 'stable';
  let trendChange = 0;

  if (totalRatings > 10) {
    const recentAverage = newAverage;
    const previousAverage = currentRatings.averageRating;
    const change = ((recentAverage - previousAverage) / previousAverage) * 100;

    if (change > 2) {
      recentTrend = 'improving';
      trendChange = change;
    } else if (change < -2) {
      recentTrend = 'declining';
      trendChange = change;
    }
  }

  const updatedRatings: RatingsSummary = {
    averageRating: Math.round(newAverage * 100) / 100, // Round to 2 decimal places
    totalRatings,
    ratingDistribution: newDistribution,
    recentTrend,
    trendChange,
  };

  await updateDoc(templateRef, {
    ratings: updatedRatings,
    'stats.totalRatings': totalRatings,
    'stats.averageRating': updatedRatings.averageRating,
    lastUpdated: serverTimestamp(),
  });
}
