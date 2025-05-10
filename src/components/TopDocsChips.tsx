// src/components/TopDocsChips.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { useParams, useRouter } from 'next/navigation';
import { Loader2, FileText } from 'lucide-react';
import { documentLibrary, type LegalDocument } from '@/lib/document-library'; // For full doc data

// Placeholder data for top docs - in a real app, this would come from Firestore
const staticTopDocIds: string[] = [
  'bill-of-sale-vehicle',
  'leaseAgreement',
  'nda',
  'powerOfAttorney',
  'eviction-notice',
  'last-will-testament',
];

export default function TopDocsChips() {
  const { t, i18n } = useTranslation();
  const params = useParams();
  const router = useRouter();
  const locale = params.locale as 'en' | 'es' || 'en';
  
  const [topDocs, setTopDocs] = useState<LegalDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    // Simulate fetching top doc IDs from Firestore and then getting full doc data
    // In a real app: getDoc(doc(db, 'stats', 'mostPopular')).then(snapshot => setTopDocIds(snapshot.data()?.topDocs || []))
    // Then map IDs to full documents from documentLibrary
    const resolvedTopDocs = staticTopDocIds
      .map(id => documentLibrary.find(doc => doc.id === id))
      .filter(doc => doc !== undefined) as LegalDocument[];
    
    setTopDocs(resolvedTopDocs);
    setIsLoading(false);
  }, [isHydrated]);

  const handleChipClick = (docId: string) => {
    // Navigate to the document detail page or wizard start
    router.push(`/${locale}/docs/${docId}`);
  };

  const handleExploreAll = () => {
    // Navigate to a page or scroll to a section that shows all categories/documents
    // For now, let's assume it scrolls to the existing Step1DocumentSelector (workflow-start section)
    // and clears any category filter to show all categories.
    const workflowStartElement = document.getElementById('workflow-start');
    if (workflowStartElement) {
      // You might need a way to signal Step1DocumentSelector to show 'all-categories' view.
      // For simplicity, just navigate to the home page which defaults to showing top docs/categories.
      router.push(`/${locale}/#workflow-start`);
    }
  };


  if (isLoading && isHydrated) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
        <p className="text-sm text-muted-foreground mt-2">{t('TopDocsChips.loading', {defaultValue: 'Loading popular documents...'})}</p>
      </div>
    );
  }
  
  if (!isHydrated || topDocs.length === 0) {
    // Return null or a minimal placeholder if not hydrated or no docs
    return isHydrated ? null : <div className="h-20" />; // Placeholder height during SSR
  }

  return (
    <section className="container mx-auto px-4 py-8 md:py-12">
      <h2 className="text-xl font-semibold text-center mb-6 text-foreground">
        {t('TopDocsChips.title', {defaultValue: 'Popular Legal Documents'})}
      </h2>
      <div className="flex flex-wrap justify-center items-center gap-2 md:gap-3">
        {topDocs.map((doc) => (
          <Button
            key={doc.id}
            variant="outline"
            size="sm"
            onClick={() => handleChipClick(doc.id)}
            className="bg-card hover:bg-muted border-border text-card-foreground hover:text-primary transition-colors shadow-sm px-4 py-2 h-auto text-xs sm:text-sm"
          >
            {React.createElement(FileText, { className: "h-4 w-4 mr-2 text-primary/80 opacity-70" })} {/* Example icon */}
            {locale === 'es' && doc.name_es ? doc.name_es : doc.name}
          </Button>
        ))}
      </div>
      <div className="text-center mt-6">
        <Button variant="link" onClick={handleExploreAll} className="text-primary text-sm">
          {t('stepOne.exploreAllCategoriesButton', 'Explore All Document Categories')} →
        </Button>
      </div>
    </section>
  );
}
