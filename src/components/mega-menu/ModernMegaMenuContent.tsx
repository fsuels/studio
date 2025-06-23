'use client';

import React, { useState, useEffect, useRef, Fragment } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import {
  ChevronLeft,
  ChevronRight,
  Star,
  ExternalLink,
  Briefcase,
  Users,
  Home,
  DollarSign,
  Lightbulb,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

// Dynamic taxonomy config fetched at build/runtime
import MENU_CONFIG from '@/config/menu-config.json';

/** Skeleton loader during hydration or slow networks */
const MegaMenuSkeleton: React.FC = () => (
  <div className="animate-pulse p-6 bg-gray-100 dark:bg-gray-800 rounded-lg">
    <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/3 mb-4" />
    <div className="space-y-2">
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-4 bg-gray-300 dark:bg-gray-700 rounded" />
      ))}
    </div>
  </div>
);

/** Popover for document preview snippet */
const DocumentPreviewPopover: React.FC<{ slug: string }> = ({ slug }) => {
  // placeholder for real popover logic
  return null;
};

const ModernMegaMenuContent: React.FC<{ locale: string; onLinkClick?: () => void }> = ({ locale, onLinkClick }) => {
  const { t } = useTranslation('common');
  const { theme } = useTheme();
  const [hydrated, setHydrated] = useState(false);
  const [activeCat, setActiveCat] = useState<string>('');
  const [startIdx, setStartIdx] = useState(0);

  const visibleCount = 4;
  const cats = MENU_CONFIG.categories;
  useEffect(() => {
    setHydrated(true);
    setActiveCat(cats[0]?.id || '');
  }, [cats]);

  if (!hydrated || !activeCat) return <MegaMenuSkeleton />;

  const visibleCats = cats.slice(startIdx, Math.min(startIdx + visibleCount, cats.length));
  const category = cats.find(c => c.id === activeCat)!;

  return (
    <nav
      aria-label={t('Main document menu')}
      className="mega-menu relative bg-white dark:bg-gray-900 rounded-lg shadow-lg overflow-hidden"
      data-theme={theme}
    >
      <style jsx>{`
        @media print { .mega-menu { display: none; } }
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .mask-fade { mask-image: linear-gradient(90deg, transparent, black 20px, black calc(100% - 20px), transparent); }
      `}</style>

      {/* Skip link */}
      <a
        href="#mega-docs"
        className="sr-only focus:not-sr-only px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md"
      >
        {t('Skip to documents')}
      </a>

      {/* noscript fallback */}
      <noscript>
        <ul>
          {cats.map(cat => (
            <li key={cat.id}>
              <a href={`/${locale}/docs?category=${cat.id}`} className="font-semibold">
                {cat.name}
              </a>
              <ul>
                {cat.documents.slice(0, 5).map(doc => (
                  <li key={doc.slug}>
                    <a href={`/${locale}/docs/${doc.slug}`}>{doc.title}</a>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </noscript>

      {/* Tabs with chevrons */}
      <div className="relative mt-4">
        <button
          onClick={() => setStartIdx(i => Math.max(0, i - 1))}
          disabled={startIdx === 0}
          aria-label={t('Scroll categories left')}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 p-1 bg-white dark:bg-gray-900 rounded-full shadow focus:outline-none focus:ring-2 focus:ring-teal-300 disabled:opacity-50"
        >
          <ChevronLeft />
        </button>
        <div
          role="tablist"
          aria-label={t('Document categories')}
          className="flex overflow-x-scroll hide-scrollbar mask-fade px-12"
        >
          {visibleCats.map(cat => (
            <button
              key={cat.id}
              role="tab"
              aria-selected={activeCat === cat.id}
              onClick={() => setActiveCat(cat.id)}
              className={cn(
                'relative pb-2 px-4 whitespace-nowrap font-medium focus:outline-none focus:ring-2 focus:ring-teal-300 transition-colors dark:text-gray-200',
                activeCat === cat.id
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-700 hover:border-b-2 hover:border-blue-300'
              )}
              style={{ minWidth: 120 }}
            >
              {/* Icon + label */}
              <span className="inline-flex items-center gap-1">
                {cat.icon}
                {cat.name}
              </span>
            </button>
          ))}
        </div>
        <button
          onClick={() => setStartIdx(i => Math.min(cats.length - visibleCount, i + 1))}
          disabled={startIdx + visibleCount >= cats.length}
          aria-label={t('Scroll categories right')}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 p-1 bg-white dark:bg-gray-900 rounded-full shadow focus:outline-none focus:ring-2 focus:ring-teal-300 disabled:opacity-50"
        >
          <ChevronRight />
        </button>
      </div>

      {/* See All */}
      <div className="px-12 mt-2">
        <Link
          href={`/${locale}/docs?category=${category.id}`}
          onClick={onLinkClick}
          className="inline-flex items-center text-sm font-medium text-teal-600 hover:underline"
        >
          {t('See all')} {category.name} <ExternalLink className="ml-1 h-4 w-4" />
        </Link>
      </div>

      {/* Document panel */}
      <section
        id="mega-docs"
        role="region"
        aria-live="polite"
        className="grid grid-cols-1 md:grid-cols-4 gap-6 px-12 py-6"
      >
        {/* Thumbnail */}
        <div className="hidden md:flex md:col-span-1 items-center justify-center">
          <div className="bg-blue-50 dark:bg-blue-900 p-4 rounded-lg">
            {category.icon}
          </div>
        </div>

        {/* Documents */}
        <div className="col-span-1 md:col-span-3">
          <h2 className="text-blue-600 text-xl font-semibold mb-4">{t('Most Popular')}</h2>
          <ul role="menu" className="space-y-3">
            {category.documents.map((doc, i) => (
              <Fragment key={doc.slug}>
                <li role="none">
                  <Link
                    href={`/${locale}/docs/${doc.slug}`}
                    onClick={onLinkClick}
                    role="menuitem"
                    className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg hover:shadow-lg transform hover:-translate-y-1 transition focus:outline-none focus:ring-2 focus:ring-teal-300"
                  >
                    <div className="flex items-center gap-2">
                      {doc.popular && <Star className="h-5 w-5 text-blue-600" />}
                      <span
                        className={cn(
                          'leading-relaxed',
                          doc.popular ? 'text-lg font-semibold' : 'text-base text-gray-600 dark:text-gray-400'
                        )}
                      >
                        {doc.title}
                      </span>
                    </div>
                    <ExternalLink className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                  </Link>
                  <DocumentPreviewPopover slug={doc.slug} />
                </li>
                {i === 2 && <hr className="my-2 border-gray-200 dark:border-gray-700" />}
              </Fragment>
            ))}
          </ul>
        </div>
      </section>

      {/* Disclaimer */}
      <div className="px-12 pb-6">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {t('Disclaimer')}: {t('Please consult a qualified attorney in your jurisdiction before using any legal document.')}
        </p>
      </div>
    </nav>
  );
};

export default ModernMegaMenuContent;
