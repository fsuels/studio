// src/components/TopDocsChips.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { useParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';

// Placeholder data - in a real app, this would come from Firestore
const staticTopDocs = [
  { id: 'bill-of-sale-vehicle', nameKey: 'Vehicle Bill of Sale', defaultName: 'Vehicle Bill of Sale' },
  { id: 'leaseAgreement', nameKey: 'Residential Lease Agreement', defaultName: 'Residential Lease Agreement' },
  { id: 'nda', nameKey: 'Non-Disclosure Agreement (NDA)', defaultName: 'Non-Disclosure Agreement (NDA)' },
  { id: 'powerOfAttorney', nameKey: 'General Power of Attorney', defaultName: 'General Power of Attorney' },
  { id: 'eviction-notice', nameKey: 'Eviction Notice', defaultName: 'Eviction Notice' },
  { id: 'last-will-testament', nameKey: 'Last Will and Testament', defaultName: 'Last Will and Testament' },
];

export default function TopDocsChips() {
  const { t } = useTranslation();
  const params = useParams();
  const locale = params.locale as 'en' | 'es' || 'en';
  const [topDocs, setTopDocs] = useState<typeof staticTopDocs>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching data
    // In a real app, you'd fetch from Firestore:
    // e.g., getDoc(doc(db, 'stats', 'mostPopular')).then(snapshot => setTopDocs(snapshot.data()?.topDocs || []))
    setTimeout(() => {
      setTopDocs(staticTopDocs);
      setIsLoading(false);
    }, 500); 
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
        <p className="text-sm text-muted-foreground mt-2">{t('Loading popular documents...', {defaultValue: 'Loading popular documents...'})}</p>
      </div>
    );
  }
  
  if (topDocs.length === 0) {
    return null; // Don't render if there are no top docs
  }

  return (
    <section className="container mx-auto px-4 py-8 md:py-12">
      <h2 className="text-xl font-semibold text-center mb-6 text-foreground">
        {t('Popular Legal Documents', {defaultValue: 'Popular Legal Documents'})}
      </h2>
      <div className="flex flex-wrap justify-center gap-2 md:gap-3">
        {topDocs.map((doc) => (
          <Button
            key={doc.id}
            variant="outline"
            size="sm"
            asChild
            className="bg-background hover:bg-muted border-border text-foreground hover:text-primary transition-colors shadow-sm"
          >
            <Link href={`/${locale}/docs/${doc.id}`}>
              {t(doc.nameKey, doc.defaultName)}
            </Link>
          </Button>
        ))}
      </div>
    </section>
  );
}
