// src/app/api/checkout/session/route.ts
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { documentLibrary } from '@/lib/document-library';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2022-11-15',
});

export async function POST(req: NextRequest) {
  const { docId, locale } = await req.json();
  const doc = documentLibrary.find((d) => d.id === docId);
  if (!doc) {
    return NextResponse.json({ error: 'Unknown document' }, { status: 400 });
  }

  // price is in cents
  const unitAmount = Math.round((doc.basePrice || 0) * 100);

  const origin =
    req.headers.get('origin') || `${req.nextUrl.protocol}//${req.nextUrl.host}`;
  const successUrl = `${origin}/${locale}/docs/${docId}/view?payment=success`;
  const cancelUrl = `${origin}/${locale}/docs/${docId}/view?payment=cancel`;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: { name: doc.name },
          unit_amount,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: successUrl,
    cancel_url: cancelUrl,
  });

  return NextResponse.json({ sessionId: session.id });
}
