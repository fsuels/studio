import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripeSecret = process.env.STRIPE_SECRET_KEY;
const stripe = stripeSecret ? new Stripe(stripeSecret, { apiVersion: '2025-04-30.basil' }) : null;

export async function POST(req: NextRequest) {
  if (!stripe) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 });
  }
  try {
    const { id, name, amount } = await req.json();
    if (!amount || typeof amount !== 'number') {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }
    const intent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
      metadata: { documentId: id || '', name: name || '' },
    });
    return NextResponse.json({ clientSecret: intent.client_secret });
  } catch (err) {
    console.error('Stripe intent error', err);
    return NextResponse.json({ error: 'Failed to create payment intent' }, { status: 500 });
  }
}
