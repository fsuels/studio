// src/app/[locale]/checkout/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useCurrentSearchParams } from '@/hooks/useCurrentSearchParams';
import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
const stripePromise = publishableKey ? loadStripe(publishableKey) : null;
const CONFIG_ERROR_MESSAGE =
  'Payments are temporarily unavailable while we finalize Stripe setup. Please contact support if this persists.';

export default function CheckoutPage() {
  const search = useCurrentSearchParams();
  const router = useRouter();

  const locale = search?.get('locale') ?? 'en';
  const docId = search?.get('docId');

  const [isLoading, setIsLoading] = useState(false);
  const [configError, setConfigError] = useState<string | null>(
    stripePromise ? null : CONFIG_ERROR_MESSAGE,
  );

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
    if (!stripePromise) {
      setConfigError(CONFIG_ERROR_MESSAGE);
      return;
    }

    setIsLoading(true);
    setConfigError(null);

    try {
      const res = await fetch('/api/checkout/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ docId, locale }),
      });

      if (!res.ok) {
        console.error('Failed to create Stripe session:', await res.text());
        setConfigError('We could not start checkout. Please try again.');
        return;
      }

      const { sessionId } = await res.json();
      if (!sessionId) {
        console.error('No sessionId returned from /api/checkout/session');
        setConfigError('We could not start checkout. Please try again.');
        return;
      }

      const stripe = await stripePromise;
      if (!stripe) {
        console.error('Stripe.js failed to load');
        setConfigError('Stripe.js failed to load. Please refresh and try again.');
        return;
      }

      const { error } = await stripe.redirectToCheckout({ sessionId });
      if (error) {
        console.error('redirectToCheckout error:', error.message);
        setConfigError(error.message ?? 'Stripe redirect failed. Please try again.');
      }
    } catch (err) {
      console.error('Unexpected checkout error:', err);
      setConfigError('Unexpected error starting checkout. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const stripeUnavailable = !stripePromise;

  return (
    <div className="max-w-md mx-auto my-16 p-6 border rounded">
      <h1 className="text-xl font-semibold mb-4">Purchase & Download</h1>
      <p className="mb-6">
        You&rsquo;re about to purchase{' '}
        <strong>{docId.replace(/-/g, ' ')}</strong>
      </p>

      <div className="flex items-center">
        <Button onClick={handlePay} disabled={isLoading || stripeUnavailable}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Redirecting...
            </>
          ) : (
            'Pay with Card'
          )}
        </Button>
        <Button variant="ghost" className="ml-4" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
      {configError && (
        <p className="mt-4 text-sm text-red-600" role="alert">
          {configError}
        </p>
      )}
    </div>
  );
}
