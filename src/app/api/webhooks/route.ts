// src/app/api/webhooks/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { WebhookRegistry, WebhookEvent } from '@/lib/webhook-registry';
import { validateRequest } from '@/lib/auth-validation';
import { z } from 'zod';

const CreateWebhookSchema = z.object({
  url: z
    .string()
    .url()
    .refine((url) => url.startsWith('https://'), {
      message: 'Webhook URL must use HTTPS',
    }),
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
    .min(1, 'At least one event must be selected'),
  organizationId: z.string().optional(),
  metadata: z.record(z.any()).optional().default({}),
  retryPolicy: z
    .object({
      maxRetries: z.number().min(0).max(10).default(3),
      backoffMultiplier: z.number().min(1).max(5).default(2),
      maxBackoffSeconds: z.number().min(60).max(3600).default(300),
    })
    .optional()
    .default({
      maxRetries: 3,
      backoffMultiplier: 2,
      maxBackoffSeconds: 300,
    }),
});

const ListWebhooksSchema = z.object({
  organizationId: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    // Validate authentication
    const { user, error: authError } = await validateRequest(request);
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 },
      );
    }

    // Parse request body
    const body = await request.json();
    const validation = CreateWebhookSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Invalid request data',
          details: validation.error.issues,
        },
        { status: 400 },
      );
    }

    const { url, events, organizationId, metadata, retryPolicy } =
      validation.data;

    // Check rate limits (max 10 webhooks per user)
    const registry = WebhookRegistry.getInstance();
    const existingWebhooks = await registry.getSubscriptions(
      user.uid,
      organizationId,
    );

    if (existingWebhooks.length >= 10) {
      return NextResponse.json(
        {
          error: 'Webhook limit exceeded',
          message: 'Maximum 10 webhooks allowed per user/organization',
        },
        { status: 429 },
      );
    }

    // Create webhook subscription
    const subscription = await registry.subscribe({
      userId: user.uid,
      organizationId,
      url,
      events: events as WebhookEvent[],
      isActive: true,
      retryPolicy: retryPolicy!,
      metadata: metadata!,
    });

    // Log webhook creation for audit
    console.log(`Webhook created: ${subscription.id} by user ${user.uid}`);

    return NextResponse.json(
      {
        success: true,
        webhook: {
          id: subscription.id,
          url: subscription.url,
          events: subscription.events,
          isActive: subscription.isActive,
          createdAt: subscription.createdAt,
          deliveryStats: subscription.deliveryStats,
          // Don't expose the secret in the response
          secret: `${subscription.secret.substring(0, 8)}...`,
        },
      },
      { status: 201 },
    );
  } catch (error: any) {
    console.error('Error creating webhook:', error);

    return NextResponse.json(
      {
        error: 'Failed to create webhook',
        message: error.message,
      },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Validate authentication
    const { user, error: authError } = await validateRequest(request);
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 },
      );
    }

    // Parse query parameters
    const url = new URL(request.url);
    const organizationId = url.searchParams.get('organizationId') || undefined;

    // Get user's webhook subscriptions
    const registry = WebhookRegistry.getInstance();
    const subscriptions = await registry.getSubscriptions(
      user.uid,
      organizationId,
    );

    // Format response (exclude secrets)
    const webhooks = subscriptions.map((sub) => ({
      id: sub.id,
      url: sub.url,
      events: sub.events,
      isActive: sub.isActive,
      organizationId: sub.organizationId,
      metadata: sub.metadata,
      createdAt: sub.createdAt,
      updatedAt: sub.updatedAt,
      lastDeliveryAt: sub.lastDeliveryAt,
      deliveryStats: sub.deliveryStats,
      retryPolicy: sub.retryPolicy,
    }));

    return NextResponse.json({
      success: true,
      webhooks,
      count: webhooks.length,
    });
  } catch (error: any) {
    console.error('Error fetching webhooks:', error);

    return NextResponse.json(
      {
        error: 'Failed to fetch webhooks',
        message: error.message,
      },
      { status: 500 },
    );
  }
}

// Helper function to validate webhook ownership
async function validateWebhookOwnership(
  webhookId: string,
  userId: string,
  registry: WebhookRegistry,
) {
  const subscriptions = await registry.getSubscriptions(userId);
  const webhook = subscriptions.find((sub) => sub.id === webhookId);

  if (!webhook) {
    throw new Error('Webhook not found or access denied');
  }

  return webhook;
}
