import Stripe from 'stripe';
import { STRIPE_API_VERSION } from '@/lib/stripe-config';

let cachedStripe: Stripe | null = null;

export function getStripeServerClient(): Stripe {
  if (cachedStripe) {
    return cachedStripe;
  }

  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error('STRIPE_SECRET_KEY is not configured');
  }

  cachedStripe = new Stripe(secretKey, {
    apiVersion: STRIPE_API_VERSION,
  });

  return cachedStripe;
}
