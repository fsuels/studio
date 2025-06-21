// src/lib/onboarding/milestone-emails.ts
'use client';

export interface MilestoneEmailData {
  userId: string;
  email: string;
  milestone: string;
  persona?: string;
  userData?: {
    name?: string;
    locale?: string;
  };
}

export class MilestoneEmailService {
  private static instance: MilestoneEmailService;

  static getInstance(): MilestoneEmailService {
    if (!MilestoneEmailService.instance) {
      MilestoneEmailService.instance = new MilestoneEmailService();
    }
    return MilestoneEmailService.instance;
  }

  async triggerMilestoneEmail(data: MilestoneEmailData): Promise<void> {
    try {
      // This would integrate with your email service (Mailchimp, SendGrid, etc.)
      const response = await fetch('/api/onboarding/milestone-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(
          `Failed to trigger milestone email: ${response.statusText}`,
        );
      }

      console.log(
        `Milestone email triggered for ${data.milestone}:`,
        data.userId,
      );
    } catch (error) {
      console.error('Error triggering milestone email:', error);
      // Don't throw - email failures shouldn't break user experience
    }
  }

  async triggerWelcomeSequence(
    data: Omit<MilestoneEmailData, 'milestone'>,
  ): Promise<void> {
    await this.triggerMilestoneEmail({
      ...data,
      milestone: 'welcome_sequence',
    });
  }

  async triggerOnboardingComplete(
    data: Omit<MilestoneEmailData, 'milestone'>,
  ): Promise<void> {
    await this.triggerMilestoneEmail({
      ...data,
      milestone: 'onboarding_complete',
    });
  }

  async triggerFirstDocumentCreated(
    data: Omit<MilestoneEmailData, 'milestone'>,
  ): Promise<void> {
    await this.triggerMilestoneEmail({
      ...data,
      milestone: 'first_document',
    });
  }

  async triggerRetentionEmail(
    data: Omit<MilestoneEmailData, 'milestone'>,
    daysInactive: number,
  ): Promise<void> {
    await this.triggerMilestoneEmail({
      ...data,
      milestone: `retention_${daysInactive}d`,
    });
  }
}

export const milestoneEmailService = MilestoneEmailService.getInstance();
