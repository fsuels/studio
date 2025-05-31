// src/components/TopDocsChips.tsx
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useTranslation } from 'react-i18next';
import { useParams, useRouter } from 'next/navigation';
import {
  Loader2,
  FileText,
  Folder,
  Home,
  Users,
  type LucideIcon,
} from 'lucide-react';
import { documentLibrary, type LegalDocument } from '@/lib/document-library';

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
  const { t: tCommon } = useTranslation('common');
  const params = (useParams<{ locale?: string }>() ?? {}) as {
    locale?: string;
  };
  const router = useRouter();
  const locale = (params.locale as 'en' | 'es') || 'en';

  const [topDocs, setTopDocs] = useState<LegalDocument[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isHydrated, setIsHydrated] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const badges: Record<string, 'new' | 'updated'> = {
    powerOfAttorney: 'new',
    leaseAgreement: 'updated',
  };
  const categoryIcons: Record<string, LucideIcon> = {
    Finance: Folder,
    'Real Estate': Home,
    Family: Users,
  };

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    const resolvedTopDocs = staticTopDocIds
      .map((id) => documentLibrary.find((doc) => doc.id === id))
      .filter((doc): doc is LegalDocument => doc !== undefined);

    setTopDocs(resolvedTopDocs);
    setIsLoading(false);
  }, [isHydrated]);


  const categories = React.useMemo(
    () => Array.from(new Set(topDocs.map((d) => d.category))).sort(),
    [topDocs],
  );
  const filteredDocs =
    selectedCategory === 'All'
      ? topDocs
      : topDocs.filter((d) => d.category === selectedCategory);


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
          {tCommon('TopDocsChips.loading', {
            defaultValue: 'Loading popular documents...',
          })}
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
        {tCommon('TopDocsChips.title', {
          defaultValue: 'Popular Legal Documents',
        })}
      </h2>
      {categories.length > 1 && (
        <div className="mb-4 flex flex-wrap justify-center gap-2">
          <Button
            size="sm"
            variant={selectedCategory === 'All' ? 'default' : 'outline'}
            onClick={() => setSelectedCategory('All')}
          >
            All
          </Button>
          {categories.map((cat) => (
            <Button
              key={cat}
              size="sm"
              variant={selectedCategory === cat ? 'default' : 'outline'}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </Button>
          ))}
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filteredDocs.map((doc) => {
          const Icon = categoryIcons[doc.category] || FileText;
          const badge = badges[doc.id];
          return (
            <Link
              key={doc.id}
              href={`/${locale}/docs/${doc.id}`}
              prefetch
              className="p-4 border rounded-lg bg-card hover:bg-muted transition-colors shadow-sm"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  {React.createElement(Icon, {
                    className: 'h-4 w-4 text-primary/80',
                  })}
                  <span className="text-sm font-medium">
                    {doc.translations?.[locale as 'en' | 'es']?.name ||
                      doc.translations?.en?.name ||
                      doc.name ||
                      doc.id}
                  </span>
                </div>
                {badge && (
                  <Badge variant="secondary">
                    {badge === 'new' ? '🔥 New' : '🆕 Updated'}
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-2">~3 min</p>
            </Link>
          );
        })}
      </div>
      <div className="text-center mt-6">
        <Button
          variant="link"
          onClick={handleExploreAll}
          className="text-primary text-sm"
        >
          {tCommon('stepOne.exploreAllCategoriesButton', {
            defaultValue: 'Explore All Document Categories',
          })}{' '}
          →
        </Button>
      </div>
    </section>
  );
});
export default TopDocsChips;
