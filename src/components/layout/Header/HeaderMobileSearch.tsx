// src/components/layout/Header/HeaderMobileSearch.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Search as SearchIcon, X as CloseIcon, ArrowUpRight, Sparkles } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { MobileNavigation } from '@/components/ui/MobileNavigation';
import SmartHeaderSearch from './SmartHeaderSearch';
import { resolveDocSlug } from '@/lib/slug-alias';
import { cn } from '@/lib/utils';

interface HeaderMobileSearchProps {
  clientLocale: 'en' | 'es';
  mounted: boolean;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const QUICK_LINK_KEYS = [
  { key: 'vehicleBillOfSale', slug: 'vehicle-bill-of-sale' },
  { key: 'llcOperatingAgreement', slug: 'llc-operating-agreement' },
  { key: 'mutualNDA', slug: 'mutual-non-disclosure-agreement' },
];

export default function HeaderMobileSearch({
  clientLocale,
  mounted,
  isOpen,
  onOpen,
  onClose,
}: HeaderMobileSearchProps) {
  const { t: tHeader } = useTranslation('header');
  const openLabel = tHeader('nav.openSearch', {
    defaultValue: 'Open search',
  });
  const closeLabel = tHeader('nav.closeSearch', {
    defaultValue: 'Close search',
  });

  React.useEffect(() => {
    if (!isOpen) return;

    const timeout = window.setTimeout(() => {
      const input = document.getElementById('enhanced-header-search') as HTMLInputElement | null;
      input?.focus();
    }, 200);

    return () => window.clearTimeout(timeout);
  }, [isOpen]);

  const quickTitle = tHeader('mobileSearch.quickLinks.title', {
    defaultValue: 'Popular shortcuts',
  });

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="h-12 w-12 rounded-xl border border-slate-300/70 bg-white/95 text-slate-900 shadow-md shadow-sky-100/60 backdrop-blur hover:border-primary/40 hover:text-primary focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary"
        onClick={onOpen}
        aria-label={openLabel}
        disabled={!mounted}
      >
        <SearchIcon className="h-5 w-5" />
      </Button>

      <MobileNavigation
        isOpen={isOpen}
        onClose={onClose}
        slideDirection="right"
        className="md:hidden"
      >
        <div className="flex h-full flex-col bg-gradient-to-b from-slate-50 via-white to-white">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200/70 bg-white/95 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-inner">
                <Sparkles className="h-4 w-4" />
              </span>
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  {tHeader('mobileSearch.title', {
                    defaultValue: 'Search legal templates',
                  })}
                </p>
                <p className="text-xs text-slate-500">
                  {tHeader('mobileSearch.subtitle', {
                    defaultValue: 'Find the right document in seconds.',
                  })}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              aria-label={closeLabel}
              className="h-11 w-11 rounded-xl border border-slate-200 bg-white/90 text-slate-700 shadow-sm hover:bg-slate-100"
            >
              <CloseIcon className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-6 space-y-6">
            {isOpen && (
              <div className="rounded-3xl border border-slate-200/80 bg-white/80 p-4 shadow-lg shadow-sky-100/50 backdrop-blur-sm">
                <SmartHeaderSearch
                  clientLocale={clientLocale}
                  mounted={mounted}
                  className="relative w-full"
                  autoFocus
                />
              </div>
            )}

            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                {quickTitle}
              </p>
              <div className="grid grid-cols-1 gap-3">
                {QUICK_LINK_KEYS.map(({ key, slug }) => {
                  const label = tHeader(`mobileSearch.quickLinks.${key}`, {
                    defaultValue: key,
                  });
                  const resolvedSlug = resolveDocSlug(slug);
                  return (
                    <Link
                      key={key}
                      href={`/${clientLocale}/docs/${resolvedSlug}/start`}
                      className={cn(
                        'group flex items-center justify-between rounded-2xl border border-slate-200/80 bg-white px-4 py-3 shadow-sm transition-all',
                        'hover:border-primary/50 hover:bg-primary/5 hover:shadow-md'
                      )}
                      onClick={onClose}
                    >
                      <span className="text-sm font-medium text-slate-900 group-hover:text-primary">
                        {label}
                      </span>
                      <ArrowUpRight className="h-4 w-4 text-slate-400 group-hover:text-primary" />
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </MobileNavigation>
    </>
  );
}
