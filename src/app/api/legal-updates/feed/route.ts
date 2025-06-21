// src/app/api/legal-updates/feed/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import {
  ProcessedLegalUpdate,
  UserLegalUpdatePreferences,
  COLLECTIONS,
} from '@/lib/legal-updates/schema';

interface FeedRequest {
  userId?: string;
  limit?: number;
  filter?: 'all' | 'urgent' | 'unread';
  jurisdiction?: string;
  category?: string;
  offset?: number;
}

interface UpdateWithUserData extends ProcessedLegalUpdate {
  isRead?: boolean;
  isBookmarked?: boolean;
  isDismissed?: boolean;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const feedRequest: FeedRequest = {
      userId: searchParams.get('userId') || undefined,
      limit: Math.min(parseInt(searchParams.get('limit') || '10'), 50),
      filter: (searchParams.get('filter') as any) || 'all',
      jurisdiction: searchParams.get('jurisdiction') || undefined,
      category: searchParams.get('category') || undefined,
      offset: parseInt(searchParams.get('offset') || '0'),
    };

    // Get user preferences if userId provided
    let userPreferences: UserLegalUpdatePreferences | null = null;
    if (feedRequest.userId && feedRequest.userId !== 'anonymous') {
      const prefDoc = await adminDb
        .collection(COLLECTIONS.USER_PREFERENCES)
        .doc(feedRequest.userId)
        .get();

      if (prefDoc.exists) {
        userPreferences = {
          id: prefDoc.id,
          ...prefDoc.data(),
        } as UserLegalUpdatePreferences;
      }
    }

    // Build query based on preferences and filters
    let query = adminDb
      .collection(COLLECTIONS.PROCESSED_LEGAL_UPDATES)
      .where('status', '==', 'active')
      .orderBy('publishedDate', 'desc');

    // Apply jurisdiction filter
    if (feedRequest.jurisdiction) {
      query = query.where('jurisdiction', '==', feedRequest.jurisdiction);
    } else if (userPreferences?.jurisdictions.length) {
      query = query.where('jurisdiction', 'in', userPreferences.jurisdictions);
    }

    // Apply category filter
    if (feedRequest.category) {
      query = query.where('category', '==', feedRequest.category);
    } else if (userPreferences?.categories.length) {
      query = query.where('category', 'in', userPreferences.categories);
    }

    // Apply urgency filter for urgent updates
    if (feedRequest.filter === 'urgent') {
      query = query.where('urgency', 'in', ['critical', 'high']);
    }

    // Apply urgency threshold from user preferences
    if (userPreferences?.urgencyThreshold) {
      const thresholds = ['critical', 'high', 'medium', 'low'];
      const minUrgencyIndex = thresholds.indexOf(
        userPreferences.urgencyThreshold,
      );
      const allowedUrgencies = thresholds.slice(0, minUrgencyIndex + 1);
      query = query.where('urgency', 'in', allowedUrgencies);
    }

    // Get recent updates (last 30 days by default)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    query = query.where('publishedDate', '>=', thirtyDaysAgo);

    // Apply pagination
    if (feedRequest.offset > 0) {
      query = query.offset(feedRequest.offset);
    }
    query = query.limit(feedRequest.limit);

    const snapshot = await query.get();
    const updates = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as ProcessedLegalUpdate[];

    // Get user interaction data
    const updatesWithUserData: UpdateWithUserData[] = await Promise.all(
      updates.map(async (update) => {
        if (!feedRequest.userId || feedRequest.userId === 'anonymous') {
          return update;
        }

        // Get user's interaction with this update
        const userInteraction = await getUserInteraction(
          feedRequest.userId,
          update.id,
        );

        return {
          ...update,
          isRead: userInteraction?.isRead || false,
          isBookmarked: userInteraction?.isBookmarked || false,
          isDismissed: userInteraction?.isDismissed || false,
        };
      }),
    );

    // Apply read/unread filter after getting user data
    const filteredUpdates =
      feedRequest.filter === 'unread'
        ? updatesWithUserData.filter((u) => !u.isRead)
        : updatesWithUserData;

    // Get summary statistics
    const stats = await getFeedStatistics(feedRequest.userId);

    return NextResponse.json({
      success: true,
      updates: filteredUpdates,
      pagination: {
        limit: feedRequest.limit,
        offset: feedRequest.offset,
        hasMore: filteredUpdates.length === feedRequest.limit,
      },
      stats,
      userPreferences: userPreferences
        ? {
            jurisdictions: userPreferences.jurisdictions,
            categories: userPreferences.categories,
            urgencyThreshold: userPreferences.urgencyThreshold,
          }
        : null,
    });
  } catch (error) {
    console.error('Legal updates feed error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch legal updates' },
      { status: 500 },
    );
  }
}

async function getUserInteraction(userId: string, updateId: string) {
  try {
    const interactionDoc = await adminDb
      .collection('user_legal_update_interactions')
      .doc(`${userId}_${updateId}`)
      .get();

    return interactionDoc.exists ? interactionDoc.data() : null;
  } catch (error) {
    console.error('Error fetching user interaction:', error);
    return null;
  }
}

async function getFeedStatistics(userId?: string) {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const [totalSnapshot, recentSnapshot, urgentSnapshot] = await Promise.all([
      adminDb
        .collection(COLLECTIONS.PROCESSED_LEGAL_UPDATES)
        .where('status', '==', 'active')
        .count()
        .get(),

      adminDb
        .collection(COLLECTIONS.PROCESSED_LEGAL_UPDATES)
        .where('status', '==', 'active')
        .where('publishedDate', '>=', sevenDaysAgo)
        .count()
        .get(),

      adminDb
        .collection(COLLECTIONS.PROCESSED_LEGAL_UPDATES)
        .where('status', '==', 'active')
        .where('urgency', 'in', ['critical', 'high'])
        .where('publishedDate', '>=', sevenDaysAgo)
        .count()
        .get(),
    ]);

    return {
      totalActive: totalSnapshot.data().count,
      recentCount: recentSnapshot.data().count,
      urgentCount: urgentSnapshot.data().count,
    };
  } catch (error) {
    console.error('Error fetching feed statistics:', error);
    return {
      totalActive: 0,
      recentCount: 0,
      urgentCount: 0,
    };
  }
}
