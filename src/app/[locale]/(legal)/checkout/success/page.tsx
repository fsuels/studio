'use client';

import { useParams, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { createPaymentRecord } from '@/lib/firestore/paymentActions';
import { useAuth } from '@/hooks/useAuth';

export default function CheckoutSuccessPage() {
  const { locale } = useParams() as { locale: string };
  const search = useSearchParams();
  const docId = search.get('docId');
  const session_id = search.get('session_id');
  const [paid, setPaid] = useState(false);
  const { user } = useAuth();

  // Record payment in Firestore (simple simulation)
  useEffect(() => {
    if (docId && session_id && user?.uid) {
      createPaymentRecord({ userId: user.uid, docId, session_id }).then(() => {
        setPaid(true);
      });
    }
  }, [docId, session_id, user?.uid]);

  const downloadPdf = async () => {
    // call your existing PDF endpoint
    const res = await fetch(`/${locale}/api/generate-pdf`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ docId, locale }),
    });
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${docId}.pdf`;
    a.click();
  };

  if (!paid) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-lg">Finalizing your payment…</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-lg mx-auto text-center">
      <h1 className="text-2xl font-bold mb-4">Payment Successful!</h1>
      <p className="mb-6">Thank you. You may now download your document.</p>
      <Button onClick={downloadPdf}>Download Document</Button>
    </div>
  );
}
