// src/app/[locale]/HomePageClient.tsx
'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import lazyOnView from '@/components/shared/media/LazyOnView';
import { Separator } from '@/components/ui/separator';
import { useTranslation } from 'react-i18next';
import { track } from '@/lib/analytics';
import AutoImage from '@/components/shared/media/AutoImage';
import TopDocsChips from '@/components/shared/TopDocsChips';
import type { DocumentSummary } from '@/lib/workflow/document-workflow';
import { loadWorkflowModule } from '@/lib/workflow/load-workflow-module';
import { resolveDocSlug } from '@/lib/slug-alias';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { CheckCircle2, DownloadCloud, FileText, PenSquare, ShieldCheck } from 'lucide-react';

const HERO_TRUST_ITEMS = [
  { key: 'home.hero2.trustRow.noCard', icon: CheckCircle2 },
  { key: 'home.hero2.trustRow.instant', icon: DownloadCloud },
  { key: 'home.hero2.trustRow.ssl', icon: ShieldCheck },
  { key: 'home.hero2.trustRow.edit', icon: PenSquare },
] as const;

const SpinnerIcon = () => (
  <svg
    className="h-8 w-8 animate-spin text-primary"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
      fill="none"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
    />
  </svg>
);

type HomePageClientProps = {
  locale: 'en' | 'es';
  popularDocs: DocumentSummary[];
};

// Minimal loading spinner without text
const _MinimalLoadingSpinner = () => (
  <div className="flex justify-center items-center h-32" role="status" aria-live="polite">
    <SpinnerIcon />
  </div>
);

// Skeletons for lazy-loaded sections
const HowItWorksSkeleton = () => (
  <div className="container mx-auto px-4 py-12">
    <div className="h-8 bg-muted rounded w-1/3 mx-auto mb-8"></div>
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="bg-muted rounded-lg p-6 h-40"></div>
      ))}
    </div>
  </div>
);

const TestimonialsSkeleton = () => (
  <div className="container mx-auto px-4 py-12">
    <div className="h-8 bg-muted rounded w-1/3 mx-auto mb-8"></div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {[...Array(2)].map((_, i) => (
        <div key={i} className="bg-muted rounded-lg p-6 h-48"></div>
      ))}
    </div>
  </div>
);

const HowItWorks = lazyOnView(
  () => import('@/components/layout/landing/HowItWorks'),
  {
    placeholder: <HowItWorksSkeleton />,
  },
);

const TrustAndTestimonialsSection = lazyOnView(
  () => import('@/components/layout/landing/TrustAndTestimonialsSection'),
  {
    placeholder: <TestimonialsSkeleton />,
  },
);

type HeroDocumentBuilderProps = {
  locale: 'en' | 'es';
};

const formatLabel = (value: string) =>
  value
    .split(/[-_]/)
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(' ');

const HeroDocumentBuilder = React.memo(function HeroDocumentBuilder({
  locale,
}: HeroDocumentBuilderProps) {
  const { t } = useTranslation('common');
  const router = useRouter();
  const [documents, setDocuments] = useState<DocumentSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  const [selectedDocId, setSelectedDocId] = useState<string | undefined>();
  const [selectedEvent, setSelectedEvent] = useState<string | undefined>();

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    loadWorkflowModule()
      .then((module) => {
        if (cancelled) return;
        const docs = module.getWorkflowDocuments({
          jurisdiction: 'us',
          language: locale === 'es' ? 'es' : 'en',
        });
        setDocuments(docs);
      })
      .catch((error) => {
        if (!cancelled) {
          console.error('Failed to load documents for hero builder:', error);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [locale]);

  const getDocName = useCallback(
    (doc: DocumentSummary) =>
      doc.translations?.[locale]?.name ??
      doc.translations?.en?.name ??
      doc.title,
    [locale],
  );

  const categories = useMemo(() => {
    const unique = new Set<string>();
    documents.forEach((doc) => {
      if (doc.category) {
        unique.add(doc.category);
      }
    });
    return Array.from(unique).sort((a, b) => a.localeCompare(b));
  }, [documents]);

  const docsForCategory = useMemo(() => {
    if (!selectedCategory) return [] as DocumentSummary[];
    const subset = documents.filter((doc) => doc.category === selectedCategory);
    return [...subset].sort((a, b) => getDocName(a).localeCompare(getDocName(b)));
  }, [documents, selectedCategory, getDocName]);

  const lifeEventOptions = useMemo(() => {
    const sourceDocs =
      selectedDocId != null
        ? documents.filter((doc) => doc.id === selectedDocId)
        : docsForCategory;
    const tags = new Set<string>();
    sourceDocs.forEach((doc) => {
      doc.tags?.forEach((tag) => tags.add(tag));
    });
    return Array.from(tags).sort((a, b) => formatLabel(a).localeCompare(formatLabel(b)));
  }, [documents, docsForCategory, selectedDocId]);

  const handleCategoryChange = useCallback((value: string) => {
    setSelectedCategory(value);
    setSelectedDocId(undefined);
    setSelectedEvent(undefined);
  }, []);

  const handleDocChange = useCallback((value: string) => {
    setSelectedDocId(value);
    setSelectedEvent(undefined);
  }, []);

  const handleEventChange = useCallback((value: string) => {
    if (value === '__none__') {
      setSelectedEvent(undefined);
      return;
    }
    setSelectedEvent(value);
  }, []);

  const isSubmitDisabled = isLoading || !selectedDocId;

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!selectedDocId) return;
      const slug = resolveDocSlug(selectedDocId);
      track('hero_document_builder_start', {
        locale,
        category: selectedCategory ?? null,
        docId: selectedDocId,
        event: selectedEvent ?? null,
      });
      router.push(`/${locale}/docs/${slug}`);
    },
    [locale, router, selectedCategory, selectedDocId, selectedEvent],
  );

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-slate-100 bg-white p-6 shadow-xl shadow-slate-200/70 backdrop-blur-sm md:p-8"
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-blue-600">
            {t('home.hero2.builder.overline', { defaultValue: 'Document Builder' })}
          </p>
          <h3 className="text-2xl font-semibold text-slate-900">
            {t('home.hero2.builder.title', { defaultValue: 'Create Your Document' })}
          </h3>
        </div>
        <div className="space-y-5">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              <span className="text-blue-500">1.</span>{' '}
              {t('home.hero2.builder.step1', { defaultValue: 'What type of document do you need?' })}
            </p>
            <Select
              value={selectedCategory ?? undefined}
              onValueChange={handleCategoryChange}
              disabled={isLoading || !categories.length}
            >
              <SelectTrigger className="h-12 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40">
                <SelectValue
                  placeholder={t('home.hero2.builder.step1Placeholder', { defaultValue: 'Select a category' })}
                />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              <span className="text-blue-500">2.</span>{' '}
              {t('home.hero2.builder.step2', { defaultValue: 'What is the specific document?' })}
            </p>
            <Select
              value={selectedDocId ?? undefined}
              onValueChange={handleDocChange}
              disabled={isLoading || !docsForCategory.length}
            >
              <SelectTrigger className="h-12 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40">
                <SelectValue
                  placeholder={t('home.hero2.builder.step2Placeholder', { defaultValue: 'e.g. NDA, Lease Agreement, Will...' })}
                />
              </SelectTrigger>
              <SelectContent>
                {docsForCategory.map((doc) => (
                  <SelectItem key={doc.id} value={doc.id}>
                    {getDocName(doc)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              <span className="text-blue-500">3.</span>{' '}
              {t('home.hero2.builder.step3', { defaultValue: 'Primary purpose or life event' })}
            </p>
            <Select
              value={selectedEvent ?? undefined}
              onValueChange={handleEventChange}
              disabled={isLoading || !lifeEventOptions.length}
            >
              <SelectTrigger className="h-12 rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40">
                <SelectValue
                  placeholder={t('home.hero2.builder.step3Placeholder', { defaultValue: 'Select an event (optional)' })}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__none__">
                  {t('home.hero2.builder.step3None', { defaultValue: 'No specific event' })}
                </SelectItem>
                {lifeEventOptions.map((eventOption) => (
                  <SelectItem key={eventOption} value={eventOption}>
                    {formatLabel(eventOption)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button
          type="submit"
          disabled={isSubmitDisabled}
          className="h-12 rounded-2xl bg-blue-600 text-base font-semibold text-white shadow-lg shadow-blue-300/50 transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-blue-300"
        >
          {isLoading
            ? t('home.hero2.builder.loading', { defaultValue: 'Loading...' })
            : t('home.hero2.builder.submit', { defaultValue: 'Start Generation' })}
        </Button>
      </div>
    </form>
  );
});

export default function HomePageClient({
  locale,
  popularDocs,
}: HomePageClientProps) {
  const { t } = useTranslation('common');
  const router = useRouter();

  // Removed selectedDocument to avoid importing the full document library on client




  return (
    <>
      {/* HERO SECTION */}
      <section className="bg-white pt-12 pb-16 lg:pt-20">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-12 px-4 lg:flex-row lg:items-start lg:gap-16">
          <div className="w-full max-w-xl space-y-6 lg:space-y-8">
            <div className="space-y-4">
              <h1 className="text-[40px] font-semibold tracking-tight text-[#111827] sm:text-[46px] lg:text-[52px] lg:leading-[1.08] antialiased">
                {t('home.hero2.heading.main', { defaultValue: 'Legal Documents Made' })}{' '}
                <span className="font-bold text-[#2563EB]">
                  {t('home.hero2.heading.highlight', { defaultValue: 'Easy.' })}
                </span>
              </h1>
              <p className="mt-3 text-[17px] font-medium leading-7 text-[#6A7689] sm:text-lg">
                {t('home.hero2.subtitle', {
                  defaultValue:
                    'Avoid costly lawyers and complex processes. Our AI platform guides you through creating legally sound documents with ease.',
                })}
              </p>
            </div>
            <HeroDocumentBuilder locale={locale} />
            <div className="grid w-full grid-cols-2 gap-6 pt-6 sm:grid-cols-4">
              {HERO_TRUST_ITEMS.map(({ icon: Icon, key }) => (
                <div
                  key={key}
                  className="flex flex-col items-center text-center sm:items-start sm:text-left"
                >
                  <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-blue-50 text-blue-600 shadow-sm">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <p className="text-sm font-medium text-slate-600">
                    {t(key)}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <div className="relative w-full max-w-[560px]">
            <div
              className="absolute -top-12 right-10 hidden h-40 w-40 rounded-full bg-blue-100 blur-3xl lg:block"
              aria-hidden="true"
            />
            <div
              className="absolute -bottom-10 left-0 hidden h-48 w-48 rounded-full bg-emerald-100 blur-3xl lg:block"
              aria-hidden="true"
            />
            <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-br from-white via-white to-slate-50 p-4 shadow-2xl shadow-blue-200/40 ring-1 ring-slate-100">
              <AutoImage
                src={
                  locale === 'es'
                    ? '/images/hero-main-es.png'
                    : '/images/hero-main.png'
                }
                alt={t('home.hero2.imageAlt', {
                  defaultValue: 'Professional reviewing a legal document on a tablet',
                })}
                width={1536}
                height={1024}
                className="h-full w-full rounded-[24px] object-cover"
                priority
              />
              <div className="absolute bottom-6 left-6 right-6 rounded-2xl bg-white/90 p-6 shadow-lg shadow-slate-200/80 backdrop-blur">
                <div className="mb-3 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 shadow-sm">
                    <FileText className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <h4 className="text-base font-semibold text-slate-900">
                    {t('home.hero2.preview.title', { defaultValue: 'Vehicle Bill of Sale' })}
                  </h4>
                </div>
                <ul className="space-y-2 text-sm text-slate-600">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" aria-hidden="true" />
                    <span>
                      {t('home.hero2.preview.bullet1', {
                        defaultValue: 'Legally Sound & State-Specific',
                      })}
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" aria-hidden="true" />
                    <span>
                      {t('home.hero2.preview.bullet2', {
                        defaultValue: 'Quick & Easy Customization',
                      })}
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" aria-hidden="true" />
                    <span>
                      {t('home.hero2.preview.bullet3', {
                        defaultValue: 'Instant Download & Secure',
                      })}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* "Generate and Personalize Legal Forms" section (formerly "How It Works") */}
      <div className="cv-auto">
        <HowItWorks />
      </div>

      {/* Popular Documents by Category */}
      <div className="cv-auto">
        <TopDocsChips locale={locale} initialDocs={popularDocs} />
      </div>


      {/* "Trust and Testimonials" section */}
      <div className="cv-auto">
        <TrustAndTestimonialsSection />
      </div>

      <Separator className="my-12" />

      {/* The "What do you want to accomplish?" section and its contents have been removed. */}
      {/* The PersonalizationBlock that was inside it is also removed. If it's needed elsewhere, it can be re-added. */}
    </>
  );
}
