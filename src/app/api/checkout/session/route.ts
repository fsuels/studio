import Stripe from 'stripe';
import { NextResponse } from 'next/server';
import { documentLibrary } from '@/lib/document-library';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2022-11-15',
});

export async function POST(req: Request) {
  const { docId, locale } = await req.json();

  // Look up the document’s price in your library
  const docConfig = documentLibrary.find((d) => d.id === docId);
  if (!docConfig) {
    return NextResponse.json({ error: 'Invalid document ID' }, { status: 400 });
  }

  // amount in cents
  const unit_amount = Math.round((docConfig.basePrice || 19.95) * 100);

  // Build your success / cancel URLs
  const origin = req.headers.get('origin') || '';
  const success_url = `${origin}/${locale}/checkout/success?session_id={CHECKOUT_SESSION_ID}&docId=${docId}`;
  const cancel_url = `${origin}/${locale}/docs/${docId}/view`;

  // Create Checkout Session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [{
      price_data: {
        currency: 'usd',
        product_data: { name: docConfig.name },
        unit_amount,
      },
      quantity: 1,
    }],
    mode: 'payment',
    success_url,
    cancel_url,
    metadata: { docId, locale },
  });

  return NextResponse.json({ url: session.url });
}
