// src/app/api/webhooks/[webhookId]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { WebhookRegistry, WebhookEvent } from '@/lib/webhook-registry';
import { validateRequest } from '@/lib/auth-validation';
import { z } from 'zod';

const UpdateWebhookSchema = z.object({
  url: z
    .string()
    .url()
    .refine((url) => url.startsWith('https://'), {
      message: 'Webhook URL must use HTTPS',
    })
    .optional(),
  events: z
    .array(
      z.enum([
        'document.created',
        'document.updated',
        'document.signed',
        'document.completed',
        'document.deleted',
        'user.created',
        'user.updated',
        'payment.succeeded',
        'payment.failed',
        'subscription.created',
        'subscription.updated',
        'subscription.cancelled',
        'compliance.audit',
        'template.created',
        'template.updated',
      ]),
    )
    .min(1, 'At least one event must be selected')
    .optional(),
  isActive: z.boolean().optional(),
  metadata: z.record(z.any()).optional(),
});

interface RouteParams {
  webhookId: string;
}

export async function GET(
  request: NextRequest,
  context: { params: RouteParams },
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

    // Get webhook details
    const subscriptions = await registry.getSubscriptions(user.uid);
    const webhook = subscriptions.find((sub) => sub.id === webhookId);

    if (!webhook) {
      return NextResponse.json({ error: 'Webhook not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      webhook: {
        id: webhook.id,
        url: webhook.url,
        events: webhook.events,
        isActive: webhook.isActive,
        organizationId: webhook.organizationId,
        metadata: webhook.metadata,
        createdAt: webhook.createdAt,
        updatedAt: webhook.updatedAt,
        lastDeliveryAt: webhook.lastDeliveryAt,
        deliveryStats: webhook.deliveryStats,
        retryPolicy: webhook.retryPolicy,
        // Show partial secret for verification
        secret: `${webhook.secret.substring(0, 8)}...`,
      },
    });
  } catch (error: any) {
    console.error('Error fetching webhook:', error);

    return NextResponse.json(
      {
        error: 'Failed to fetch webhook',
        message: error.message,
      },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: NextRequest,
  context: { params: RouteParams },
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

    // Parse request body
    const body = await request.json();
    const validation = UpdateWebhookSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Invalid request data',
          details: validation.error.issues,
        },
        { status: 400 },
      );
    }

    const registry = WebhookRegistry.getInstance();
    const updates = validation.data;

    // Update webhook
    const updatedWebhook = await registry.updateSubscription(
      webhookId,
      user.uid,
      {
        url: updates.url,
        events: updates.events as WebhookEvent[] | undefined,
        isActive: updates.isActive,
        metadata: updates.metadata,
      },
    );

    // Log webhook update for audit
    console.log(`Webhook updated: ${webhookId} by user ${user.uid}`);

    return NextResponse.json({
      success: true,
      webhook: {
        id: updatedWebhook.id,
        url: updatedWebhook.url,
        events: updatedWebhook.events,
        isActive: updatedWebhook.isActive,
        organizationId: updatedWebhook.organizationId,
        metadata: updatedWebhook.metadata,
        updatedAt: updatedWebhook.updatedAt,
        deliveryStats: updatedWebhook.deliveryStats,
      },
    });
  } catch (error: any) {
    console.error('Error updating webhook:', error);

    if (
      error.message.includes('not found') ||
      error.message.includes('unauthorized')
    ) {
      return NextResponse.json({ error: 'Webhook not found' }, { status: 404 });
    }

    return NextResponse.json(
      {
        error: 'Failed to update webhook',
        message: error.message,
      },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: RouteParams },
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

    // Delete webhook
    const success = await registry.unsubscribe(webhookId, user.uid);

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to delete webhook' },
        { status: 500 },
      );
    }

    // Log webhook deletion for audit
    console.log(`Webhook deleted: ${webhookId} by user ${user.uid}`);

    return NextResponse.json({
      success: true,
      message: 'Webhook deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting webhook:', error);

    if (
      error.message.includes('not found') ||
      error.message.includes('unauthorized')
    ) {
      return NextResponse.json({ error: 'Webhook not found' }, { status: 404 });
    }

    return NextResponse.json(
      {
        error: 'Failed to delete webhook',
        message: error.message,
      },
      { status: 500 },
    );
  }
}
