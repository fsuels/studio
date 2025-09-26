// src/components/LanguageSwitcher.tsx
'use client';

import { useCurrentSearchParams } from '@/hooks/useCurrentSearchParams';
import { usePathname, useRouter, useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Check, ChevronDown } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { getDirAttribute } from '@/lib/rtl-utils';
import i18nInstance, { ensureI18nInitialized } from '@/lib/i18n';

const availableLocales: Array<'en' | 'es'> = ['en', 'es'];
const COUNTRY_CODE = 'US';

interface LanguageSwitcherProps {
  size?: 'sm' | 'md';
  hideCaret?: boolean;
  onLocaleChangeStart?: (targetLocale: 'en' | 'es') => void;
}

const LanguageSwitcher = React.memo(function LanguageSwitcher({
  size = 'md',
  hideCaret = false,
  onLocaleChangeStart,
}: LanguageSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname() ?? '';
  const searchParams = useCurrentSearchParams();
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

  const handleLocaleChange = async (newLocale: 'en' | 'es') => {
    if (newLocale === currentRouteLocale) {
      setIsPopoverOpen(false);
      return;
    }

    onLocaleChangeStart?.(newLocale);

    try {
      await ensureI18nInitialized({ locale: newLocale, namespaces: ['common', 'header', 'footer'] });
      if (i18nInstance.language !== newLocale) {
        await i18nInstance.changeLanguage(newLocale);
      }
    } catch (error) {
      console.error('[LanguageSwitcher] Failed to sync language', error);
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

  const chipBaseStyles = size === 'sm'
    ? 'text-[11px] px-3 py-1.5'
    : 'text-sm px-4 py-2';

  if (!isHydrated) {
    return <div className={cn('bg-muted rounded-full animate-pulse', size === 'sm' ? 'h-8 w-20' : 'h-9 w-24')} />;
  }

  const triggerClassName = cn(
    'rounded-full font-semibold tracking-wide border-border/50 shadow-sm flex items-center gap-2',
    chipBaseStyles,
    isPopoverOpen && 'bg-muted',
  );

  return (
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      <PopoverTrigger asChild>
        <Button
          size={size === 'sm' ? 'sm' : 'default'}
          variant="outline"
          className={triggerClassName}
          aria-label={t('Select language')}
        >
          <span>{`${COUNTRY_CODE} · ${displayLang.toUpperCase()}`}</span>
          {!hideCaret && <ChevronDown className="ml-1 h-4 w-4 opacity-70 shrink-0" />}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="min-w-[8rem] p-1 z-[130] bg-popover border-border shadow-xl rounded-lg"
      >
        {availableLocales.map((lang) => (
          <Button
            key={lang}
            variant={displayLang === lang ? 'secondary' : 'ghost'}
            className="w-full justify-start text-xs h-8 px-2"
            onClick={() => handleLocaleChange(lang)}
          >
            <span className="flex items-center w-full gap-2">
              <span className="text-xs font-semibold">{`${COUNTRY_CODE} · ${lang.toUpperCase()}`}</span>
              <span className="text-[11px] text-muted-foreground">
                {lang === 'en' ? 'English' : 'Español'}
              </span>
              {displayLang === lang && <Check className="ml-auto h-4 w-4" />}
            </span>
          </Button>
        ))}
      </PopoverContent>
    </Popover>
  );
});

export default LanguageSwitcher;
