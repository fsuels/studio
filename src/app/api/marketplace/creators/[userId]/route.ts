// src/app/api/marketplace/creators/[userId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import type {
  CreatorProfile,
  MarketplaceTemplate,
  CreatorBadge,
} from '@/types/marketplace';

/**
 * GET /api/marketplace/creators/[userId]
 * Get creator profile with templates and statistics
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ userId: string }> },
) {
  try {
    const { userId } = await context.params;
    const url = new URL(request.url);

    const includeTemplates =
      url.searchParams.get('includeTemplates') === 'true';
    const includeStats = url.searchParams.get('includeStats') === 'true';
    const templateLimit = parseInt(
      url.searchParams.get('templateLimit') || '10',
    );

    const db = await getDb();

    // Get creator profile
    const profileRef = doc(db, 'creator-profiles', userId);
    const profileSnap = await getDoc(profileRef);

    if (!profileSnap.exists()) {
      // Create default profile if doesn't exist
      const defaultProfile = await createDefaultCreatorProfile(userId);
      return NextResponse.json({
        success: true,
        data: {
          profile: defaultProfile,
          templates: [],
          stats: null,
        },
      });
    }

    const profile = {
      userId,
      ...profileSnap.data(),
    } as CreatorProfile;

    const response: any = {
      profile,
    };

    // Optionally include creator's templates
    if (includeTemplates) {
      const templatesQuery = query(
        collection(db, 'marketplace-templates'),
        where('createdBy', '==', userId),
        where('moderationStatus', '==', 'approved'),
        where('visibility', '==', 'public'),
        orderBy('stats.totalDownloads', 'desc'),
        limit(templateLimit),
      );

      const templatesSnap = await getDocs(templatesQuery);
      const templates = templatesSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as MarketplaceTemplate[];

      response.templates = templates;
    }

    // Optionally include detailed statistics
    if (includeStats) {
      const stats = await calculateCreatorStats(userId);
      response.stats = stats;
    }

    return NextResponse.json({
      success: true,
      data: response,
    });
  } catch (error) {
    console.error('Get creator profile error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch creator profile',
      },
      { status: 500 },
    );
  }
}

/**
 * PATCH /api/marketplace/creators/[userId]
 * Update creator profile (requires authentication and ownership)
 */
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ userId: string }> },
) {
  try {
    // TODO: Add authentication
    // const user = await getCurrentUser(request);
    // if (!user) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const { userId } = await context.params;
    const body = await request.json();

    // Check permissions
    // if (user.id !== userId && !user.isAdmin) {
    //   return NextResponse.json(
    //     { error: 'Insufficient permissions' },
    //     { status: 403 }
    //   );
    // }

    const db = await getDb();
    const profileRef = doc(db, 'creator-profiles', userId);

    // Define allowed fields for update
    const allowedFields = [
      'displayName',
      'bio',
      'avatar',
      'website',
      'credentials',
      'specializations',
      'yearsExperience',
    ];

    const updateData: any = {};

    // Only update allowed fields
    for (const field of allowedFields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: 'No valid fields to update' },
        { status: 400 },
      );
    }

    updateData.updatedAt = serverTimestamp();

    // Check if profile exists, create if not
    const profileSnap = await getDoc(profileRef);
    if (!profileSnap.exists()) {
      const defaultProfile = await createDefaultCreatorProfile(userId);
      Object.assign(defaultProfile, updateData);
      await setDoc(profileRef, defaultProfile);
    } else {
      await updateDoc(profileRef, updateData);
    }

    return NextResponse.json({
      success: true,
      data: {
        userId,
        updated: Object.keys(updateData),
        message: 'Profile updated successfully',
      },
    });
  } catch (error) {
    console.error('Update creator profile error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update profile',
      },
      { status: 500 },
    );
  }
}

/**
 * Create default creator profile
 */
async function createDefaultCreatorProfile(
  userId: string,
): Promise<CreatorProfile> {
  const db = await getDb();

  const profile: CreatorProfile = {
    userId,
    displayName: `Creator ${userId.slice(0, 8)}`,
    bio: '',
    avatar: '',
    website: '',
    verified: false,
    badges: [],
    totalTemplates: 0,
    totalDownloads: 0,
    totalRevenue: 0,
    averageRating: 0,
    credentials: [],
    specializations: [],
    yearsExperience: 0,
  };

  const profileRef = doc(db, 'creator-profiles', userId);
  await setDoc(profileRef, {
    ...profile,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return profile;
}

/**
 * Calculate detailed creator statistics
 */
async function calculateCreatorStats(userId: string) {
  const db = await getDb();

  // Get all creator's templates
  const templatesQuery = query(
    collection(db, 'marketplace-templates'),
    where('createdBy', '==', userId),
  );
  const templatesSnap = await getDocs(templatesQuery);
  const templates = templatesSnap.docs.map((doc) =>
    doc.data(),
  ) as MarketplaceTemplate[];

  // Aggregate statistics
  const stats = {
    totalTemplates: templates.length,
    publishedTemplates: templates.filter(
      (t) => t.moderationStatus === 'approved',
    ).length,
    draftTemplates: templates.filter((t) => t.moderationStatus === 'pending')
      .length,

    totalDownloads: templates.reduce(
      (sum, t) => sum + (t.stats.totalDownloads || 0),
      0,
    ),
    totalInstalls: templates.reduce(
      (sum, t) => sum + (t.stats.totalInstalls || 0),
      0,
    ),
    totalRevenue: templates.reduce(
      (sum, t) => sum + (t.stats.totalRevenue || 0),
      0,
    ),

    averageRating: calculateWeightedAverageRating(templates),
    totalRatings: templates.reduce(
      (sum, t) => sum + (t.ratings.totalRatings || 0),
      0,
    ),

    // Monthly metrics
    monthlyDownloads: templates.reduce(
      (sum, t) => sum + (t.stats.downloadsThisMonth || 0),
      0,
    ),
    monthlyRevenue: templates.reduce(
      (sum, t) => sum + (t.stats.revenueThisMonth || 0),
      0,
    ),

    // Template categories
    categoriesBreakdown: calculateCategoryBreakdown(templates),

    // Top performing templates
    topTemplates: templates
      .filter((t) => t.moderationStatus === 'approved')
      .sort(
        (a, b) => (b.stats.totalDownloads || 0) - (a.stats.totalDownloads || 0),
      )
      .slice(0, 5)
      .map((t) => ({
        id: t.id,
        name: t.name,
        downloads: t.stats.totalDownloads,
        rating: t.ratings.averageRating,
        revenue: t.stats.totalRevenue,
      })),

    // Performance trends (simplified)
    growthMetrics: {
      templatesGrowth: 0, // TODO: Calculate month-over-month growth
      downloadsGrowth: 0,
      revenueGrowth: 0,
      ratingTrend: 'stable' as const,
    },
  };

  return stats;
}

/**
 * Calculate weighted average rating across all templates
 */
function calculateWeightedAverageRating(
  templates: MarketplaceTemplate[],
): number {
  let totalWeightedScore = 0;
  let totalRatings = 0;

  for (const template of templates) {
    const ratings = template.ratings.totalRatings || 0;
    const average = template.ratings.averageRating || 0;

    totalWeightedScore += average * ratings;
    totalRatings += ratings;
  }

  return totalRatings > 0
    ? Math.round((totalWeightedScore / totalRatings) * 100) / 100
    : 0;
}

/**
 * Calculate breakdown by template categories
 */
function calculateCategoryBreakdown(templates: MarketplaceTemplate[]) {
  const breakdown: Record<
    string,
    {
      count: number;
      downloads: number;
      revenue: number;
    }
  > = {};

  for (const template of templates) {
    const category = template.category || 'Other';

    if (!breakdown[category]) {
      breakdown[category] = {
        count: 0,
        downloads: 0,
        revenue: 0,
      };
    }

    breakdown[category].count++;
    breakdown[category].downloads += template.stats.totalDownloads || 0;
    breakdown[category].revenue += template.stats.totalRevenue || 0;
  }

  return breakdown;
}

/**
 * Award badge to creator (internal function)
 */
async function _awardBadge(
  userId: string,
  badgeId: string,
  badgeName: string,
  badgeDescription: string,
  badgeIcon: string,
  category: 'quality' | 'popularity' | 'contribution' | 'expertise',
) {
  const db = await getDb();
  const profileRef = doc(db, 'creator-profiles', userId);
  const profileSnap = await getDoc(profileRef);

  if (!profileSnap.exists()) {
    await createDefaultCreatorProfile(userId);
  }

  const newBadge: CreatorBadge = {
    id: badgeId,
    name: badgeName,
    description: badgeDescription,
    icon: badgeIcon,
    earnedAt: serverTimestamp() as any,
    category,
  };

  // Add badge to profile
  await updateDoc(profileRef, {
    badges: [...(profileSnap.data()?.badges || []), newBadge],
    updatedAt: serverTimestamp(),
  });
}
