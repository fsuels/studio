// src/app/api/legal-updates/action/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { auditService } from '@/services/firebase-audit-service';
import { z } from 'zod';

const actionSchema = z.object({
  updateId: z.string(),
  action: z.enum(['read', 'bookmark', 'dismiss', 'share', 'click']),
  userId: z.string().optional(),
  metadata: z.record(z.any()).optional()
});

interface UserInteraction {
  userId: string;
  updateId: string;
  isRead: boolean;
  isBookmarked: boolean;
  isDismissed: boolean;
  readAt?: Date;
  bookmarkedAt?: Date;
  dismissedAt?: Date;
  lastInteractionAt: Date;
  interactionCount: number;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = actionSchema.parse(body);

    if (!validatedData.userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const { updateId, action, userId, metadata } = validatedData;
    const interactionId = `${userId}_${updateId}`;

    // Get current interaction state
    const interactionRef = adminDb
      .collection('user_legal_update_interactions')
      .doc(interactionId);
    
    const interactionDoc = await interactionRef.get();
    const currentInteraction = interactionDoc.exists 
      ? interactionDoc.data() as UserInteraction
      : {
          userId,
          updateId,
          isRead: false,
          isBookmarked: false,
          isDismissed: false,
          lastInteractionAt: new Date(),
          interactionCount: 0
        };

    // Update based on action
    const updatedInteraction = { ...currentInteraction };
    const now = new Date();

    switch (action) {
      case 'read':
        if (!updatedInteraction.isRead) {
          updatedInteraction.isRead = true;
          updatedInteraction.readAt = now;
        }
        break;

      case 'bookmark':
        updatedInteraction.isBookmarked = !updatedInteraction.isBookmarked;
        if (updatedInteraction.isBookmarked) {
          updatedInteraction.bookmarkedAt = now;
        } else {
          delete updatedInteraction.bookmarkedAt;
        }
        break;

      case 'dismiss':
        updatedInteraction.isDismissed = true;
        updatedInteraction.dismissedAt = now;
        break;

      case 'share':
      case 'click':
        // These don't change the interaction state but are tracked for analytics
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    updatedInteraction.lastInteractionAt = now;
    updatedInteraction.interactionCount += 1;

    // Save interaction
    await interactionRef.set(updatedInteraction);

    // Log analytics event
    await logAnalyticsEvent(updateId, userId, action, metadata);

    // Update legal update notification status if needed
    if (action === 'read') {
      await updateNotificationStatus(updateId, 'dashboardShown');
    }

    return NextResponse.json({
      success: true,
      action,
      interaction: {
        isRead: updatedInteraction.isRead,
        isBookmarked: updatedInteraction.isBookmarked,
        isDismissed: updatedInteraction.isDismissed
      }
    });

  } catch (error) {
    console.error('Legal update action error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request data', details: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to process action' },
      { status: 500 }
    );
  }
}

async function logAnalyticsEvent(
  updateId: string,
  userId: string,
  action: string,
  metadata?: Record<string, any>
) {
  try {
    const { COLLECTIONS } = await import('@/lib/legal-updates/schema');
    
    const analyticsEvent = {
      id: `${updateId}_${userId}_${Date.now()}`,
      updateId,
      userId,
      event: action,
      metadata: {
        ...metadata,
        userAgent: metadata?.userAgent || 'unknown',
        timestamp: new Date().toISOString()
      },
      timestamp: new Date(),
      source: 'dashboard'
    };

    await adminDb
      .collection(COLLECTIONS.ANALYTICS)
      .doc(analyticsEvent.id)
      .set(analyticsEvent);

    // Also log to audit service for compliance
    await auditService.logComplianceEvent('legal_update_interaction', {
      updateId,
      userId,
      action,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Failed to log analytics event:', error);
    // Don't fail the main request for analytics errors
  }
}

async function updateNotificationStatus(
  updateId: string,
  statusField: 'dashboardShown' | 'emailSent'
) {
  try {
    const { COLLECTIONS } = await import('@/lib/legal-updates/schema');
    
    const updateData: any = {
      [`notificationStatus.${statusField}`]: true,
      [`notificationStatus.${statusField}At`]: new Date()
    };

    await adminDb
      .collection(COLLECTIONS.PROCESSED_LEGAL_UPDATES)
      .doc(updateId)
      .update(updateData);

  } catch (error) {
    console.error('Failed to update notification status:', error);
    // Don't fail the main request
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId');
    const updateId = searchParams.get('updateId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    if (updateId) {
      // Get specific interaction
      const interactionRef = adminDb
        .collection('user_legal_update_interactions')
        .doc(`${userId}_${updateId}`);
      
      const interactionDoc = await interactionRef.get();
      
      if (!interactionDoc.exists) {
        return NextResponse.json({
          isRead: false,
          isBookmarked: false,
          isDismissed: false
        });
      }

      const interaction = interactionDoc.data();
      return NextResponse.json({
        isRead: interaction?.isRead || false,
        isBookmarked: interaction?.isBookmarked || false,
        isDismissed: interaction?.isDismissed || false,
        readAt: interaction?.readAt?.toDate?.()?.toISOString(),
        bookmarkedAt: interaction?.bookmarkedAt?.toDate?.()?.toISOString(),
        dismissedAt: interaction?.dismissedAt?.toDate?.()?.toISOString()
      });
    } else {
      // Get user's interaction summary
      const interactionsSnapshot = await adminDb
        .collection('user_legal_update_interactions')
        .where('userId', '==', userId)
        .orderBy('lastInteractionAt', 'desc')
        .limit(100)
        .get();

      const interactions = interactionsSnapshot.docs.map(doc => ({
        updateId: doc.data().updateId,
        isRead: doc.data().isRead,
        isBookmarked: doc.data().isBookmarked,
        isDismissed: doc.data().isDismissed,
        lastInteractionAt: doc.data().lastInteractionAt?.toDate?.()?.toISOString()
      }));

      const summary = {
        totalInteractions: interactions.length,
        readCount: interactions.filter(i => i.isRead).length,
        bookmarkedCount: interactions.filter(i => i.isBookmarked).length,
        dismissedCount: interactions.filter(i => i.isDismissed).length,
        recentInteractions: interactions.slice(0, 10)
      };

      return NextResponse.json(summary);
    }

  } catch (error) {
    console.error('Get interaction error:', error);
    return NextResponse.json(
      { error: 'Failed to get interaction data' },
      { status: 500 }
    );
  }
}