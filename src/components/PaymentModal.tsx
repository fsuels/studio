// src/components/PaymentModal.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { loadStripe, Stripe, StripeElements } from '@stripe/stripe-js';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface PaymentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  documentName: string;
  documentId: string;
  priceCents: number;
  onSuccess: () => void;
}

export default function PaymentModal({
  open,
  onOpenChange,
  documentName,
  documentId,
  priceCents,
  onSuccess,
}: PaymentModalProps) {
  const elementsRef = useRef<StripeElements | null>(null);
  const [stripe, setStripe] = useState<Stripe | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    async function init() {
      setError(null);
      const res = await fetch('/api/payments/create-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: documentId, name: documentName, amount: priceCents }),
      });
      const data = await res.json();
      if (!data.clientSecret) {
        setError(data.error || 'Unable to start payment');
        return;
      }
      const stripe = await stripePromise;
      if (!stripe) {
        setError('Stripe not loaded');
        return;
      }
      const elements = stripe.elements({ clientSecret: data.clientSecret });
      const paymentElement = elements.create('payment');
      paymentElement.mount('#payment-element');
      elementsRef.current = elements;
      setClientSecret(data.clientSecret);
      setStripe(stripe);
    }
    init();
    return () => {
      const el = document.getElementById('payment-element');
      if (el) el.innerHTML = '';
      elementsRef.current = null;
    };
  }, [open, documentId, documentName, priceCents]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elementsRef.current || !clientSecret) return;
    setLoading(true);
    const { error } = await stripe.confirmPayment({
      elements: elementsRef.current,
      confirmParams: {},
      redirect: 'if_required',
    });
    if (error) {
      setError(error.message || 'Payment failed');
    } else {
      onOpenChange(false);
      onSuccess();
    }
    setLoading(false);
  };

  const priceDisplay = (priceCents / 100).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Purchase {documentName}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div id="payment-element" />
          {error && <p className="text-destructive text-sm">{error}</p>}
          <Button disabled={!clientSecret || loading} className="w-full" type="submit">
            {loading ? 'Processing...' : `Pay ${priceDisplay}`}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
