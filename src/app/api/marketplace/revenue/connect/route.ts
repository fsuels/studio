// src/app/api/marketplace/revenue/connect/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { revenueShareSystem } from '@/lib/marketplace/revenue-sharing-system';

/**
 * POST /api/marketplace/revenue/connect
 * Set up Stripe Connect for creator payouts
 */
export async function POST(request: NextRequest) {
  try {
    // TODO: Add authentication
    // const user = await getCurrentUser(request);
    // if (!user) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const body = await request.json();
    const {
      email,
      businessType = 'individual', // 'individual' or 'company'
      country = 'US',
      returnUrl,
      refreshUrl,
    } = body;

    // Validate required fields
    if (!email || !returnUrl || !refreshUrl) {
      return NextResponse.json(
        { error: 'Missing required fields: email, returnUrl, refreshUrl' },
        { status: 400 },
      );
    }

    const userId = 'user-id'; // TODO: Get from auth

    // Set up Stripe Connect account
    const result = await revenueShareSystem.setupStripeConnect(userId, {
      email,
      businessType,
      country,
      returnUrl,
      refreshUrl,
    });

    return NextResponse.json({
      success: true,
      data: {
        accountId: result.accountId,
        onboardingUrl: result.onboardingUrl,
        message: 'Stripe Connect account created successfully',
      },
    });
  } catch (error) {
    console.error('Stripe Connect setup error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to set up payment processing',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}

/**
 * GET /api/marketplace/revenue/connect
 * Get Stripe Connect account status for creator
 */
export async function GET(request: NextRequest) {
  try {
    // TODO: Add authentication
    // const user = await getCurrentUser(request);
    // if (!user) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const userId = 'user-id'; // TODO: Get from auth

    // Get creator profile to check Stripe Connect status
    const db = await (await import('@/lib/firebase')).getDb();
    const { doc, getDoc } = await import('firebase/firestore');

    const profileRef = doc(db, 'creator-profiles', userId);
    const profileSnap = await getDoc(profileRef);

    if (!profileSnap.exists()) {
      return NextResponse.json({
        success: true,
        data: {
          connected: false,
          onboardingRequired: true,
          accountStatus: 'not_created',
        },
      });
    }

    const profile = profileSnap.data();
    const stripeAccountId = profile.stripeConnectAccountId;

    if (!stripeAccountId) {
      return NextResponse.json({
        success: true,
        data: {
          connected: false,
          onboardingRequired: true,
          accountStatus: 'not_created',
        },
      });
    }

    // Check account status with Stripe
    const stripe = (await import('stripe')).default;
    const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2022-11-15',
    });

    try {
      const account = await stripeInstance.accounts.retrieve(stripeAccountId);

      const accountStatus = {
        connected: true,
        accountId: stripeAccountId,
        onboardingRequired: !account.details_submitted,
        chargesEnabled: account.charges_enabled,
        payoutsEnabled: account.payouts_enabled,
        country: account.country,
        currency: account.default_currency,
        businessType: account.business_type,
        accountStatus: account.details_submitted
          ? account.charges_enabled && account.payouts_enabled
            ? 'active'
            : 'restricted'
          : 'pending_onboarding',
        requirements: {
          currentlyDue: account.requirements?.currently_due || [],
          eventuallyDue: account.requirements?.eventually_due || [],
          pastDue: account.requirements?.past_due || [],
          pendingVerification: account.requirements?.pending_verification || [],
        },
      };

      return NextResponse.json({
        success: true,
        data: accountStatus,
      });
    } catch (stripeError) {
      console.error('Stripe account retrieval error:', stripeError);

      return NextResponse.json({
        success: true,
        data: {
          connected: false,
          onboardingRequired: true,
          accountStatus: 'error',
          error: 'Failed to retrieve account status',
        },
      });
    }
  } catch (error) {
    console.error('Get Connect status error:', error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to check connection status',
      },
      { status: 500 },
    );
  }
}
