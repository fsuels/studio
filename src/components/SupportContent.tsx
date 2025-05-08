// src/components/SupportContent.tsx
'use client'

import { useTranslation } from 'react-i18next'
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Clock, HelpCircle, LifeBuoy } from 'lucide-react';
import React, { useEffect } from 'react'; // Added React and useEffect

interface SupportContentProps {
  locale: 'en' | 'es'; 
}

export default function SupportContent({ locale }: SupportContentProps) {
  const { t, i18n } = useTranslation();
  
  useEffect(() => {
    if (i18n.language !== locale) {
      i18n.changeLanguage(locale);
    }
  }, [locale, i18n]);

  return (
    <main className="max-w-4xl mx-auto px-6 py-20">
      <h1 className="text-4xl font-bold text-center mb-6 text-foreground">{t('support.title', 'Support Center')}</h1>
      <p className="text-lg text-muted-foreground text-center mb-12">{t('support.subtitle', 'Need help? Find resources or contact us below.')}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="shadow-lg rounded-xl bg-card border border-border">
          <CardHeader>
             <div className="flex items-center space-x-2">
                 <Mail className="h-6 w-6 text-primary" />
                 <CardTitle className="text-xl font-semibold text-card-foreground">{t('support.contact.title', 'Contact Us')}</CardTitle>
             </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-muted-foreground text-sm flex items-center gap-2">
                <Mail className="h-4 w-4" /> support@123legaldoc.com
            </p>
            <p className="text-muted-foreground text-sm flex items-center gap-2">
                <Clock className="h-4 w-4" /> {t('support.contact.hours', 'Available Mon-Fri, 9 AM - 5 PM EST')}
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-lg rounded-xl bg-card border border-border">
           <CardHeader>
             <div className="flex items-center space-x-2">
                <LifeBuoy className="h-6 w-6 text-primary" />
                <CardTitle className="text-xl font-semibold text-card-foreground">{t('support.help.title', 'Quick Help')}</CardTitle>
             </div>
          </CardHeader>
          <CardContent>
            <ul className="text-sm text-muted-foreground list-none space-y-2">
              <li className="flex items-center gap-2"><HelpCircle className="h-4 w-4 text-primary/70" /> {t('support.help.item1', 'How document generation works')}</li>
              <li className="flex items-center gap-2"><HelpCircle className="h-4 w-4 text-primary/70" /> {t('support.help.item2', 'Pricing and payment options')}</li>
              <li className="flex items-center gap-2"><HelpCircle className="h-4 w-4 text-primary/70" /> {t('support.help.item3', 'Troubleshooting common issues')}</li>
              <li className="flex items-center gap-2"><HelpCircle className="h-4 w-4 text-primary/70" /> {t('support.help.item4', 'Understanding your dashboard')}</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="mt-16 text-center bg-secondary/50 p-6 rounded-lg border border-border">
        <p className="text-sm text-muted-foreground mb-3">
          📌 {t('support.note', 'For immediate answers, check our FAQ page.')}
        </p>
        <Link
          href={`/${locale}/faq`} // Use the passed locale for link construction
          className="inline-block text-primary hover:underline text-sm font-medium"
        >
          {t('support.cta', 'Visit FAQ')} →
        </Link>
      </div>
    </main>
  )
}
