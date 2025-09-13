// Individual order details API
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { generateMockOrders, type Order } from '@/lib/orders';

// Mock database - in production, use your actual database
const ordersDB: Order[] = generateMockOrders(150);

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ orderId: string }> },
) {
  const { orderId } = await context.params;
  // Require admin authentication
  const adminResult = await requireAdmin(request);
  if (adminResult instanceof Response) {
    return adminResult;
  }

  try {
    const order = ordersDB.find((o) => o.id === orderId);

    if (!order) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 },
      );
    }

    // Get related orders from same customer
    const relatedOrders = ordersDB
      .filter(
        (o) => o.customer.email === order.customer.email && o.id !== orderId,
      )
      .slice(0, 5);

    return NextResponse.json({
      success: true,
      data: {
        order,
        relatedOrders,
        customerSummary: {
          totalOrders: ordersDB.filter(
            (o) => o.customer.email === order.customer.email,
          ).length,
          totalSpent: ordersDB
            .filter((o) => o.customer.email === order.customer.email)
            .reduce((sum, o) => sum + o.payment.amount, 0),
          averageFraudScore: Math.round(
            ordersDB
              .filter((o) => o.customer.email === order.customer.email)
              .reduce((sum, o) => sum + o.fraudAnalysis.score, 0) /
              ordersDB.filter((o) => o.customer.email === order.customer.email)
                .length,
          ),
        },
      },
    });
  } catch (error) {
    console.error('Order details API error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to retrieve order details',
      },
      { status: 500 },
    );
  }
}

// Update specific order
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ orderId: string }> },
) {
  const { orderId } = await context.params;
  const adminResult = await requireAdmin(request);
  if (adminResult instanceof Response) {
    return adminResult;
  }

  try {
    const body = await request.json();
    const { action, data } = body;

    const orderIndex = ordersDB.findIndex((o) => o.id === orderId);

    if (orderIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 },
      );
    }

    const order = ordersDB[orderIndex];

    switch (action) {
      case 'update_status':
        order.status = data.status;
        order.updatedAt = new Date().toISOString();

        // Add timeline event
        order.timeline.push({
          id: crypto.randomUUID(),
          type: data.status,
          description: `Status updated to ${data.status} by admin`,
          timestamp: new Date().toISOString(),
          data: {
            adminUser: (adminResult as any).username,
            reason: data.reason,
          },
        });
        break;

      case 'add_note':
        order.notes =
          (order.notes || '') +
          `\n[${new Date().toISOString()}] ${(adminResult as any).username}: ${data.note}`;
        order.updatedAt = new Date().toISOString();
        break;

      case 'update_fraud_score':
        order.fraudAnalysis.score = data.score;
        order.fraudAnalysis.recommendation = data.recommendation;
        order.updatedAt = new Date().toISOString();

        order.timeline.push({
          id: crypto.randomUUID(),
          type: 'fraud_review',
          description: `Fraud score updated to ${data.score} (${data.recommendation})`,
          timestamp: new Date().toISOString(),
          data: { adminUser: (adminResult as any).username },
        });
        break;

      case 'process_refund': {
        const refund = {
          id: crypto.randomUUID(),
          amount: data.amount,
          reason: data.reason,
          status: 'pending' as const,
          processedAt: new Date().toISOString(),
          transactionId: `rfnd_${crypto.randomUUID().slice(0, 8)}`,
        };

        order.refunds.push(refund);
        order.status = 'refunded';
        order.updatedAt = new Date().toISOString();

        order.timeline.push({
          id: crypto.randomUUID(),
          type: 'refunded',
          description: `Refund processed: $${data.amount} - ${data.reason}`,
          timestamp: new Date().toISOString(),
          data: {
            adminUser: (adminResult as any).username,
            refundId: refund.id,
          },
        });
        break;
      }

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 },
        );
    }

    ordersDB[orderIndex] = order;

    return NextResponse.json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error('Order update error:', error);

    return NextResponse.json(
      { success: false, error: 'Failed to update order' },
      { status: 500 },
    );
  }
}
