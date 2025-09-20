// src/app/api/webhooks/[webhookId]/test/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { WebhookRegistry } from '@/lib/webhook-registry';
import { validateRequest } from '@/lib/auth-validation';

interface RouteParams {
  webhookId: string;
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<RouteParams> },
) {
  try {
    // Validate authentication
    const { user, error: authError } = await validateRequest(request);
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 },
      );
    }

    const { webhookId } = context.params;
    const registry = WebhookRegistry.getInstance();

    // Send test webhook
    const delivery = await registry.testWebhook(webhookId, user.uid);

    // Log test webhook for audit
    console.log(`Test webhook sent: ${webhookId} by user ${user.uid}`);

    return NextResponse.json({
      success: true,
      message: 'Test webhook sent successfully',
      delivery: {
        id: delivery.id,
        status: delivery.status,
        statusCode: delivery.statusCode,
        url: delivery.url,
        attempts: delivery.attempts,
        createdAt: delivery.createdAt,
        deliveredAt: delivery.deliveredAt,
        errorMessage: delivery.errorMessage,
        responseBody: delivery.responseBody?.substring(0, 1000), // Limit response body size
      },
    });
  } catch (error: any) {
    console.error('Error sending test webhook:', error);

    if (
      error.message.includes('not found') ||
      error.message.includes('unauthorized')
    ) {
      return NextResponse.json({ error: 'Webhook not found' }, { status: 404 });
    }

    return NextResponse.json(
      {
        error: 'Failed to send test webhook',
        message: error.message,
      },
      { status: 500 },
    );
  }
}
