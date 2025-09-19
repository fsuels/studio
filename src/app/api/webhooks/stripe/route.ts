import { NextRequest, NextResponse } from 'next/server';
import { stripeIntegration } from '@/lib/stripe-integration';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const signature = request.headers.get('stripe-signature');
    if (!signature) {
      console.error('Stripe webhook missing signature header');
      return NextResponse.json(
        { error: 'Missing Stripe signature header' },
        { status: 400 },
      );
    }

    const payload = await request.text();
    if (!payload) {
      console.error('Stripe webhook received empty payload');
      return NextResponse.json(
        { error: 'Empty Stripe webhook payload' },
        { status: 400 },
      );
    }

    const result = await stripeIntegration.handleWebhook(payload, signature);
    if (!result.received) {
      return NextResponse.json(
        { error: 'Invalid Stripe signature' },
        { status: 400 },
      );
    }

    return new Response(null, { status: 200 });
  } catch (error) {
    console.error('Stripe webhook handling failed', error);
    return NextResponse.json(
      { error: 'Failed to process Stripe webhook' },
      { status: 500 },
    );
  }
}
