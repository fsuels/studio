// src/app/api/checkout/session/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { documentLibrary } from '@/lib/document-library';
import { smartPricingEngine } from '@/lib/smart-pricing-engine';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function POST(req: NextRequest) {
  try {
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

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: userCurrency.toLowerCase(),
            product_data: { name: doc.name },
            unit_amount: unitAmount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      // Enable automatic tax collection
      automatic_tax: {
        enabled: true,
      },
      customer_details: {
        ip_address: pricingSummary.userLocation.ip,
        country: pricingSummary.userLocation.countryCode,
      },
      // Enable tax ID collection for business customers
      tax_id_collection: {
        enabled: pricingSummary.taxInfo.taxRequired,
      },
      metadata: {
        docId,
        currency: userCurrency,
        userCountry: pricingSummary.userLocation.countryCode,
        userState: pricingSummary.userLocation.stateCode || '',
      },
    });

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
