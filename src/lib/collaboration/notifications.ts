// src/lib/collaboration/notifications.ts
import { getMessaging } from 'firebase-admin/messaging';
import { firestore } from '@/lib/firebase-admin';
import { CollaborationUser } from './client';

export interface NotificationPayload {
  title: string;
  body: string;
  data?: Record<string, string>;
  userId: string;
  documentId: string;
  type: 'mention' | 'comment' | 'join' | 'leave' | 'resolve' | 'edit';
}

export interface UserNotificationSettings {
  mentions: boolean;
  comments: boolean;
  documentUpdates: boolean;
  userJoined: boolean;
  pushEnabled: boolean;
  emailEnabled: boolean;
}

export class CollaborationNotificationService {
  private messaging = getMessaging();

  async sendMentionNotification(
    fromUser: CollaborationUser,
    toUserId: string,
    documentId: string,
    content: string,
    documentTitle?: string,
  ): Promise<void> {
    try {
      const payload: NotificationPayload = {
        title: `${fromUser.name} mentioned you`,
        body:
          content.length > 100 ? `${content.substring(0, 100)}...` : content,
        data: {
          type: 'mention',
          documentId,
          fromUserId: fromUser.id,
          timestamp: Date.now().toString(),
        },
        userId: toUserId,
        documentId,
        type: 'mention',
      };

      await this.sendNotification(payload);
      await this.storeMentionInDatabase(
        fromUser,
        toUserId,
        documentId,
        content,
      );
    } catch (error) {
      console.error('Failed to send mention notification:', error);
    }
  }

  async sendCommentNotification(
    author: CollaborationUser,
    documentId: string,
    content: string,
    collaboratorIds: string[],
    documentTitle?: string,
  ): Promise<void> {
    try {
      const notifications = collaboratorIds
        .filter((id) => id !== author.id)
        .map((userId) => ({
          title: `New comment from ${author.name}`,
          body:
            content.length > 100 ? `${content.substring(0, 100)}...` : content,
          data: {
            type: 'comment',
            documentId,
            authorId: author.id,
            timestamp: Date.now().toString(),
          },
          userId,
          documentId,
          type: 'comment' as const,
        }));

      await Promise.all(
        notifications.map((payload) => this.sendNotification(payload)),
      );
    } catch (error) {
      console.error('Failed to send comment notifications:', error);
    }
  }

  async sendUserJoinedNotification(
    user: CollaborationUser,
    documentId: string,
    collaboratorIds: string[],
    documentTitle?: string,
  ): Promise<void> {
    try {
      const notifications = collaboratorIds
        .filter((id) => id !== user.id)
        .map((userId) => ({
          title: `${user.name} joined the document`,
          body: documentTitle
            ? `Now collaborating on "${documentTitle}"`
            : 'Started collaborating',
          data: {
            type: 'join',
            documentId,
            userId: user.id,
            timestamp: Date.now().toString(),
          },
          userId,
          documentId,
          type: 'join' as const,
        }));

      await Promise.all(
        notifications.map((payload) => this.sendNotification(payload)),
      );
    } catch (error) {
      console.error('Failed to send user joined notifications:', error);
    }
  }

  async sendDocumentUpdateNotification(
    author: CollaborationUser,
    documentId: string,
    updateType: string,
    collaboratorIds: string[],
    documentTitle?: string,
  ): Promise<void> {
    try {
      const notifications = collaboratorIds
        .filter((id) => id !== author.id)
        .map((userId) => ({
          title: `Document updated by ${author.name}`,
          body: `${updateType} in "${documentTitle || 'document'}"`,
          data: {
            type: 'edit',
            documentId,
            authorId: author.id,
            updateType,
            timestamp: Date.now().toString(),
          },
          userId,
          documentId,
          type: 'edit' as const,
        }));

      await Promise.all(
        notifications.map((payload) => this.sendNotification(payload)),
      );
    } catch (error) {
      console.error('Failed to send document update notifications:', error);
    }
  }

  private async sendNotification(payload: NotificationPayload): Promise<void> {
    // Check user notification settings
    const settings = await this.getUserNotificationSettings(payload.userId);

    if (!settings.pushEnabled) {
      return;
    }

    // Check if user has disabled this type of notification
    if (!this.shouldSendNotificationType(payload.type, settings)) {
      return;
    }

    // Get user's FCM tokens
    const tokens = await this.getUserFCMTokens(payload.userId);

    if (tokens.length === 0) {
      console.log(`No FCM tokens found for user ${payload.userId}`);
      return;
    }

    const message = {
      notification: {
        title: payload.title,
        body: payload.body,
      },
      data: payload.data || {},
      tokens,
      android: {
        notification: {
          channelId: 'collaboration',
          priority: 'high' as const,
          defaultSound: true,
        },
      },
      apns: {
        payload: {
          aps: {
            sound: 'default',
            badge: await this.getUnreadCount(payload.userId),
          },
        },
      },
      webpush: {
        notification: {
          title: payload.title,
          body: payload.body,
          icon: '/icons/collaboration.png',
          badge: '/icons/badge.png',
          tag: `${payload.type}-${payload.documentId}`,
          requireInteraction: payload.type === 'mention',
        },
        fcmOptions: {
          link: `${process.env.NEXT_PUBLIC_APP_URL}/documents/${payload.documentId}`,
        },
      },
    };

    try {
      const response = await this.messaging.sendEachForMulticast(message);

      // Handle failed tokens
      if (response.failureCount > 0) {
        const failedTokens: string[] = [];
        response.responses.forEach((resp, idx) => {
          if (!resp.success) {
            failedTokens.push(tokens[idx]);
            console.error(
              `Failed to send to token ${tokens[idx]}:`,
              resp.error,
            );
          }
        });

        // Remove invalid tokens
        await this.removeInvalidTokens(payload.userId, failedTokens);
      }

      console.log(
        `Successfully sent notification to ${response.successCount} devices`,
      );
    } catch (error) {
      console.error('Failed to send FCM notification:', error);
    }
  }

  private async getUserNotificationSettings(
    userId: string,
  ): Promise<UserNotificationSettings> {
    try {
      const doc = await firestore.collection('user_settings').doc(userId).get();

      if (!doc.exists) {
        // Return default settings
        return {
          mentions: true,
          comments: true,
          documentUpdates: false,
          userJoined: false,
          pushEnabled: true,
          emailEnabled: true,
        };
      }

      const data = doc.data();
      return {
        mentions: data?.notifications?.mentions ?? true,
        comments: data?.notifications?.comments ?? true,
        documentUpdates: data?.notifications?.documentUpdates ?? false,
        userJoined: data?.notifications?.userJoined ?? false,
        pushEnabled: data?.notifications?.pushEnabled ?? true,
        emailEnabled: data?.notifications?.emailEnabled ?? true,
      };
    } catch (error) {
      console.error('Failed to get user notification settings:', error);
      return {
        mentions: true,
        comments: true,
        documentUpdates: false,
        userJoined: false,
        pushEnabled: true,
        emailEnabled: true,
      };
    }
  }

  private shouldSendNotificationType(
    type: string,
    settings: UserNotificationSettings,
  ): boolean {
    switch (type) {
      case 'mention':
        return settings.mentions;
      case 'comment':
        return settings.comments;
      case 'edit':
        return settings.documentUpdates;
      case 'join':
      case 'leave':
        return settings.userJoined;
      default:
        return true;
    }
  }

  private async getUserFCMTokens(userId: string): Promise<string[]> {
    try {
      const doc = await firestore
        .collection('user_fcm_tokens')
        .doc(userId)
        .get();

      if (!doc.exists) {
        return [];
      }

      const data = doc.data();
      return data?.tokens || [];
    } catch (error) {
      console.error('Failed to get user FCM tokens:', error);
      return [];
    }
  }

  private async removeInvalidTokens(
    userId: string,
    tokens: string[],
  ): Promise<void> {
    try {
      const docRef = firestore.collection('user_fcm_tokens').doc(userId);

      await firestore.runTransaction(async (transaction) => {
        const doc = await transaction.get(docRef);

        if (doc.exists) {
          const data = doc.data();
          const currentTokens = data?.tokens || [];
          const validTokens = currentTokens.filter(
            (token: string) => !tokens.includes(token),
          );

          transaction.update(docRef, { tokens: validTokens });
        }
      });
    } catch (error) {
      console.error('Failed to remove invalid tokens:', error);
    }
  }

  private async getUnreadCount(userId: string): Promise<number> {
    try {
      const snapshot = await firestore
        .collection('notifications')
        .where('userId', '==', userId)
        .where('read', '==', false)
        .count()
        .get();

      return snapshot.data().count;
    } catch (error) {
      console.error('Failed to get unread count:', error);
      return 0;
    }
  }

  private async storeMentionInDatabase(
    fromUser: CollaborationUser,
    toUserId: string,
    documentId: string,
    content: string,
  ): Promise<void> {
    try {
      await firestore.collection('mentions').add({
        fromUserId: fromUser.id,
        fromUserName: fromUser.name,
        toUserId,
        documentId,
        content,
        timestamp: Date.now(),
        read: false,
      });
    } catch (error) {
      console.error('Failed to store mention in database:', error);
    }
  }

  async registerFCMToken(userId: string, token: string): Promise<void> {
    try {
      const docRef = firestore.collection('user_fcm_tokens').doc(userId);

      await firestore.runTransaction(async (transaction) => {
        const doc = await transaction.get(docRef);

        if (doc.exists) {
          const data = doc.data();
          const tokens = data?.tokens || [];

          if (!tokens.includes(token)) {
            tokens.push(token);
            transaction.update(docRef, { tokens });
          }
        } else {
          transaction.set(docRef, { tokens: [token] });
        }
      });
    } catch (error) {
      console.error('Failed to register FCM token:', error);
    }
  }

  async updateNotificationSettings(
    userId: string,
    settings: Partial<UserNotificationSettings>,
  ): Promise<void> {
    try {
      const docRef = firestore.collection('user_settings').doc(userId);

      await docRef.set(
        {
          notifications: settings,
          updatedAt: Date.now(),
        },
        { merge: true },
      );
    } catch (error) {
      console.error('Failed to update notification settings:', error);
    }
  }

  async markNotificationAsRead(
    userId: string,
    notificationId: string,
  ): Promise<void> {
    try {
      await firestore
        .collection('notifications')
        .doc(notificationId)
        .update({ read: true, readAt: Date.now() });
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  }

  async markAllNotificationsAsRead(userId: string): Promise<void> {
    try {
      const snapshot = await firestore
        .collection('notifications')
        .where('userId', '==', userId)
        .where('read', '==', false)
        .get();

      const batch = firestore.batch();

      snapshot.docs.forEach((doc) => {
        batch.update(doc.ref, { read: true, readAt: Date.now() });
      });

      await batch.commit();
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  }
}

export const notificationService = new CollaborationNotificationService();
