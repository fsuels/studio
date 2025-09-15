// src/app/api/checkout/session/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { documentLibrary } from '@/lib/document-library';
import { smartPricingEngine } from '@/lib/smart-pricing-engine';

// Initialize Stripe only if the secret key is available
const stripeKey = process.env.STRIPE_SECRET_KEY;
const stripe = stripeKey ? new Stripe(stripeKey, {
  apiVersion: '2025-05-28.basil',
}) : null;

export async function POST(req: NextRequest) {
  try {
    // Check if Stripe is configured
    if (!stripe) {
      console.error('Stripe is not configured. Please set STRIPE_SECRET_KEY environment variable.');
      return NextResponse.json(
        { error: 'Payment system is not configured' },
        { status: 503 }
      );
    }

    const { docId, locale } = await req.json();
    const doc = documentLibrary.find((d) => d.id === docId);
    if (!doc) {
      return NextResponse.json({ error: 'Unknown document' }, { status: 400 });
    }

    // Get user's currency and location for smart pricing
    const userCurrency = await smartPricingEngine.getUserCurrency(req);
    const pricingSummary = await smartPricingEngine.getPricingSummary(req);

    // Convert price to user's currency if not USD
    let unitAmount = Math.round((doc.basePrice || 0) * 100); // price in cents
    
    if (userCurrency !== 'USD') {
      // Apply currency conversion (simplified - in production use live rates)
      const conversionRates = { EUR: 0.92, GBP: 0.80 };
      const rate = conversionRates[userCurrency as keyof typeof conversionRates] || 1;
      unitAmount = Math.round(unitAmount * rate);
    }

    const origin =
      req.headers.get('origin') || `${req.nextUrl.protocol}//${req.nextUrl.host}`;
    const successUrl = `${origin}/${locale}/docs/${docId}/view?payment=success`;
    const cancelUrl = `${origin}/${locale}/docs/${docId}/view?payment=cancel`;

    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      line_items: [
        {
          price_data: {
            currency: userCurrency.toLowerCase(),
            product_data: {
              name: doc.translations?.en?.name || doc.name || doc.id,
            },
            unit_amount: unitAmount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      automatic_tax: { enabled: true },
      tax_id_collection: { enabled: Boolean(pricingSummary.taxInfo.taxRequired) },
      metadata: {
        docId: String(docId),
        currency: String(userCurrency),
        userCountry: String(pricingSummary.userLocation.countryCode || ''),
        userState: String(pricingSummary.userLocation.stateCode || ''),
      },
    };

    const session = await stripe.checkout.sessions.create(sessionParams);

    return NextResponse.json({ 
      sessionId: session.id,
      currency: userCurrency,
      amount: unitAmount / 100,
      taxInfo: pricingSummary.taxInfo,
    });

  } catch (error: any) {
    console.error('Checkout session creation failed:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
