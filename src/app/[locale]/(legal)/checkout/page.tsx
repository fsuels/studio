// src/app/[locale]/checkout/page.tsx
'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

// Load stripe.js just once
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_51234567890abcdefghijklmnopqrstuvwxyz',
);

export default function CheckoutPage() {
  const search = useSearchParams();
  const router = useRouter();

  const locale = search?.get('locale') ?? 'en';
  const docId = search?.get('docId');

  const [isLoading, setIsLoading] = useState(false);

  if (!docId) {
    return (
      <div className="max-w-md mx-auto my-16 p-6 border rounded">
        <p className="text-red-600 mb-4">No document specified.</p>
        <Button variant="ghost" onClick={() => router.back()}>
          Go Back
        </Button>
      </div>
    );
  }

  const handlePay = async () => {
    setIsLoading(true);
    try {
      // 1) Create a session on your server
      const res = await fetch('/api/checkout/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ docId, locale }),
      });

      if (!res.ok) {
        console.error('Failed to create Stripe session:', await res.text());
        setIsLoading(false);
        return;
      }

      const { sessionId } = await res.json();
      if (!sessionId) {
        console.error('No sessionId returned from /api/checkout/session');
        setIsLoading(false);
        return;
      }

      // 2) Redirect to Stripe Checkout
      const stripe = await stripePromise;
      if (!stripe) {
        console.error('Stripe.js failed to load');
        setIsLoading(false);
        return;
      }

      const { error } = await stripe.redirectToCheckout({ sessionId });
      if (error) console.error('redirectToCheckout error:', error.message);

      // no need to setIsLoading(false) here—
      // Stripe will navigate away if all goes well
    } catch (err) {
      console.error('Unexpected checkout error:', err);
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-16 p-6 border rounded">
      <h1 className="text-xl font-semibold mb-4">Purchase & Download</h1>
      <p className="mb-6">
        You&rsquo;re about to purchase{' '}
        <strong>{docId.replace(/-/g, ' ')}</strong>
      </p>

      <div className="flex items-center">
        <Button onClick={handlePay} disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Redirecting…
            </>
          ) : (
            'Pay with Card'
          )}
        </Button>
        <Button variant="ghost" className="ml-4" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
