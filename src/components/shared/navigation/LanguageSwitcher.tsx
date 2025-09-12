// src/components/LanguageSwitcher.tsx
'use client';

import {
  usePathname,
  useSearchParams,
  useRouter,
  useParams,
} from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Check, ChevronDown } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { getDirAttribute } from '@/lib/rtl-utils';

// Placeholder FlagUS Component - Replace with your actual SVG component
const FlagUS = () => (
  <svg
    width="20"
    height="15"
    viewBox="0 0 20 15"
    className="mr-2 rounded-sm"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="20" height="15" fill="#E0E0E0" />
    <path d="M0 0H20V3H0V0Z" fill="#D32F2F" />
    <path d="M0 6H20V9H0V6Z" fill="#D32F2F" />
    <path d="M0 12H20V15H0V12Z" fill="#D32F2F" />
    <path d="M0 0H9V9H0V0Z" fill="#1976D2" />
    {/* Simplified stars - add more detail for actual flag */}
    <circle cx="2.5" cy="2.5" r="0.5" fill="white" />
    <circle cx="6.5" cy="2.5" r="0.5" fill="white" />
    <circle cx="4.5" cy="4.5" r="0.5" fill="white" />
    <circle cx="2.5" cy="6.5" r="0.5" fill="white" />
    <circle cx="6.5" cy="6.5" r="0.5" fill="white" />
  </svg>
);

// Placeholder FlagES Component - Replace with your actual SVG component
const FlagES = () => (
  <svg
    width="20"
    height="15"
    viewBox="0 0 20 15"
    className="mr-2 rounded-sm"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect width="20" height="15" fill="#C60B1E" />
    <rect y="3.75" width="20" height="7.5" fill="#FFC400" />
    {/* Simplified coat of arms representation */}
    <rect x="5" y="5.5" width="3" height="4" fill="#AD1519" />
  </svg>
);

const availableLocales: Array<'en' | 'es'> = ['en', 'es'];

const LanguageSwitcher = React.memo(function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname() ?? '';
  const searchParams = useSearchParams();
  const params = (useParams<{ locale?: string }>() ?? {}) as {
    locale?: string;
  };
  const { t } = useTranslation('common');
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [currentRouteLocale, setCurrentRouteLocale] = useState<'en' | 'es'>(
    'en',
  );
  const [isHydrated, setIsHydrated] = useState(false);

  // Determine locale from the URL param on mount
  useEffect(() => {
    setIsHydrated(true);
    const pathLocale = params.locale as 'en' | 'es' | undefined;
    if (pathLocale && availableLocales.includes(pathLocale)) {
      setCurrentRouteLocale(pathLocale);
    } else if (pathname === '/') {
      setCurrentRouteLocale('en');
    }
  }, [params.locale, pathname]);

  // Update document attributes when locale changes
  useEffect(() => {
    if (isHydrated && currentRouteLocale) {
      const dir = getDirAttribute(currentRouteLocale);
      document.documentElement.setAttribute('dir', dir);
      document.documentElement.setAttribute('lang', currentRouteLocale);
    }
  }, [currentRouteLocale, isHydrated]);

  const handleLocaleChange = (newLocale: 'en' | 'es') => {
    if (newLocale === currentRouteLocale) {
      setIsPopoverOpen(false);
      return;
    }

    // Update document direction attribute
    const newDir = getDirAttribute(newLocale);
    document.documentElement.setAttribute('dir', newDir);
    document.documentElement.setAttribute('lang', newLocale);

    // swap the locale prefix in the path
    let newPath = pathname.startsWith(`/${currentRouteLocale}`)
      ? pathname.replace(`/${currentRouteLocale}`, `/${newLocale}`)
      : `/${newLocale}${pathname === '/' ? '' : pathname}`;

    const query = searchParams ? searchParams.toString() : '';
    if (query) newPath += `?${query}`;

    router.push(newPath);
    setIsPopoverOpen(false);
  };

  const displayLang = isHydrated ? currentRouteLocale : 'en';

  if (!isHydrated) {
    return <div className="h-9 w-20 bg-muted rounded-md animate-pulse" />;
  }

  return (
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn(
            'text-xs font-medium text-foreground/80 hover:bg-foreground/5 hover:text-foreground px-2 py-1.5 md:px-3 border-border/50 shadow-sm flex items-center',
            isPopoverOpen && 'bg-muted',
          )}
          aria-label={t('Select language')}
        >
          {displayLang === 'en' ? <FlagUS /> : <FlagES />}
          <span className="hidden sm:inline">{displayLang.toUpperCase()}</span>
          <ChevronDown className="ml-1 h-4 w-4 opacity-70 shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="min-w-[8rem] p-1 z-[70] bg-popover border-border shadow-xl rounded-lg"
      >
        {availableLocales.map((lang) => (
          <Button
            key={lang}
            variant={displayLang === lang ? 'secondary' : 'ghost'}
            className="w-full justify-start text-xs h-8 px-2"
            onClick={() => handleLocaleChange(lang)}
          >
            <span className="flex items-center w-full">
              {lang === 'en' ? <FlagUS /> : <FlagES />}
              {lang === 'en' ? 'English' : 'Español'}
              {displayLang === lang && <Check className="ml-auto h-4 w-4" />}
            </span>
          </Button>
        ))}
      </PopoverContent>
    </Popover>
  );
});

export default LanguageSwitcher;
