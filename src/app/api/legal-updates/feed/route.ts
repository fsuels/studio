
// src/app/api/legal-updates/feed/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getAdmin } from '@/lib/firebase-admin';
import {
  ProcessedLegalUpdate,
  UserLegalUpdatePreferences,
  COLLECTIONS,
} from '@/lib/legal-updates/schema';

type FeedRequest = {
  userId?: string;
  limit: number;
  filter: 'all' | 'urgent' | 'unread';
  jurisdiction?: string;
  category?: string;
  offset: number;
};

interface UpdateWithUserData extends ProcessedLegalUpdate {
  isRead?: boolean;
  isBookmarked?: boolean;
  isDismissed?: boolean;
}

const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 50;

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const userId = searchParams.get('userId') || undefined;
    const rawLimit = Number.parseInt(searchParams.get('limit') ?? '', 10);
    const limit = Number.isFinite(rawLimit)
      ? Math.min(Math.max(rawLimit, 1), MAX_LIMIT)
      : DEFAULT_LIMIT;

    const rawOffset = Number.parseInt(searchParams.get('offset') ?? '', 10);
    const offset = Number.isFinite(rawOffset) && rawOffset > 0 ? rawOffset : 0;

    const filterParam = searchParams.get('filter');
    const allowedFilters: FeedRequest['filter'][] = ['all', 'urgent', 'unread'];
    const filter = allowedFilters.includes(filterParam as FeedRequest['filter'])
      ? (filterParam as FeedRequest['filter'])
      : 'all';

    const feedRequest: FeedRequest = {
      userId,
      limit,
      filter,
      jurisdiction: searchParams.get('jurisdiction') || undefined,
      category: searchParams.get('category') || undefined,
      offset,
    };

    let userPreferences: UserLegalUpdatePreferences | null = null;
    if (feedRequest.userId && feedRequest.userId !== 'anonymous') {
      const prefDoc = await getAdmin()
        .firestore()
        .collection(COLLECTIONS.USER_PREFERENCES)
        .doc(feedRequest.userId)
        .get();

      if (prefDoc.exists) {
        userPreferences = {
          id: prefDoc.id,
          ...(prefDoc.data() as UserLegalUpdatePreferences),
        };
      }
    }

    let query = getAdmin()
      .firestore()
      .collection(COLLECTIONS.PROCESSED_LEGAL_UPDATES)
      .where('status', '==', 'active')
      .orderBy('publishedDate', 'desc');

    if (feedRequest.jurisdiction) {
      query = query.where('jurisdiction', '==', feedRequest.jurisdiction);
    } else {
      const preferredJurisdictions = userPreferences?.jurisdictions ?? [];
      if (preferredJurisdictions.length > 0) {
        query = query.where('jurisdiction', 'in', preferredJurisdictions.slice(0, 10));
      }
    }

    if (feedRequest.category) {
      query = query.where('category', '==', feedRequest.category);
    } else {
      const preferredCategories = userPreferences?.categories ?? [];
      if (preferredCategories.length > 0) {
        query = query.where('category', 'in', preferredCategories.slice(0, 10));
      }
    }

    if (feedRequest.filter === 'urgent') {
      query = query.where('urgency', 'in', ['critical', 'high']);
    }

    if (userPreferences?.urgencyThreshold) {
      const thresholds: Array<UserLegalUpdatePreferences['urgencyThreshold']> = [
        'critical',
        'high',
        'medium',
        'low',
      ];
      const minUrgencyIndex = thresholds.indexOf(userPreferences.urgencyThreshold);
      const allowedUrgencies = thresholds.slice(0, minUrgencyIndex + 1);
      if (allowedUrgencies.length > 0) {
        query = query.where('urgency', 'in', allowedUrgencies);
      }
    }

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    query = query.where('publishedDate', '>=', thirtyDaysAgo);

    if (offset > 0) {
      query = query.offset(offset);
    }
    query = query.limit(limit);

    const snapshot = await query.get();
    const updates = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as ProcessedLegalUpdate),
    }));

    const updatesWithUserData: UpdateWithUserData[] = await Promise.all(
      updates.map(async (update) => {
        if (!feedRequest.userId || feedRequest.userId === 'anonymous') {
          return update;
        }

        const userInteraction = await getUserInteraction(
          feedRequest.userId,
          update.id,
        );

        return {
          ...update,
          isRead: userInteraction?.isRead ?? false,
          isBookmarked: userInteraction?.isBookmarked ?? false,
          isDismissed: userInteraction?.isDismissed ?? false,
        };
      }),
    );

    const filteredUpdates =
      feedRequest.filter === 'unread'
        ? updatesWithUserData.filter((u) => !u.isRead)
        : updatesWithUserData;

    const stats = await getFeedStatistics(feedRequest.userId);

    return NextResponse.json({
      success: true,
      updates: filteredUpdates,
      pagination: {
        limit,
        offset,
        hasMore: filteredUpdates.length === limit,
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
    const interactionDoc = await getAdmin()
      .firestore()
      .collection('user_legal_update_interactions')
      .doc(`${userId}_${updateId}`)
      .get();

    return interactionDoc.exists ? interactionDoc.data() : null;
  } catch (error) {
    console.error('Error fetching user interaction:', error);
    return null;
  }
}

async function getFeedStatistics(_userId?: string) {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const [totalSnapshot, recentSnapshot, urgentSnapshot] = await Promise.all([
      getAdmin()
        .firestore()
        .collection(COLLECTIONS.PROCESSED_LEGAL_UPDATES)
        .where('status', '==', 'active')
        .count()
        .get(),

      getAdmin()
        .firestore()
        .collection(COLLECTIONS.PROCESSED_LEGAL_UPDATES)
        .where('status', '==', 'active')
        .where('publishedDate', '>=', sevenDaysAgo)
        .count()
        .get(),

      getAdmin()
        .firestore()
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
