// src/app/api/onboarding/milestone-email/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { userId, email, milestone, persona, userData } = data;

    // Basic validation
    if (!userId || !email || !milestone) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, email, milestone' },
        { status: 400 },
      );
    }

    // Here you would integrate with your email service
    // For now, we'll just log the milestone event
    console.log('Milestone email triggered:', {
      userId,
      email,
      milestone,
      persona,
      userData,
      timestamp: new Date().toISOString(),
    });

    // Example integration points:

    // 1. Mailchimp Journey Trigger
    // await triggerMailchimpJourney(email, milestone, persona);

    // 2. SendGrid Template Email
    // await sendTemplateEmail(email, getTemplateForMilestone(milestone), userData);

    // 3. Custom Email Service
    // await customEmailService.sendMilestoneEmail({ userId, email, milestone, persona });

    // 4. Add to Firestore for tracking
    // await addEmailEventToFirestore({ userId, email, milestone, sentAt: new Date() });

    return NextResponse.json({
      success: true,
      message: `Milestone email queued for ${milestone}`,
    });
  } catch (error) {
    console.error('Error processing milestone email:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}

// Helper functions for specific email service integrations

async function _triggerMailchimpJourney(
  email: string,
  milestone: string,
  persona?: string,
) {
  // Example Mailchimp integration
  const journeyMap: Record<string, string> = {
    welcome_sequence: 'journey_welcome',
    first_document: 'journey_first_doc',
    onboarding_complete: 'journey_complete',
    retention_7d: 'journey_retention_week',
    retention_30d: 'journey_retention_month',
  };

  const journeyId = journeyMap[milestone];
  if (!journeyId) return;

  // This would be your actual Mailchimp API call
  /*
  const response = await fetch('https://api.mailchimp.com/3.0/automations/{workflow_id}/emails/{email_id}/actions/start', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.MAILCHIMP_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      email_address: email,
      merge_fields: {
        PERSONA: persona || 'individual',
        MILESTONE: milestone
      }
    })
  });
  */
}

function _getTemplateForMilestone(milestone: string): string {
  const templates: Record<string, string> = {
    welcome_sequence: 'd-welcome123',
    first_document: 'd-firstdoc456',
    onboarding_complete: 'd-complete789',
    retention_7d: 'd-retention7d',
    retention_30d: 'd-retention30d',
  };

  return templates[milestone] || 'd-default';
}
