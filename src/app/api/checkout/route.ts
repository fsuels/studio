import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { track } from '@/lib/analytics';
import { PRICE_LOOKUP, COUPONS } from '@/lib/stripePrices';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-04-30.basil',
})


export async function POST(req: NextRequest) {
  try {
    const { items, promo } = (await req.json()) as {
      items: { id: string; qty?: number }[];
      promo?: string;
    };

    if (!items?.length) {
      return NextResponse.json(
        { error: 'Cart is empty' },
        { status: 400 },
      );
    }

    /* ---------- build Stripe line‑items -------------------- */
    const line_items = items.map((i) => {
      const priceId = PRICE_LOOKUP[i.id];
      if (!priceId) throw new Error(`Unknown SKU: ${i.id}`);
      return {
        price: priceId,
        quantity: Math.max(1, i.qty ?? 1),
      };
    });

    /* ---------- checkout params ---------------------------- */
    const params: Stripe.Checkout.SessionCreateParams = {
      mode: 'payment',
      line_items,
      discounts: promo && COUPONS[promo.toUpperCase()]
        ? [{ coupon: COUPONS[promo.toUpperCase()] }]
        : undefined,
      success_url: `${req.nextUrl.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.nextUrl.origin}/cart`,
      automatic_tax: { enabled: true },
    };

    const session = await stripe.checkout.sessions.create(params);

    /* ---------- analytics (server‑side) --------------------- */
    track('begin_checkout', {
      value: line_items.reduce((s, li) => s + (li.quantity ?? 1), 0),
      coupon: promo ?? null,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: unknown) {
    console.error('Stripe checkout error →', err);
    const message = err instanceof Error ? err.message : 'Internal error';
    return NextResponse.json(
      { error: message },
      { status: 500 },
    );
  }
}
