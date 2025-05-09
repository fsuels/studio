// src/components/LanguageSwitcher.tsx
'use client';

import { usePathname, useSearchParams, useRouter, useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Check, ChevronDown } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Inline SVG Flags
const FlagUS = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="14" viewBox="0 0 750 500" className="w-5 h-auto mr-2 rounded-sm">
    <rect width="750" height="500" fill="#fff"/>
    <path fill="#b22234" d="M0 0h750v38.46H0zm0 76.92h750v38.46H0zm0 76.92h750v38.46H0zm0 76.93h750v38.46H0zm0 76.92h750v38.46H0zm0 76.92h750v38.46H0zm0 76.93h750v38.46H0z"/>
    <path fill="#3c3b6e" d="M0 0h300v269.23H0z"/>
    <path fill="#fff" d="m60 19.23 6.18 19-16.18-11.74h19.99L53.82 38.23zm60 0 6.18 19-16.18-11.74h19.99L113.82 38.23zm60 0 6.18 19-16.18-11.74h19.99L173.82 38.23zm60 0 6.18 19-16.18-11.74h19.99L233.82 38.23zm-180 38.46 6.18 19-16.18-11.74h19.99L53.82 76.69zm60 0 6.18 19-16.18-11.74h19.99L113.82 76.69zm60 0 6.18 19-16.18-11.74h19.99L173.82 76.69zm60 0 6.18 19-16.18-11.74h19.99L233.82 76.69zm-150 38.46 6.18 19-16.18-11.74h19.99L83.82 115.15zm60 0 6.18 19-16.18-11.74h19.99L143.82 115.15zm60 0 6.18 19-16.18-11.74h19.99L203.82 115.15zm-180 38.46 6.18 19-16.18-11.74h19.99L53.82 153.61zm60 0 6.18 19-16.18-11.74h19.99L113.82 153.61zm60 0 6.18 19-16.18-11.74h19.99L173.82 153.61zm60 0 6.18 19-16.18-11.74h19.99L233.82 153.61zm-150 38.46 6.18 19-16.18-11.74h19.99L83.82 192.07zm60 0 6.18 19-16.18-11.74h19.99L143.82 192.07zm60 0 6.18 19-16.18-11.74h19.99L203.82 192.07zm-180 38.46 6.18 19-16.18-11.74h19.99L53.82 230.53zm60 0 6.18 19-16.18-11.74h19.99L113.82 230.53zm60 0 6.18 19-16.18-11.74h19.99L173.82 230.53zm60 0 6.18 19-16.18-11.74h19.99L233.82 230.53z"/>
  </svg>
);

const FlagES = () => (
   <svg xmlns="http://www.w3.org/2000/svg" width="20" height="14" viewBox="0 0 750 500" className="w-5 h-auto mr-2 rounded-sm">
      <rect width="750" height="500" fill="#c60b1e"/>
      <rect width="750" height="125" y="125" fill="#ffc400"/>
      <g transform="translate(206.25 212.5) scale(7.5)">
         <g fill="#fff">
            <path d="M7 0h1v13H7zM9 0h1v13H9z"/>
            <path d="M10 13v1h3v-1zm-6 0v1h3v-1z"/>
         </g>
         <path d="M7 15h2v2H7zM7 17h2v1H7zM9 17H7v1h2zm0 1H7v1h2z" fill="#c60b1e"/>
         <path d="M10.14 13.48a.15.15 0 0 0-.14-.15H6a.15.15 0 0 0-.14.15L5.1 15.91c-.07.2.07.4.29.4h.32c.1 0 .18-.05.22-.13L6 15.8h4l.07.38c.04.08.12.13.22.13h.32c.22 0 .36-.2.29-.4z" fill="#ffc400"/>
         <path d="M10 13h.8a.15.15 0 0 0 .15-.15V0h-2v12.85c0 .08.06.15.15.15zM6 13h.8c.09 0 .15-.07.15-.15V0H5v12.85c0 .08.07.15.15.15z" fill="#ad1519"/>
         <path d="M7 13h2v1H7z" fill="#ffc400"/>
         <g fill="#006a44">
            <path d="M13 13v-1h.15c.2 0 .35-.15.35-.35V9h1v3h1v1zm-10 0v-1h-.15c-.2 0-.35-.15-.35-.35V9H2v3H1v1z"/>
            <circle cx="7.5" cy="3.5" r="2"/>
            <circle cx="7.5" cy="9.5" r="2"/>
         </g>
         <g fill="#75aadb">
            <path d="M8.5 13v-1h.15c.2 0 .35-.15.35-.35V9h1v3h1v1z"/>
            <path d="M4.5 13v-1H4.35c-.2 0-.35-.15-.35-.35V9H5v3H6v1z"/>
         </g>
         <path d="M7.5 1c.38 0 .7.1.96.28.21.14.38.33.49.55.11.22.15.46.15.72 0 .26-.04.5.15.72-.11.22-.28.41-.49.55-.26.17-.58.28-.96.28s-.7-.1-.96-.28c-.21-.14-.38-.33-.49-.55-.11-.22-.15-.46-.15-.72 0 .26.04.5.15.72.11.22.28.41.49.55.26.17.58.28.96.28zm0 6c.38 0 .7.1.96.28.21.14.38.33.49.55.11.22.15.46.15.72 0 .26-.04.5.15.72-.11.22-.28.41-.49.55-.26.17-.58.28-.96.28s-.7-.1-.96-.28c-.21-.14-.38-.33-.49-.55-.11-.22-.15-.46-.15-.72 0 .26.04.5.15.72.11.22.28.41.49.55.26.17.58.28.96.28z" fill="#fff"/>
         <path d="M7.5 7C8.08 7 8.4.6 8.4 1.2V5.8C8.4 6.4 8.08 7 7.5 7S6.6 6.4 6.6 5.8V1.2C6.6.6 6.92 0 7.5 0c.58 0 .9.6.9 1.2z" fill="#ad1519"/>
         <path d="M7.5 13c.58 0 .9-.6.9-1.2V7.8c0-.6-.32-1.2-.9-1.2s-.9.6-.9 1.2v4c0 .6.32 1.2.9 1.2z" fill="#75aadb"/>
         <path d="M9.03 5.5H5.97c-.48 0-.78-.27-.78-.6 0-.33.3-.6.78-.6h3.06c.48 0 .78.27.78.6 0 .33-.3.6-.78.6z" fill="#ffc400"/>
      </g>
   </svg>
);

const availableLocales: Array<'en' | 'es'> = ['en', 'es'];

export function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const params = useParams();
  const { i18n, t } = useTranslation();
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);

  // This state will reflect the locale from the URL, updated after navigation
  const [currentRouteLocale, setCurrentRouteLocale] = useState<'en' | 'es'>('en');

  useEffect(() => {
    const pathLocale = params.locale as 'en' | 'es' | undefined;
    if (pathLocale && availableLocales.includes(pathLocale)) {
      setCurrentRouteLocale(pathLocale);
      if (i18n.language !== pathLocale) {
        i18n.changeLanguage(pathLocale);
      }
    } else if (pathname === '/') { // Handle root path redirection case
        setCurrentRouteLocale('en'); // Default to 'en' for root
        if (i18n.language !== 'en') {
            i18n.changeLanguage('en');
        }
    }
  }, [params.locale, i18n, pathname]);

  const handleLocaleChange = (newLocaleTarget: 'en' | 'es') => {
    if (currentRouteLocale === newLocaleTarget) {
      setIsPopoverOpen(false);
      return;
    }

    // Optimistically update i18n instance for immediate text changes
    i18n.changeLanguage(newLocaleTarget);

    // Construct the new path
    // If current pathname is just '/' (root), then new path is just /en or /es
    // Otherwise, replace the current locale segment
    const newPath = pathname === '/' 
      ? `/${newLocaleTarget}`
      : pathname.replace(/^\/(en|es)/, `/${newLocaleTarget}`);

    const queryString = searchParams.toString();
    const finalUrl = queryString ? `${newPath}?${queryString}` : newPath;
    
    router.push(finalUrl);
    // router.refresh() will be implicitly handled by Next.js navigation for App Router
    // but explicit refresh can ensure server components update if needed.
    // For purely client-side translation updates via i18next, router.refresh() might be too heavy.
    // Let's rely on Next.js navigation and the useEffect hook to update currentRouteLocale
    // and re-render based on i18n.language changes.
    // If server components are not updating, router.refresh() can be added back.
    // router.refresh(); 

    setIsPopoverOpen(false);
  };
  
  // Use i18n.language for the displayed flag/text as it updates immediately
  const displayLanguage = i18n.language as 'en' | 'es';

  return (
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="text-xs font-medium text-foreground/80 hover:bg-foreground/5 hover:text-foreground px-2 py-1.5 md:px-3 border-border/50 shadow-sm flex items-center"
          aria-label={t('Select language', {defaultValue: 'Select language'})}
        >
          {displayLanguage === 'en' ? <FlagUS /> : <FlagES />}
          <span className="hidden sm:inline">{displayLanguage.toUpperCase()}</span>
          <ChevronDown className="ml-1 h-4 w-4 opacity-70" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="min-w-[8rem] p-1 z-[70]">
            {availableLocales.map(lang => (
                 <Button
                    key={lang}
                    variant={displayLanguage === lang ? 'secondary' : 'ghost'}
                    className="w-full justify-start text-xs"
                    onClick={() => handleLocaleChange(lang)}
                >
                    <span className="flex items-center w-full">
                        {lang === 'en' ? <FlagUS /> : <FlagES />}
                        {lang === 'en' ? 'English' : 'Español'}
                        {displayLanguage === lang && <Check className="ml-auto h-4 w-4" />}
                    </span>
                </Button>
            ))}
      </PopoverContent>
    </Popover>
  );
}

    