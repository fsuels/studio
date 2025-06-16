'use client';

import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  useStripe,
  useElements,
  PaymentElement,
} from '@stripe/react-stripe-js';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
);

interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  clientSecret: string | null;
  documentName: string;
  priceCents: number;
  onSuccess: () => void;
}

function CheckoutForm({ onSuccess }: { onSuccess: () => void }) {
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setSubmitting(true);
    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: window.location.href },
      redirect: 'if_required',
    });
    if (!error && paymentIntent && paymentIntent.status === 'succeeded') {
      onSuccess();
    }
    setSubmitting(false);
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-4">
      <PaymentElement />
      <Button type="submit" disabled={!stripe || submitting} className="w-full">
        {submitting ? 'Processing...' : 'Pay'}
      </Button>
    </form>
  );
}

export default function PaymentModal({
  open,
  onClose,
  clientSecret,
  documentName,
  priceCents,
  onSuccess,
}: PaymentModalProps) {
  const options = clientSecret
    ? { clientSecret, appearance: { theme: 'stripe' } }
    : undefined;
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md bg-card border-border p-6 rounded-lg shadow-xl">
        <DialogHeader>
          <DialogTitle>Purchase {documentName}</DialogTitle>
          <DialogDescription>
            Complete payment of ${(priceCents / 100).toFixed(2)} to generate
            your document.
          </DialogDescription>
        </DialogHeader>
        {clientSecret ? (
          <Elements stripe={stripePromise} options={options}>
            <CheckoutForm onSuccess={onSuccess} />
          </Elements>
        ) : (
          <p>Loading...</p>
        )}
      </DialogContent>
    </Dialog>
  );
}
