// src/components/TopDocsChips.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { useParams, useRouter } from 'next/navigation';
import { Loader2, FileText } from 'lucide-react';
import { documentLibrary, type LegalDocument } from '@/lib/document-library/index';
import { getDocumentStartUrl } from '@/lib/document-library/url';

// Placeholder data for top docs - in a real app, this would come from Firestore
const staticTopDocIds: string[] = [
  'bill-of-sale-vehicle',
  'leaseAgreement',
  'nda',
  'powerOfAttorney',
  'eviction-notice',
  'last-will-testament',
];

const TopDocsChips = React.memo(function TopDocsChips() {
  // Use 'common' namespace for shared UI text
  const { t: tCommon, i18n } = useTranslation("common");
  const params = useParams();
  const router = useRouter();
  const locale = (params.locale as 'en' | 'es') || 'en';
  
  const [topDocs, setTopDocs] = useState<LegalDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    const resolvedTopDocs = staticTopDocIds
      .map(id => documentLibrary.find(doc => doc.id === id))
      .filter((doc): doc is LegalDocument => doc !== undefined);

    setTopDocs(resolvedTopDocs);
    setIsLoading(false);
  }, [isHydrated]);

  // Prefetch document pages for snappier navigation
  useEffect(() => {
    if (!isHydrated || topDocs.length === 0) return;
    topDocs.forEach(doc => {
      router.prefetch(
        getDocumentStartUrl(
          locale,
          (doc.jurisdiction || 'US').toLowerCase(),
          doc.id,
        ),
      );
    });
  }, [isHydrated, topDocs, router, locale]);

  const handleExploreAll = () => {
    const workflowStartElement = document.getElementById('workflow-start');
    if (workflowStartElement) {
      router.push(`/${locale}/#workflow-start`);
    } else {
      router.push(`/${locale}/`); // Fallback to homepage
    }
  };

  if (isLoading && isHydrated) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
        <p className="text-sm text-muted-foreground mt-2">
          {tCommon('TopDocsChips.loading', { defaultValue: 'Loading popular documents...' })}
        </p>
      </div>
    );
  }
  
  if (!isHydrated || topDocs.length === 0) {
    return isHydrated ? null : <div className="h-20" />; 
  }

  return (
    <section className="container mx-auto px-4 py-8 md:py-12">
      <h2 className="text-xl font-semibold text-center mb-6 text-foreground">
        {tCommon('TopDocsChips.title', { defaultValue: 'Popular Legal Documents' })}
      </h2>
      <div className="flex flex-wrap justify-center items-center gap-2 md:gap-3">
        {topDocs.map((doc) => (
          <Button
            key={doc.id}
            variant="outline"
            size="sm"
            asChild
            className="bg-card hover:bg-muted border-border text-card-foreground hover:text-primary transition-colors shadow-sm px-4 py-2 h-auto text-xs sm:text-sm"
          >
            <Link
              href={getDocumentStartUrl(
                locale,
                (doc.jurisdiction || 'US').toLowerCase(),
                doc.id,
              )}
              prefetch
            >
              {React.createElement(FileText, { className: "h-4 w-4 mr-2 text-primary/80 opacity-70" })}
              {(doc.translations?.[locale as 'en' | 'es']?.name) ||
               doc.translations?.en?.name ||
               doc.name ||
               doc.id}
            </Link>
          </Button>
        ))}
      </div>
      <div className="text-center mt-6">
        <Button variant="link" onClick={handleExploreAll} className="text-primary text-sm">
          {tCommon('stepOne.exploreAllCategoriesButton', { defaultValue: 'Explore All Document Categories' })} →
        </Button>
      </div>
    </section>
  );
});
export default TopDocsChips;
