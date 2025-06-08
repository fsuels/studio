// src/app/[locale]/docs/[docId]/view/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { X, Edit, FileSignature, Download } from 'lucide-react';
import DocumentDetail from '@/components/DocumentDetail';

// TODO: implement these Firestore/Stripe helpers:
async function checkPayment(docId: string): Promise<boolean> {
  // return true if user has paid for docId
  // e.g. await getUserPayments(...).then(...)
  return false;
}
async function getPdfUrl(docId: string): Promise<string> {
  // return a Storage download URL or generate-on-the-fly URL
  return `/api/generate-pdf?docId=${encodeURIComponent(docId)}`;
}

export default function DocumentViewPage() {
  const { locale, docId } = useParams() as { locale: string; docId: string };
  const router = useRouter();
  const { t } = useTranslation('common');

  const [isPaid, setIsPaid] = useState<boolean>(false);

  useEffect(() => {
    checkPayment(docId).then(setIsPaid);
  }, [docId]);

  const handleDownload = async () => {
    if (isPaid) {
      const url = await getPdfUrl(docId);
      window.location.href = url;
    } else {
      router.push(`/${locale}/checkout?docId=${encodeURIComponent(docId)}`);
    }
  };

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <Link href={`/${locale}/dashboard`} className="text-muted-foreground hover:text-primary">
            <X className="h-5 w-5" />
          </Link>
          <h1 className="text-2xl font-bold text-foreground">
            {t('View Document')}
          </h1>
        </div>
        <div className="flex space-x-2">
          {/* Edit */}
          <Link href={`/${locale}/docs/${docId}/start`} passHref>
            <Button asChild size="sm">
              <a>
                <Edit className="mr-2 h-4 w-4" /> {t('Edit')}
              </a>
            </Button>
          </Link>
          {/* Sign */}
          <Button
            size="sm"
            onClick={() =>
              window.open(`/${locale}/signwell?docId=${encodeURIComponent(docId)}`, '_blank')
            }
          >
            <FileSignature className="mr-2 h-4 w-4" /> {t('Sign')}
          </Button>
          {/* Download */}
          <Button size="sm" onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" /> {t('Download')}
          </Button>
        </div>
      </div>

      {/* Document preview area */}
      <div className="bg-card p-4 rounded-xl shadow-lg border border-border">
        <DocumentDetail docId={docId} locale={locale as 'en' | 'es'} />
      </div>
    </main>
  );
}
