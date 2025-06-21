// src/lib/legal-updates/email-service.ts
import sgMail from '@sendgrid/mail';
import { adminDb } from '@/lib/firebase-admin';
import {
  ProcessedLegalUpdate,
  UserLegalUpdatePreferences,
  COLLECTIONS,
} from './schema';

interface EmailTemplate {
  subject: string;
  htmlContent: string;
  textContent: string;
}

interface EmailBatch {
  to: string;
  templateData: {
    userName: string;
    updates: ProcessedLegalUpdate[];
    urgentCount: number;
    totalCount: number;
    dashboardUrl: string;
    unsubscribeUrl: string;
  };
}

class LegalUpdateEmailService {
  private readonly fromEmail = 'legal-updates@123legaldoc.com';
  private readonly fromName = '123LegalDoc Legal Updates';
  private readonly batchSize = 100; // SendGrid batch limit

  constructor() {
    const apiKey = process.env.SENDGRID_API_KEY;
    if (!apiKey) {
      throw new Error('SENDGRID_API_KEY environment variable is required');
    }
    sgMail.setApiKey(apiKey);
  }

  async sendLegalUpdateDigest(
    frequency: 'immediate' | 'daily' | 'weekly' = 'daily',
  ): Promise<{
    sent: number;
    failed: number;
    results: Array<{
      email: string;
      success: boolean;
      error?: string;
    }>;
  }> {
    const results = {
      sent: 0,
      failed: 0,
      results: [] as any[],
    };

    try {
      console.log(`Starting ${frequency} legal update email digest...`);

      // Get users who want email notifications for this frequency
      const eligibleUsers = await this.getEligibleUsers(frequency);
      console.log(
        `Found ${eligibleUsers.length} eligible users for ${frequency} digest`,
      );

      if (eligibleUsers.length === 0) {
        return results;
      }

      // Get recent updates based on frequency
      const cutoffDate = this.getCutoffDate(frequency);
      const recentUpdates = await this.getRecentUpdates(cutoffDate);
      console.log(
        `Found ${recentUpdates.length} recent updates since ${cutoffDate.toISOString()}`,
      );

      if (recentUpdates.length === 0) {
        console.log('No recent updates to send');
        return results;
      }

      // Process users in batches
      const userBatches = this.chunkArray(eligibleUsers, this.batchSize);

      for (const batch of userBatches) {
        const batchResults = await this.processBatch(
          batch,
          recentUpdates,
          frequency,
        );
        results.sent += batchResults.sent;
        results.failed += batchResults.failed;
        results.results.push(...batchResults.results);

        // Rate limiting delay between batches
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      console.log(
        `Email digest complete: ${results.sent} sent, ${results.failed} failed`,
      );
      return results;
    } catch (error) {
      console.error('Email digest error:', error);
      throw error;
    }
  }

  private async getEligibleUsers(frequency: string): Promise<
    Array<{
      id: string;
      email: string;
      name: string;
      preferences: UserLegalUpdatePreferences;
    }>
  > {
    try {
      // Get users with email notifications enabled and matching frequency
      const preferencesSnapshot = await adminDb
        .collection(COLLECTIONS.USER_PREFERENCES)
        .where('emailNotifications', '==', true)
        .where('frequency', '==', frequency)
        .get();

      const eligibleUsers = [];

      for (const doc of preferencesSnapshot.docs) {
        const preferences = {
          id: doc.id,
          ...doc.data(),
        } as UserLegalUpdatePreferences;

        // Get user profile for email and name
        const userDoc = await adminDb
          .collection('users')
          .doc(preferences.userId)
          .get();

        if (userDoc.exists) {
          const userData = userDoc.data();
          if (
            userData?.email &&
            this.shouldSendToUser(preferences, frequency)
          ) {
            eligibleUsers.push({
              id: preferences.userId,
              email: userData.email,
              name: userData.displayName || userData.name || 'User',
              preferences,
            });
          }
        }
      }

      return eligibleUsers;
    } catch (error) {
      console.error('Error getting eligible users:', error);
      return [];
    }
  }

  private shouldSendToUser(
    preferences: UserLegalUpdatePreferences,
    frequency: string,
  ): boolean {
    // Check if enough time has passed since last notification
    if (!preferences.lastNotified) {
      return true;
    }

    const lastNotified = preferences.lastNotified;
    const now = new Date();
    const hoursSinceLastNotification =
      (now.getTime() - lastNotified.getTime()) / (1000 * 60 * 60);

    switch (frequency) {
      case 'immediate':
        return hoursSinceLastNotification >= 1; // At least 1 hour gap
      case 'daily':
        return hoursSinceLastNotification >= 20; // At least 20 hours gap
      case 'weekly':
        return hoursSinceLastNotification >= 164; // At least 164 hours (almost a week)
      default:
        return true;
    }
  }

  private getCutoffDate(frequency: string): Date {
    const now = new Date();
    switch (frequency) {
      case 'immediate':
        now.setHours(now.getHours() - 2); // Last 2 hours
        break;
      case 'daily':
        now.setDate(now.getDate() - 1); // Last 24 hours
        break;
      case 'weekly':
        now.setDate(now.getDate() - 7); // Last 7 days
        break;
      default:
        now.setDate(now.getDate() - 1);
    }
    return now;
  }

  private async getRecentUpdates(
    cutoffDate: Date,
  ): Promise<ProcessedLegalUpdate[]> {
    try {
      const snapshot = await adminDb
        .collection(COLLECTIONS.PROCESSED_LEGAL_UPDATES)
        .where('status', '==', 'active')
        .where('publishedDate', '>=', cutoffDate)
        .orderBy('publishedDate', 'desc')
        .limit(50) // Limit to most recent 50 updates
        .get();

      return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as ProcessedLegalUpdate[];
    } catch (error) {
      console.error('Error getting recent updates:', error);
      return [];
    }
  }

  private async processBatch(
    users: any[],
    allUpdates: ProcessedLegalUpdate[],
    frequency: string,
  ): Promise<{
    sent: number;
    failed: number;
    results: Array<{
      email: string;
      success: boolean;
      error?: string;
    }>;
  }> {
    const results = {
      sent: 0,
      failed: 0,
      results: [] as any[],
    };

    for (const user of users) {
      try {
        // Filter updates based on user preferences
        const relevantUpdates = this.filterUpdatesForUser(
          allUpdates,
          user.preferences,
        );

        if (relevantUpdates.length === 0) {
          continue; // Skip users with no relevant updates
        }

        // Generate email content
        const emailTemplate = this.generateEmailTemplate(
          user,
          relevantUpdates,
          frequency,
        );

        // Send email
        await this.sendEmail(user.email, emailTemplate);

        // Update user's last notified timestamp
        await this.updateLastNotified(user.id);

        // Mark updates as email sent
        await this.markUpdatesAsEmailSent(relevantUpdates.map((u) => u.id));

        results.sent++;
        results.results.push({
          email: user.email,
          success: true,
        });
      } catch (error) {
        console.error(`Failed to send email to ${user.email}:`, error);
        results.failed++;
        results.results.push({
          email: user.email,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    return results;
  }

  private filterUpdatesForUser(
    updates: ProcessedLegalUpdate[],
    preferences: UserLegalUpdatePreferences,
  ): ProcessedLegalUpdate[] {
    return updates.filter((update) => {
      // Filter by jurisdiction
      if (
        preferences.jurisdictions.length > 0 &&
        !preferences.jurisdictions.includes(update.jurisdiction)
      ) {
        return false;
      }

      // Filter by category
      if (
        preferences.categories.length > 0 &&
        !preferences.categories.includes(update.category)
      ) {
        return false;
      }

      // Filter by urgency threshold
      const urgencyLevels = ['critical', 'high', 'medium', 'low'];
      const updateUrgencyIndex = urgencyLevels.indexOf(update.urgency);
      const thresholdIndex = urgencyLevels.indexOf(
        preferences.urgencyThreshold,
      );

      if (updateUrgencyIndex > thresholdIndex) {
        return false; // Update is below threshold
      }

      // Don't send if already emailed
      if (update.notificationStatus.emailSent) {
        return false;
      }

      return true;
    });
  }

  private generateEmailTemplate(
    user: any,
    updates: ProcessedLegalUpdate[],
    frequency: string,
  ): EmailTemplate {
    const urgentCount = updates.filter((u) =>
      ['critical', 'high'].includes(u.urgency),
    ).length;
    const dashboardUrl = `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`;
    const unsubscribeUrl = `${process.env.NEXT_PUBLIC_APP_URL}/legal-updates/unsubscribe?token=${this.generateUnsubscribeToken(user.id)}`;

    const subject = this.generateSubject(
      urgentCount,
      updates.length,
      frequency,
    );
    const htmlContent = this.generateHtmlContent(
      user,
      updates,
      urgentCount,
      dashboardUrl,
      unsubscribeUrl,
    );
    const textContent = this.generateTextContent(
      user,
      updates,
      urgentCount,
      dashboardUrl,
      unsubscribeUrl,
    );

    return { subject, htmlContent, textContent };
  }

  private generateSubject(
    urgentCount: number,
    totalCount: number,
    frequency: string,
  ): string {
    if (urgentCount > 0) {
      return `🚨 ${urgentCount} Urgent Legal Update${urgentCount > 1 ? 's' : ''} - Action Required`;
    }

    const frequencyText = frequency === 'weekly' ? 'Weekly' : 'Daily';
    return `📋 ${frequencyText} Legal Updates: ${totalCount} New Update${totalCount > 1 ? 's' : ''}`;
  }

  private generateHtmlContent(
    user: any,
    updates: ProcessedLegalUpdate[],
    urgentCount: number,
    dashboardUrl: string,
    unsubscribeUrl: string,
  ): string {
    const sortedUpdates = updates.sort((a, b) => {
      const urgencyOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      return urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
    });

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Legal Updates from 123LegalDoc</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; background-color: #f4f4f4; }
        .container { max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { text-align: center; margin-bottom: 30px; }
        .logo { font-size: 24px; font-weight: bold; color: #2563eb; }
        .update { border-left: 4px solid #e5e7eb; padding: 16px; margin: 16px 0; background-color: #f9fafb; border-radius: 4px; }
        .update.critical { border-left-color: #dc2626; background-color: #fef2f2; }
        .update.high { border-left-color: #ea580c; background-color: #fff7ed; }
        .update.medium { border-left-color: #ca8a04; background-color: #fffbeb; }
        .update-title { font-weight: bold; margin-bottom: 8px; }
        .update-summary { margin-bottom: 12px; }
        .update-meta { font-size: 12px; color: #6b7280; margin-bottom: 8px; }
        .action-items { background-color: #f0f9ff; padding: 12px; border-radius: 4px; margin-top: 12px; }
        .action-items h4 { margin: 0 0 8px 0; color: #1e40af; }
        .action-item { margin: 4px 0; }
        .cta-button { display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">⚖️ 123LegalDoc</div>
            <h1>Legal Updates</h1>
            <p>Hello ${user.name}, here are your latest legal updates</p>
        </div>

        ${
          urgentCount > 0
            ? `
        <div class="update critical">
            <div class="update-title">🚨 ${urgentCount} Urgent Update${urgentCount > 1 ? 's' : ''} Require Immediate Attention</div>
            <p>These updates may affect your legal documents and compliance requirements. Please review them as soon as possible.</p>
        </div>
        `
            : ''
        }

        ${sortedUpdates
          .map(
            (update) => `
        <div class="update ${update.urgency}">
            <div class="update-meta">
                ${update.jurisdiction.toUpperCase()} • ${update.category} • ${this.getUrgencyLabel(update.urgency)}
                ${update.compliance.hasDeadline ? ` • Deadline: ${new Date(update.compliance.deadline!).toLocaleDateString()}` : ''}
            </div>
            <div class="update-title">${update.title}</div>
            <div class="update-summary">${update.summary}</div>
            
            ${
              update.actionItems.length > 0
                ? `
            <div class="action-items">
                <h4>📋 Action Required:</h4>
                ${update.actionItems
                  .slice(0, 3)
                  .map(
                    (action) => `
                    <div class="action-item">• ${action.description}</div>
                `,
                  )
                  .join('')}
            </div>
            `
                : ''
            }
        </div>
        `,
          )
          .join('')}

        <div style="text-align: center;">
            <a href="${dashboardUrl}" class="cta-button">View All Updates in Dashboard</a>
        </div>

        <div class="footer">
            <p>This email was sent to you because you subscribed to legal updates from 123LegalDoc.</p>
            <p><a href="${unsubscribeUrl}">Unsubscribe</a> | <a href="${dashboardUrl}/legal-updates/preferences">Manage Preferences</a></p>
            <p>© 2024 123LegalDoc. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`;
  }

  private generateTextContent(
    user: any,
    updates: ProcessedLegalUpdate[],
    urgentCount: number,
    dashboardUrl: string,
    unsubscribeUrl: string,
  ): string {
    const sortedUpdates = updates.sort((a, b) => {
      const urgencyOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      return urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
    });

    return `
123LegalDoc Legal Updates

Hello ${user.name},

${urgentCount > 0 ? `🚨 URGENT: ${urgentCount} update${urgentCount > 1 ? 's' : ''} require immediate attention\n\n` : ''}

Here are your latest legal updates:

${sortedUpdates
  .map(
    (update) => `
---
${update.title}
${update.jurisdiction.toUpperCase()} | ${update.category} | ${this.getUrgencyLabel(update.urgency)}
${update.compliance.hasDeadline ? `Deadline: ${new Date(update.compliance.deadline!).toLocaleDateString()}` : ''}

${update.summary}

${
  update.actionItems.length > 0
    ? `
Action Required:
${update.actionItems
  .slice(0, 3)
  .map((action) => `• ${action.description}`)
  .join('\n')}
`
    : ''
}
`,
  )
  .join('\n')}

View all updates: ${dashboardUrl}

---
Unsubscribe: ${unsubscribeUrl}
Manage Preferences: ${dashboardUrl}/legal-updates/preferences

© 2024 123LegalDoc. All rights reserved.
`;
  }

  private getUrgencyLabel(urgency: string): string {
    switch (urgency) {
      case 'critical':
        return '🔴 Critical';
      case 'high':
        return '🟠 High';
      case 'medium':
        return '🟡 Medium';
      case 'low':
        return '🔵 Low';
      default:
        return urgency;
    }
  }

  private async sendEmail(to: string, template: EmailTemplate): Promise<void> {
    const msg = {
      to,
      from: {
        email: this.fromEmail,
        name: this.fromName,
      },
      subject: template.subject,
      html: template.htmlContent,
      text: template.textContent,
      trackingSettings: {
        clickTracking: { enable: true },
        openTracking: { enable: true },
      },
    };

    await sgMail.send(msg);
  }

  private async updateLastNotified(userId: string): Promise<void> {
    try {
      await adminDb
        .collection(COLLECTIONS.USER_PREFERENCES)
        .doc(userId)
        .update({
          lastNotified: new Date(),
          updatedAt: new Date(),
        });
    } catch (error) {
      console.error('Failed to update last notified:', error);
    }
  }

  private async markUpdatesAsEmailSent(updateIds: string[]): Promise<void> {
    try {
      const batch = adminDb.batch();

      updateIds.forEach((updateId) => {
        const docRef = adminDb
          .collection(COLLECTIONS.PROCESSED_LEGAL_UPDATES)
          .doc(updateId);

        batch.update(docRef, {
          'notificationStatus.emailSent': true,
          'notificationStatus.emailSentAt': new Date(),
        });
      });

      await batch.commit();
    } catch (error) {
      console.error('Failed to mark updates as email sent:', error);
    }
  }

  private generateUnsubscribeToken(userId: string): string {
    // In production, use proper JWT or encrypted tokens
    return Buffer.from(`${userId}_${Date.now()}`).toString('base64');
  }

  private chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }
}

export const legalUpdateEmailService = new LegalUpdateEmailService();
