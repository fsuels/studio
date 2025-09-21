// src/components/global/LanguageSwitch.tsx
'use client';

import React, { useEffect, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useCurrentSearchParams } from '@/hooks/useCurrentSearchParams';
import { useTranslation } from 'react-i18next';
import { Languages } from 'lucide-react';
import { toast } from 'sonner';

interface LanguageSwitchProps {
  currentLocale: 'en' | 'es';
  showToast?: boolean;
}

const availableLocales: Array<'en' | 'es'> = ['en', 'es'];
const localeNames: Record<'en' | 'es', string> = {
  en: 'English',
  es: 'Español',
};

export default function LanguageSwitch({ currentLocale, showToast = true }: LanguageSwitchProps) {
  const router = useRouter();
  const pathname = usePathname() ?? '';
  const searchParams = useCurrentSearchParams();
  const { t } = useTranslation('common');

  const switchLanguage = useCallback(
    (targetLocale?: 'en' | 'es') => {
      const newLocale = targetLocale || (currentLocale === 'en' ? 'es' : 'en');

      if (newLocale === currentLocale) {
        if (showToast) {
          toast.info(
            t('Language already selected', {
              defaultValue: `Already using ${localeNames[currentLocale]}`,
            }),
          );
        }
        return;
      }

      let newPath = pathname.startsWith(`/${currentLocale}`)
        ? pathname.replace(`/${currentLocale}`, `/${newLocale}`)
        : `/${newLocale}${pathname === '/' ? '' : pathname}`;

      const query = searchParams ? searchParams.toString() : '';
      if (query) newPath += `?${query}`;

      if (showToast) {
        toast.success(
          t('Language switched', {
            defaultValue: `Switched to ${localeNames[newLocale]}`,
          }),
          { icon: <Languages className="h-4 w-4" />, duration: 2000 },
        );
      }

      router.push(newPath);
    },
    [currentLocale, pathname, searchParams, router, t, showToast],
  );

  // Handle ⌘/Ctrl + L keyboard shortcut for language switching
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'l' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        switchLanguage();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [switchLanguage]);

  return null;
}

export function useLanguageSwitch(currentLocale: 'en' | 'es') {
  const router = useRouter();
  const pathname = usePathname() ?? '';
  const searchParams = useCurrentSearchParams();
  const { t } = useTranslation('common');

  const switchLanguage = useCallback(
    (targetLocale?: 'en' | 'es', showToast = true) => {
      const newLocale = targetLocale || (currentLocale === 'en' ? 'es' : 'en');

      if (newLocale === currentLocale) {
        if (showToast) {
          toast.info(
            t('Language already selected', {
              defaultValue: `Already using ${localeNames[currentLocale]}`,
            }),
          );
        }
        return;
      }

      let newPath = pathname.startsWith(`/${currentLocale}`)
        ? pathname.replace(`/${currentLocale}`, `/${newLocale}`)
        : `/${newLocale}${pathname === '/' ? '' : pathname}`;

      const query = searchParams ? searchParams.toString() : '';
      if (query) newPath += `?${query}`;

      if (showToast) {
        toast.success(
          t('Language switched', {
            defaultValue: `Switched to ${localeNames[newLocale]}`,
          }),
          { icon: <Languages className="h-4 w-4" />, duration: 2000 },
        );
      }

      router.push(newPath);
    },
    [currentLocale, pathname, searchParams, router, t],
  );

  return {
    switchLanguage,
    currentLocale,
    availableLocales,
    localeNames,
    nextLocale: currentLocale === 'en' ? 'es' : 'en',
  };
}

