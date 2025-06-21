// src/app/api/marketplace/revenue/payouts/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/firebase';
import {
  collection,
  doc,
  getDocs,
  query,
  where,
  orderBy,
  limit,
} from 'firebase/firestore';
import { revenueShareSystem } from '@/lib/marketplace/revenue-sharing-system';

/**
 * GET /api/marketplace/revenue/payouts
 * Get payout history and pending payouts
 */
export async function GET(request: NextRequest) {
  try {
    // TODO: Add authentication
    // const user = await getCurrentUser(request);
    // if (!user) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const url = new URL(request.url);
    const creatorId = url.searchParams.get('creatorId');
    const status = url.searchParams.get('status') || 'all';
    const period = url.searchParams.get('period') || 'all'; // 'current_month', 'last_month', 'year', 'all'
    const page = parseInt(url.searchParams.get('page') || '1');
    const pageSize = Math.min(parseInt(url.searchParams.get('limit') || '20'), 50);

    // Check permissions
    const userId = 'user-id'; // TODO: Get from auth
    // if (creatorId && creatorId !== userId && !user.isAdmin) {
    //   return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    // }

    const db = await getDb();
    
    // Build query for payouts
    let payoutsQuery = query(collection(db, 'creator-payouts'));

    // Filter by creator if specified
    if (creatorId) {
      payoutsQuery = query(payoutsQuery, where('creatorId', '==', creatorId));
    }

    // Filter by status if specified
    if (status !== 'all') {
      payoutsQuery = query(payoutsQuery, where('status', '==', status));
    }

    // Add date filtering
    if (period !== 'all') {
      const dateFilter = calculateDateFilter(period);
      if (dateFilter) {
        payoutsQuery = query(
          payoutsQuery,
          where('createdAt', '>=', dateFilter.startDate),
          where('createdAt', '<=', dateFilter.endDate)
        );
      }
    }

    // Add sorting and pagination
    payoutsQuery = query(
      payoutsQuery,
      orderBy('createdAt', 'desc'),
      limit(pageSize)
    );

    const payoutsSnap = await getDocs(payoutsQuery);
    const payouts = payoutsSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Get creator earnings summary if viewing specific creator
    let earningsSummary = null;
    if (creatorId) {
      earningsSummary = await revenueShareSystem.getCreatorEarnings(creatorId);
    }

    // Calculate pending payouts
    const pendingPayouts = await calculatePendingPayouts(creatorId);

    return NextResponse.json({
      success: true,
      data: {
        payouts,
        earningsSummary,
        pendingPayouts,
        pagination: {
          page,
          limit: pageSize,
          total: payouts.length,
          hasMore: payouts.length === pageSize,
        },
        filters: {
          creatorId,
          status,
          period,
        },
      },
    });

  } catch (error) {
    console.error('Get payouts error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch payouts' 
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/marketplace/revenue/payouts
 * Process a payout to creator(s) (admin only)
 */
export async function POST(request: NextRequest) {
  try {
    // TODO: Add authentication and admin permission checks
    // const user = await getCurrentUser(request);
    // if (!user || !user.isAdmin) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const body = await request.json();
    const {
      creatorId,
      amount, // Optional: if not provided, process all pending earnings
      currency = 'usd',
      payoutPeriod, // e.g., "2024-01"
      transactionIds, // Optional: specific transactions to pay out
      force = false, // Force payout even if below minimum threshold
    } = body;

    // Validate required fields
    if (!creatorId) {
      return NextResponse.json(
        { error: 'Missing required field: creatorId' },
        { status: 400 }
      );
    }

    // Get creator's pending earnings
    const earningsSummary = await revenueShareSystem.getCreatorEarnings(creatorId);
    
    const payoutAmount = amount || earningsSummary.pendingEarnings;
    const minimumPayoutThreshold = 5000; // $50.00 in cents

    // Check minimum payout threshold
    if (!force && payoutAmount < minimumPayoutThreshold) {
      return NextResponse.json(
        { 
          error: 'Payout amount below minimum threshold',
          minimumAmount: minimumPayoutThreshold,
          currentAmount: payoutAmount,
          code: 'BELOW_MINIMUM_THRESHOLD',
        },
        { status: 400 }
      );
    }

    // Get transactions to pay out
    const transactionsToPayOut = transactionIds || await getPendingTransactionIds(creatorId);
    
    if (transactionsToPayOut.length === 0) {
      return NextResponse.json(
        { error: 'No pending transactions found for payout' },
        { status: 400 }
      );
    }

    // Process the payout
    const result = await revenueShareSystem.processCreatorPayout({
      creatorId,
      amount: payoutAmount,
      currency,
      payoutPeriod: payoutPeriod || getCurrentPayoutPeriod(),
      transactionIds: transactionsToPayOut,
    });

    return NextResponse.json({
      success: true,
      data: {
        payoutId: result.payoutId,
        transferId: result.transferId,
        amount: result.amount,
        fees: result.fees,
        netAmount: result.amount - result.fees,
        currency,
        transactionCount: transactionsToPayOut.length,
        message: 'Payout processed successfully',
      },
    });

  } catch (error) {
    console.error('Process payout error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to process payout',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * Helper functions
 */

function calculateDateFilter(period: string) {
  const now = new Date();
  
  switch (period) {
    case 'current_month':
      return {
        startDate: new Date(now.getFullYear(), now.getMonth(), 1),
        endDate: new Date(now.getFullYear(), now.getMonth() + 1, 0),
      };
    
    case 'last_month':
      return {
        startDate: new Date(now.getFullYear(), now.getMonth() - 1, 1),
        endDate: new Date(now.getFullYear(), now.getMonth(), 0),
      };
    
    case 'year':
      return {
        startDate: new Date(now.getFullYear(), 0, 1),
        endDate: new Date(now.getFullYear(), 11, 31),
      };
    
    default:
      return null;
  }
}

async function calculatePendingPayouts(creatorId?: string) {
  const db = await getDb();
  
  // Query pending transactions
  let transactionsQuery = query(
    collection(db, 'revenue-transactions'),
    where('status', '==', 'pending_transfer')
  );

  if (creatorId) {
    transactionsQuery = query(transactionsQuery, where('creatorId', '==', creatorId));
  }

  const transactionsSnap = await getDocs(transactionsQuery);
  const transactions = transactionsSnap.docs.map(doc => doc.data());

  // Group by creator
  const pendingByCreator = new Map();
  
  transactions.forEach(transaction => {
    const existing = pendingByCreator.get(transaction.creatorId) || {
      creatorId: transaction.creatorId,
      amount: 0,
      transactionCount: 0,
      oldestTransaction: null,
    };
    
    existing.amount += transaction.creatorShare || 0;
    existing.transactionCount += 1;
    
    if (!existing.oldestTransaction || 
        transaction.createdAt.toMillis() < existing.oldestTransaction.toMillis()) {
      existing.oldestTransaction = transaction.createdAt;
    }
    
    pendingByCreator.set(transaction.creatorId, existing);
  });

  return Array.from(pendingByCreator.values());
}

async function getPendingTransactionIds(creatorId: string): Promise<string[]> {
  const db = await getDb();
  
  const transactionsQuery = query(
    collection(db, 'revenue-transactions'),
    where('creatorId', '==', creatorId),
    where('status', '==', 'pending_transfer')
  );

  const transactionsSnap = await getDocs(transactionsQuery);
  return transactionsSnap.docs.map(doc => doc.id);
}

function getCurrentPayoutPeriod(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
}