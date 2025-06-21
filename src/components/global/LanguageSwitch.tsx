// src/components/global/LanguageSwitch.tsx
'use client';

import React, { useEffect, useCallback } from 'react';
import { useRouter, usePathname, useSearchParams, useParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { Languages } from 'lucide-react';
import { toast } from 'sonner';

interface LanguageSwitchProps {
  /** Current locale from the URL */
  currentLocale: 'en' | 'es';
  /** Whether to show the toast notification */
  showToast?: boolean;
}

const availableLocales: Array<'en' | 'es'> = ['en', 'es'];
const localeNames = {
  en: 'English',
  es: 'Español'
};

export default function LanguageSwitch({ 
  currentLocale, 
  showToast = true 
}: LanguageSwitchProps) {
  const router = useRouter();
  const pathname = usePathname() ?? '';
  const searchParams = useSearchParams();
  const { t } = useTranslation('common');

  const switchLanguage = useCallback((targetLocale?: 'en' | 'es') => {
    // If no target locale specified, cycle to the next one
    const newLocale = targetLocale || (currentLocale === 'en' ? 'es' : 'en');
    
    if (newLocale === currentLocale) {
      if (showToast) {
        toast.info(t('Language already selected', { 
          defaultValue: `Already using ${localeNames[currentLocale]}` 
        }));
      }
      return;
    }

    // Build new path with swapped locale
    let newPath = pathname.startsWith(`/${currentLocale}`)
      ? pathname.replace(`/${currentLocale}`, `/${newLocale}`)
      : `/${newLocale}${pathname === '/' ? '' : pathname}`;

    // Preserve query parameters
    const query = searchParams ? searchParams.toString() : '';
    if (query) newPath += `?${query}`;

    // Show toast notification
    if (showToast) {
      toast.success(t('Language switched', { 
        defaultValue: `Switched to ${localeNames[newLocale]}` 
      }), {
        icon: <Languages className="h-4 w-4" />,
        duration: 2000,
      });
    }

    // Navigate to new locale
    router.push(newPath);
  }, [currentLocale, pathname, searchParams, router, t, showToast]);

  // Handle ⌘L keyboard shortcut for language switching
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // ⌘L (Mac) or Ctrl+L (Windows/Linux) to switch language
      if (e.key === 'l' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        switchLanguage();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [switchLanguage]);

  // Expose switch function for external use
  React.useImperativeHandle(React.createRef(), () => ({
    switchLanguage
  }));

  return null; // This is a headless component that only handles keyboard shortcuts
}

// Hook for using language switching functionality
export function useLanguageSwitch(currentLocale: 'en' | 'es') {
  const router = useRouter();
  const pathname = usePathname() ?? '';
  const searchParams = useSearchParams();
  const { t } = useTranslation('common');

  const switchLanguage = useCallback((targetLocale?: 'en' | 'es', showToast = true) => {
    const newLocale = targetLocale || (currentLocale === 'en' ? 'es' : 'en');
    
    if (newLocale === currentLocale) {
      if (showToast) {
        toast.info(t('Language already selected', { 
          defaultValue: `Already using ${localeNames[currentLocale]}` 
        }));
      }
      return;
    }

    let newPath = pathname.startsWith(`/${currentLocale}`)
      ? pathname.replace(`/${currentLocale}`, `/${newLocale}`)
      : `/${newLocale}${pathname === '/' ? '' : pathname}`;

    const query = searchParams ? searchParams.toString() : '';
    if (query) newPath += `?${query}`;

    if (showToast) {
      toast.success(t('Language switched', { 
        defaultValue: `Switched to ${localeNames[newLocale]}` 
      }), {
        icon: <Languages className="h-4 w-4" />,
        duration: 2000,
      });
    }

    router.push(newPath);
  }, [currentLocale, pathname, searchParams, router, t]);

  return {
    switchLanguage,
    currentLocale,
    availableLocales,
    localeNames,
    nextLocale: currentLocale === 'en' ? 'es' : 'en'
  };
}