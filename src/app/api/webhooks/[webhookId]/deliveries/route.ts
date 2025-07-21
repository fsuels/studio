// src/app/api/webhooks/[webhookId]/deliveries/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { WebhookRegistry } from '@/lib/webhook-registry';
import { validateRequest } from '@/lib/auth-validation';
import { z } from 'zod';

const DeliveryQuerySchema = z.object({
  limit: z.coerce.number().min(1).max(100).default(50),
  status: z.enum(['pending', 'success', 'failed', 'retrying']).optional(),
});

interface RouteParams {
  webhookId: string;
}

export async function GET(
  request: NextRequest,
  { params }: { params: RouteParams },
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

    const { webhookId } = params;

    // Parse query parameters
    const url = new URL(request.url);
    const queryParams = {
      limit: url.searchParams.get('limit'),
      status: url.searchParams.get('status'),
    };

    const validation = DeliveryQuerySchema.safeParse(queryParams);
    if (!validation.success) {
      return NextResponse.json(
        {
          error: 'Invalid query parameters',
          details: validation.error.issues,
        },
        { status: 400 },
      );
    }

    const { limit, status } = validation.data;
    const registry = WebhookRegistry.getInstance();

    // Get delivery history
    const deliveries = await registry.getDeliveryHistory(
      webhookId,
      user.uid,
      limit,
    );

    // Filter by status if specified
    const filteredDeliveries = status
      ? deliveries.filter((d) => d.status === status)
      : deliveries;

    // Format response
    const formattedDeliveries = filteredDeliveries.map((delivery) => ({
      id: delivery.id,
      eventType: delivery.eventType,
      status: delivery.status,
      statusCode: delivery.statusCode,
      url: delivery.url,
      attempts: delivery.attempts,
      createdAt: delivery.createdAt,
      deliveredAt: delivery.deliveredAt,
      nextRetryAt: delivery.nextRetryAt,
      errorMessage: delivery.errorMessage,
      // Include limited response body for debugging
      responseBody: delivery.responseBody?.substring(0, 500),
      payload: {
        id: delivery.payload.id,
        type: delivery.payload.type,
        timestamp: delivery.payload.timestamp,
        // Don't include full data payload for security
        hasData: !!delivery.payload.data,
      },
    }));

    // Calculate summary stats
    const stats = {
      total: filteredDeliveries.length,
      successful: filteredDeliveries.filter((d) => d.status === 'success')
        .length,
      failed: filteredDeliveries.filter((d) => d.status === 'failed').length,
      pending: filteredDeliveries.filter((d) => d.status === 'pending').length,
      retrying: filteredDeliveries.filter((d) => d.status === 'retrying')
        .length,
    };

    return NextResponse.json({
      success: true,
      deliveries: formattedDeliveries,
      stats,
      pagination: {
        limit,
        hasMore: deliveries.length === limit,
      },
    });
  } catch (error: any) {
    console.error('Error fetching delivery history:', error);

    if (
      error.message.includes('not found') ||
      error.message.includes('unauthorized')
    ) {
      return NextResponse.json({ error: 'Webhook not found' }, { status: 404 });
    }

    return NextResponse.json(
      {
        error: 'Failed to fetch delivery history',
        message: error.message,
      },
      { status: 500 },
    );
  }
}
