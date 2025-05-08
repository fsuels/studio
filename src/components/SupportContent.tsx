// src/components/SupportContent.tsx
'use client'

import { useTranslation } from 'react-i18next'
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Clock, HelpCircle, LifeBuoy } from 'lucide-react';
import React, { useEffect, useState } from 'react'; // Import useState

interface SupportContentProps {
  locale: 'en' | 'es'; 
}

export default function SupportContent({ locale }: SupportContentProps) {
  const { t, i18n } = useTranslation();
  const [isHydrated, setIsHydrated] = useState(false); // For hydration check

  useEffect(() => {
    setIsHydrated(true);
    // Ensure i18n instance uses the locale passed from the parent page.
    // This is important if SupportContent is used directly elsewhere or if parent page logic changes.
    if (i18n.language !== locale) {
      i18n.changeLanguage(locale);
    }
  }, [locale, i18n]);

  if (!isHydrated) {
    // Placeholder while waiting for client-side hydration
    return (
      <main className="max-w-4xl mx-auto px-6 py-20 animate-pulse">
        <div className="h-10 bg-muted rounded w-3/4 mx-auto mb-6"></div>
        <div className="h-6 bg-muted rounded w-1/2 mx-auto mb-12"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-muted rounded-xl h-40"></div>
          <div className="bg-muted rounded-xl h-40"></div>
        </div>
        <div className="mt-16 bg-muted/50 p-6 rounded-lg h-20"></div>
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-6 py-20">
      <h1 className="text-4xl font-bold text-center mb-6 text-foreground">{t('support.title')}</h1>
      <p className="text-lg text-muted-foreground text-center mb-12">{t('support.subtitle')}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="shadow-lg rounded-xl bg-card border border-border">
          <CardHeader>
             <div className="flex items-center space-x-2">
                 <Mail className="h-6 w-6 text-primary" />
                 <CardTitle className="text-xl font-semibold text-card-foreground">{t('support.contact.title')}</CardTitle>
             </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-muted-foreground text-sm flex items-center gap-2">
                <Mail className="h-4 w-4" /> support@123legaldoc.com
            </p>
            <p className="text-muted-foreground text-sm flex items-center gap-2">
                <Clock className="h-4 w-4" /> {t('support.contact.hours')}
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-lg rounded-xl bg-card border border-border">
           <CardHeader>
             <div className="flex items-center space-x-2">
                <LifeBuoy className="h-6 w-6 text-primary" />
                <CardTitle className="text-xl font-semibold text-card-foreground">{t('support.help.title')}</CardTitle>
             </div>
          </CardHeader>
          <CardContent>
            <ul className="text-sm text-muted-foreground list-none space-y-2">
              <li className="flex items-center gap-2"><HelpCircle className="h-4 w-4 text-primary/70" /> {t('support.help.item1')}</li>
              <li className="flex items-center gap-2"><HelpCircle className="h-4 w-4 text-primary/70" /> {t('support.help.item2')}</li>
              <li className="flex items-center gap-2"><HelpCircle className="h-4 w-4 text-primary/70" /> {t('support.help.item3')}</li>
              <li className="flex items-center gap-2"><HelpCircle className="h-4 w-4 text-primary/70" /> {t('support.help.item4')}</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="mt-16 text-center bg-secondary/50 p-6 rounded-lg border border-border">
        <p className="text-sm text-muted-foreground mb-3">
          📌 {t('support.note')}
        </p>
        <Link
          href={`/${locale}/faq`} 
          className="inline-block text-primary hover:underline text-sm font-medium"
        >
          {t('support.cta')} →
        </Link>
      </div>
    </main>
  )
}
