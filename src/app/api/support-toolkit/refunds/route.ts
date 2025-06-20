// API endpoints for automated refund system
import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/admin-auth';
import { RefundSystem } from '@/lib/support-toolkit/refund-system';

export async function GET(request: NextRequest) {
  // Require admin authentication for refund queries
  const adminResult = await requireAdmin(request);
  if (adminResult instanceof Response) {
    return adminResult;
  }

  try {
    const url = new URL(request.url);
    const orderId = url.searchParams.get('orderId');
    const userId = url.searchParams.get('userId');
    const status = url.searchParams.get('status');
    const pending = url.searchParams.get('pending') === 'true';

    let refunds;

    if (pending) {
      // Get all pending refunds
      refunds = await RefundSystem.getPendingRefunds();
    } else if (orderId) {
      // Get refunds for specific order
      refunds = await RefundSystem.getRefundsByOrder(orderId);
    } else if (userId) {
      // Get refunds for specific user
      refunds = await RefundSystem.getRefundsByUser(userId);
    } else {
      return NextResponse.json(
        { success: false, error: 'orderId, userId, or pending=true parameter required' },
        { status: 400 }
      );
    }

    // Calculate summary statistics
    const summary = {
      total: refunds.length,
      totalAmount: refunds.reduce((sum, r) => sum + r.amount, 0),
      byStatus: refunds.reduce((acc, r) => {
        acc[r.status] = (acc[r.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      byReason: refunds.reduce((acc, r) => {
        acc[r.reason] = (acc[r.reason] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      autoApprovalRate: refunds.filter(r => r.metadata.autoApprovalRules?.length).length / refunds.length,
      averageProcessingTime: calculateAverageProcessingTime(refunds),
    };

    return NextResponse.json({
      success: true,
      data: {
        refunds: refunds.sort((a, b) => b.createdAt - a.createdAt),
        summary
      }
    });

  } catch (error) {
    console.error('Refunds GET API error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to retrieve refunds' 
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const adminResult = await requireAdmin(request);
  if (adminResult instanceof Response) {
    return adminResult;
  }

  try {
    const body = await request.json();
    const { action, orderId, amount, reason, refundId, agentId, agentName, notes, metadata = {} } = body;

    switch (action) {
      case 'create_refund':
        if (!orderId || !amount || !reason) {
          return NextResponse.json(
            { success: false, error: 'orderId, amount, and reason are required' },
            { status: 400 }
          );
        }

        const refund = await RefundSystem.createRefundRequest(
          orderId,
          amount,
          reason,
          {
            type: 'support_agent',
            agentId,
            name: agentName
          },
          {
            ...metadata,
            internalNotes: notes
          }
        );

        return NextResponse.json({
          success: true,
          data: refund,
          message: refund.status === 'approved' ? 'Refund auto-approved and processing' : 'Refund request created'
        });

      case 'approve_refund':
        if (!refundId || !agentId || !agentName) {
          return NextResponse.json(
            { success: false, error: 'refundId, agentId, and agentName are required' },
            { status: 400 }
          );
        }

        const approvedRefund = await RefundSystem.approveRefund(
          refundId,
          { agentId, name: agentName },
          notes
        );

        return NextResponse.json({
          success: true,
          data: approvedRefund,
          message: 'Refund approved and processed'
        });

      case 'get_store_credit_balance':
        if (!body.userId) {
          return NextResponse.json(
            { success: false, error: 'userId is required' },
            { status: 400 }
          );
        }

        const balance = await RefundSystem.getStoreCreditBalance(body.userId);
        
        return NextResponse.json({
          success: true,
          data: { 
            userId: body.userId,
            balance,
            formattedBalance: `$${balance.toFixed(2)}`
          }
        });

      case 'add_store_credit':
        if (!body.userId || !amount || !reason) {
          return NextResponse.json(
            { success: false, error: 'userId, amount, and reason are required' },
            { status: 400 }
          );
        }

        const creditTransaction = await RefundSystem.addStoreCredit(
          body.userId,
          amount,
          reason,
          orderId
        );

        return NextResponse.json({
          success: true,
          data: creditTransaction,
          message: `Store credit of $${amount} added successfully`
        });

      default:
        return NextResponse.json(
          { success: false, error: 'Invalid action' },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Refunds POST API error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'Failed to process refund request' 
      },
      { status: 500 }
    );
  }
}

// Helper function to calculate average processing time
function calculateAverageProcessingTime(refunds: any[]): number {
  const processedRefunds = refunds.filter(r => r.processedAt && r.createdAt);
  
  if (processedRefunds.length === 0) return 0;
  
  const totalTime = processedRefunds.reduce((sum, r) => {
    return sum + (r.processedAt - r.createdAt);
  }, 0);
  
  return totalTime / processedRefunds.length;
}