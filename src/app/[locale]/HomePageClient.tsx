// src/app/[locale]/HomePageClient.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { lazyOnView } from '@/components/LazyOnView';
import type { LegalDocument } from '@/lib/document-library';
import { documentLibrary } from '@/lib/document-library';
import HomepageHeroSteps from '@/components/landing/HomepageHeroSteps';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { Loader2, Mic, SendHorizontal } from 'lucide-react';
import { CATEGORY_LIST } from '@/components/Step1DocumentSelector';
import { useTranslation } from 'react-i18next';
import { useSearchParams, useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import PersonalizationBlock from '@/components/PersonalizationBlock';

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-32">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
    <p className="ml-2 text-muted-foreground">Loading Section...</p>
  </div>
);

const HowItWorks = lazyOnView(() => import('@/components/landing/HowItWorks'), {
  placeholder: <LoadingSpinner />,
});

const TrustAndTestimonialsSection = lazyOnView(
  () => import('@/components/landing/TrustAndTestimonialsSection'),
  {
    placeholder: <LoadingSpinner />,
  },
);

const GuaranteeBadge = lazyOnView(
  () => import('@/components/landing/GuaranteeBadge').then((mod) => mod.GuaranteeBadge),
  {
    placeholder: <LoadingSpinner />,
  },
);

const TopDocsChips = lazyOnView(() => import('@/components/TopDocsChips'), {
  placeholder: <LoadingSpinner />,
});

const Step1DocumentSelector = lazyOnView(
  () => import('@/components/Step1DocumentSelector').then((m) => m.default),
  { placeholder: <LoadingSpinner /> },
);

const AnnouncementBar = lazyOnView(() => import('@/components/AnnouncementBar'), {
  placeholder: null,
});

const StickyFilterBar = lazyOnView(
  () => import('@/components/StickyFilterBar'),
  { placeholder: <div className="h-16 bg-muted" /> },
);

export default function HomePageClient() {
  const { t } = useTranslation('common');
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const router = useRouter();
  const params = useParams();
  const locale = (params!.locale as 'en' | 'es') || 'en';

  const [globalSearchTerm, setGlobalSearchTerm] = useState('');
  const [globalSelectedState, setGlobalSelectedState] = useState<string>('');
  const [selectedCategoryForFilter, setSelectedCategoryForFilter] = useState<string | null>(null);
  const [selectedDocument, setSelectedDocument] = useState<LegalDocument | null>(null);
  const [assistantQuery, setAssistantQuery] = useState('');
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const workflowSectionId = 'workflow-start';

  const scrollToWorkflow = useCallback(() => {
    const section = document.getElementById(workflowSectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    const docIdFromQuery = searchParams!.get('docId');
    const categoryFromQuery = searchParams!.get('category');
    const searchFromQuery = searchParams!.get('search');

    if (searchFromQuery && !globalSearchTerm) {
      setGlobalSearchTerm(searchFromQuery);
      scrollToWorkflow();
    }

    if (categoryFromQuery && !selectedCategoryForFilter) {
      const isValidCategory = CATEGORY_LIST.some((cat) => cat.key === categoryFromQuery);
      if (isValidCategory) {
        setSelectedCategoryForFilter(categoryFromQuery);
        scrollToWorkflow();
      }
    }

    if (docIdFromQuery && !selectedCategoryForFilter && !selectedDocument) {
      const foundDoc = documentLibrary.find((d) => d.id === docIdFromQuery);
      if (foundDoc) {
        setSelectedCategoryForFilter(foundDoc.category);
        scrollToWorkflow();
      }
    }
  }, [searchParams, globalSearchTerm, selectedCategoryForFilter, selectedDocument, isHydrated, scrollToWorkflow]);

  const handleDocumentTypeSelect = useCallback(
    (doc: LegalDocument) => {
      if (!isHydrated) return;
      if (doc) {
        setSelectedDocument(doc);
        toast({
          title: t('toasts.docTypeConfirmedTitle'),
          description: t('toasts.docTypeConfirmedDescription', {
            docName:
              locale === 'es'
                ? doc.translations?.es?.name || doc.translations?.en?.name || doc.name
                : doc.translations?.en?.name || doc.name || doc.translations?.es?.name,
          }),
        });
        router.push(`/${locale}/docs/${doc.id}/start`);
      } else {
        console.warn('[HomePageClient] Document selection received null or undefined doc.');
      }
    },
    [toast, t, locale, isHydrated, router],
  );

  const handleAssistantSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!isHydrated) return;
      if (assistantQuery.trim()) {
        router.push(`/generate?search=${encodeURIComponent(assistantQuery)}`);
      }
    },
    [assistantQuery, isHydrated, router],
  );

  const renderMainInteraction = () => {
    if (!isHydrated) {
      return (
        <div className="text-center py-10">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <p suppressHydrationWarning>{t('Loading...', { ns: 'common' })}</p>
        </div>
      );
    }
    return (
      <Step1DocumentSelector
        selectedCategory={selectedCategoryForFilter}
        onCategorySelect={setSelectedCategoryForFilter}
        onDocumentSelect={handleDocumentTypeSelect}
        globalSelectedState={globalSelectedState}
        globalSearchTerm={globalSearchTerm}
      />
    );
  };

  return (
    <>
      <AnnouncementBar />

      {/* HERO SECTION + AI assistant CTA */}
      <section className="text-center px-4 pt-12 pb-6 max-w-2xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold leading-tight">
          AI‑Powered Legal Documents in 3 Minutes
        </h1>
        <p className="mt-4 text-muted-foreground text-base sm:text-lg">
          Describe your situation—our AI guides you to the right document instantly.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/generate">
            <Button size="lg" className="text-lg px-8 py-6">
              🚀 Start My Document
            </Button>
          </Link>
          <Link href="/demo">
            <Button size="lg" variant="outline" className="text-lg px-8 py-6">
              🎥 See 30‑Second Demo
            </Button>
          </Link>
        </div>
        <div className="mt-4 text-sm text-gray-500">
          No account required. No subscriptions. Start free.
        </div>
      </section>

      {/* AI Assistant bar */}
      <section className="px-4 pb-6">
        <form
          onSubmit={handleAssistantSubmit}
          className="max-w-xl mx-auto flex items-center gap-2"
        >
          <Input
            type="text"
            value={assistantQuery}
            onChange={(e) => setAssistantQuery(e.target.value)}
            placeholder="e.g., I want to hire a freelancer"
            aria-label="What legal help do you need?"
            className="flex-1"
          />
          <Button type="button" variant="ghost" size="icon" aria-label="Voice input (coming soon)">
            <Mic className="h-5 w-5 text-muted-foreground" />
          </Button>
          <Button type="submit" size="icon" aria-label="Submit query">
            <SendHorizontal className="h-5 w-5" />
          </Button>
        </form>
      </section>

      <HomepageHeroSteps />
      <HowItWorks />
      <TrustAndTestimonialsSection />
      <GuaranteeBadge />
      <TopDocsChips />

      <Separator className="my-12" />

      <section
        id={workflowSectionId}
        className="container mx-auto px-4 py-8 md:py-12 scroll-mt-20"
      >
        <div className="max-w-4xl mx-auto">
          <h2
            className="text-3xl md:text-4xl font-bold text-center mb-4 text-foreground"
            suppressHydrationWarning
          >
            {t('What do you want to accomplish?', { ns: 'common' })}
          </h2>
          <p
            className="text-lg md:text-xl text-muted-foreground text-center mb-10"
            suppressHydrationWarning
          >
            {t('stepOne.categoryDescription', { ns: 'common' })}
          </p>

          {isHydrated ? (
            <StickyFilterBar
              searchTerm={globalSearchTerm}
              onSearchTermChange={(term) => {
                setGlobalSearchTerm(term);
                if (term.trim() !== '' && selectedCategoryForFilter) {
                  setSelectedCategoryForFilter(null);
                }
              }}
              selectedState={globalSelectedState}
              onSelectedStateChange={(state) => {
                setGlobalSelectedState(state);
              }}
            />
          ) : (
            <div className="h-16 bg-muted" />
          )}

          <div className="mt-8 bg-card p-4 sm:p-6 md:p-8 rounded-xl shadow-2xl border border-border/20">
            <div className="mt-6">{renderMainInteraction()}</div>
            <PersonalizationBlock />
          </div>
        </div>
      </section>
    </>
  );
}
