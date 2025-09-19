// Smart Pricing & Tax Engine API Endpoint
// Creates Stripe checkout session with automatic tax and multi-currency support

import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { STRIPE_API_VERSION } from '@/lib/stripe-config';
import { smartPricingEngine } from '@/lib/smart-pricing-engine';

// Initialize Stripe only if the secret key is available
const stripeKey = process.env.STRIPE_SECRET_KEY;
const stripe = stripeKey ? new Stripe(stripeKey, {
  apiVersion: STRIPE_API_VERSION,
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

    const {
      planId,
      locale = 'en',
      customerEmail,
      allowPurchaseOrder = false,
      successPath = '/dashboard',
      cancelPath = '/pricing'
    } = await req.json();

    if (!planId) {
      return NextResponse.json({ error: 'Plan ID is required' }, { status: 400 });
    }

    // Get user's preferred currency based on location
    const userCurrency = await smartPricingEngine.getUserCurrency(req);
    
    // Get pricing summary with tax info
    const pricingSummary = await smartPricingEngine.getPricingSummary(req, planId);
    
    const origin = req.headers.get('origin') || `${req.nextUrl.protocol}//${req.nextUrl.host}`;
    const successUrl = `${origin}/${locale}${successPath}?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${origin}/${locale}${cancelPath}?cancelled=true`;

    // Try to create checkout session with Smart Pricing Engine
    const result = await smartPricingEngine.createCheckoutSession(
      planId,
      userCurrency,
      req,
      {
        customerEmail,
        successUrl,
        cancelUrl,
        allowPurchaseOrder,
      }
    );

    // If purchase order is required, return that info
    if (result.requiresPurchaseOrder) {
      return NextResponse.json({
        requiresPurchaseOrder: true,
        purchaseOrderId: result.purchaseOrderId,
        pricingSummary,
      });
    }

    // Get the plan details for Stripe session
    const plan = pricingSummary.availablePlans.find(p => p.id === planId);
    if (!plan) {
      return NextResponse.json({ error: 'Plan not found' }, { status: 404 });
    }

    // Create actual Stripe checkout session with automatic tax
    const stripeSession = await stripe.checkout.sessions.create({
      automatic_payment_methods: { enabled: true },
      line_items: [
        {
          price: plan.stripePriceIds[userCurrency as keyof typeof plan.stripePriceIds],
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
      customer_email: customerEmail,
      automatic_tax: { enabled: true },
      tax_id_collection: { enabled: pricingSummary.taxInfo.taxRequired },
      metadata: {
        planId: String(planId),
        currency: String(userCurrency),
        userCountry: String(pricingSummary.userLocation.countryCode || ''),
        userState: String(pricingSummary.userLocation.stateCode || ''),
      },
    });

    return NextResponse.json({
      sessionId: stripeSession.id,
      pricingSummary,
      requiresPurchaseOrder: false,
    });

  } catch (error: any) {
    console.error('Smart pricing session creation failed:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}

// GET endpoint to retrieve pricing information
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const planId = searchParams.get('planId');
    
    const pricingSummary = await smartPricingEngine.getPricingSummary(req, planId || undefined);
    
    return NextResponse.json(pricingSummary);
  } catch (error: any) {
    console.error('Failed to get pricing summary:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to get pricing information' },
      { status: 500 }
    );
  }
}
