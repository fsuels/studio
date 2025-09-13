// src/app/api/collaboration/notifications/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { notificationService } from '@/lib/collaboration/notifications';
import { getAdmin } from '@/lib/firebase-admin';

export async function POST(request: NextRequest) {
  try {
    const { action, fcmToken, settings, notificationId } = await request.json();

    // Get Firebase Auth token from headers
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing authorization token' },
        { status: 401 },
      );
    }

    const idToken = authHeader.substring(7);
    const decodedToken = await getAdmin().auth().verifyIdToken(idToken);
    const userId = decodedToken.uid;

    switch (action) {
      case 'register_token':
        if (!fcmToken) {
          return NextResponse.json(
            { error: 'FCM token required' },
            { status: 400 },
          );
        }

        await notificationService.registerFCMToken(userId, fcmToken);
        return NextResponse.json({ success: true });

      case 'update_settings':
        if (!settings) {
          return NextResponse.json(
            { error: 'Settings required' },
            { status: 400 },
          );
        }

        await notificationService.updateNotificationSettings(userId, settings);
        return NextResponse.json({ success: true });

      case 'mark_read':
        if (!notificationId) {
          return NextResponse.json(
            { error: 'Notification ID required' },
            { status: 400 },
          );
        }

        await notificationService.markNotificationAsRead(
          userId,
          notificationId,
        );
        return NextResponse.json({ success: true });

      case 'mark_all_read':
        await notificationService.markAllNotificationsAsRead(userId);
        return NextResponse.json({ success: true });

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Notification management error:', error);
    return NextResponse.json(
      { error: 'Failed to process notification request' },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'all';
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Get Firebase Auth token from headers
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing authorization token' },
        { status: 401 },
      );
    }

    const idToken = authHeader.substring(7);
    const decodedToken = await auth.verifyIdToken(idToken);
    const userId = decodedToken.uid;

    // Get notifications from Firestore
    const adminDb = getAdmin().firestore();

    let query = adminDb
      .collection('notifications')
      .where('userId', '==', userId)
      .orderBy('timestamp', 'desc')
      .limit(limit)
      .offset(offset);

    if (type !== 'all') {
      query = query.where('type', '==', type);
    }

    const snapshot = await query.get();

    const notifications = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Get unread count
    const unreadSnapshot = await adminDb
      .collection('notifications')
      .where('userId', '==', userId)
      .where('read', '==', false)
      .count()
      .get();

    const unreadCount = unreadSnapshot.data().count;

    return NextResponse.json({
      notifications,
      unreadCount,
      hasMore: snapshot.docs.length === limit,
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    return NextResponse.json(
      { error: 'Failed to get notifications' },
      { status: 500 },
    );
  }
}
