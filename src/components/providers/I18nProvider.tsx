// src/components/providers/I18nProvider.tsx
"use client";

import React, { ReactNode, useEffect, useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18nInstance from '@/lib/i18n'; // Import the server-safe instance
import { initReactI18next } from 'react-i18next'; // Client-side import
import LanguageDetector from 'i18next-browser-languagedetector'; // Client-side import

interface I18nProviderProps {
  children: ReactNode;
  locale: 'en' | 'es';
}

let clientSidePluginsApplied = false;

const I18nClientProvider: React.FC<I18nProviderProps> = ({ children, locale }) => {
  const [isClientInitialized, setIsClientInitialized] = useState(clientSidePluginsApplied);

  useEffect(() => {
    // This effect runs only on the client
    if (!clientSidePluginsApplied) {
      i18nInstance
        .use(LanguageDetector)
        .use(initReactI18next)
        .init(
          {
            ...i18nInstance.options, // Keep existing server-safe options
            lng: locale, // Set initial language based on prop
            // Add React-specific and browser-specific options
            react: { useSuspense: false },
            detection: {
              order: ['querystring', 'cookie', 'localStorage', 'navigator', 'htmlTag', 'path', 'subdomain'],
              caches: ['localStorage', 'cookie'],
            },
            saveMissing: process.env.NODE_ENV === 'development',
          },
          (err) => { // Init callback
            if (err) {
              return console.error('Error initializing i18next for client with plugins:', err);
            }
            clientSidePluginsApplied = true;
            setIsClientInitialized(true);
            // Ensure language is correctly set after full client init
            if (i18nInstance.language !== locale) {
              i18nInstance.changeLanguage(locale);
            }
          }
        );
    } else {
      // If plugins are already applied, just ensure language syncs
      if (i18nInstance.language !== locale) {
        i18nInstance.changeLanguage(locale).then(() => {
          setIsClientInitialized(true); // Update state if language change was async
        }).catch(err => console.error("Error changing language on already initialized instance:", err));
      } else {
        setIsClientInitialized(true); // Already correct language and initialized
      }
    }
  }, [locale]);

  if (!isClientInitialized && typeof window !== 'undefined') {
    // Optional: Show a loader or null while client-side i18n is fully booting up
    // This might prevent rendering with partially configured i18n
    return null; 
  }

  return <I18nextProvider i18n={i18nInstance}>{children}</I18nextProvider>;
};

export default I18nClientProvider;
