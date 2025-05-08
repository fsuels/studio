// src/components/layout/Footer.tsx
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Linkedin, Twitter, Send, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Logo } from '@/components/layout/Logo';
import { useTranslation } from 'react-i18next';

export function Footer() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const { t, i18n } = useTranslation();
    const locale = i18n.language as 'en' | 'es'; // Get current locale from i18n
    const [isHydrated, setIsHydrated] = useState(false);

    useEffect(() => {
        setIsHydrated(true);
    }, []);

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.includes('@')) {
             toast({ title: t('footer.errorInvalidEmail'), description: t('footer.invalidEmailMessage', { defaultValue: "Please enter a valid email address."}), variant: "destructive" });
             return;
        }
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log("Subscribing email:", email);
        toast({ title: t('toasts.subscribedTitle'), description: t('toasts.subscribedDescription') });
        setEmail('');
        setIsLoading(false);
    };

    const placeholderText = "...";
    const currentYear = new Date().getFullYear();

    if (!isHydrated) {
      return (
        <footer className="bg-muted text-muted-foreground py-12 mt-16 border-t border-border animate-pulse">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-3">
                  <div className="h-6 bg-muted-foreground/20 rounded w-1/2"></div>
                  <div className="h-4 bg-muted-foreground/10 rounded w-3/4"></div>
                  <div className="h-4 bg-muted-foreground/10 rounded w-2/3"></div>
                  <div className="h-4 bg-muted-foreground/10 rounded w-1/2"></div>
                </div>
              ))}
            </div>
            <div className="border-t border-border pt-6 text-center text-xs">
              <div className="h-4 bg-muted-foreground/10 rounded w-1/3 mx-auto"></div>
            </div>
          </div>
        </footer>
      );
    }

  return (
    <footer className="bg-muted text-muted-foreground py-12 mt-16 border-t border-border">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Column 1: Logo & Product */}
          <div className="space-y-4">
             <Logo wrapperClassName="mb-1" />
             <h4 className="font-semibold text-foreground mb-3 sr-only">{t('Product', {defaultValue: "Product"})}</h4>
             <ul className="space-y-2 text-sm">
              <li><Link href={`/${locale}/#workflow-start`} className="hover:text-primary hover:underline">{t('footer.howItWorks')}</Link></li>
              <li><Link href={`/${locale}/pricing`} className="hover:text-primary hover:underline">{t('footer.pricing')}</Link></li>
              <li><Link href={`/${locale}/features`} className="hover:text-primary hover:underline">{t('footer.features')}</Link></li>
            </ul>
          </div>

          {/* Column 2: Resources */}
          <div>
            <h4 className="font-semibold text-foreground mb-3">{t('footer.resources')}</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href={`/${locale}/blog`} className="hover:text-primary hover:underline">{t('footer.blog')}</Link></li>
              <li><Link href={`/${locale}/faq`} className="hover:text-primary hover:underline">{t('footer.faq')}</Link></li>
              <li><Link href={`/${locale}/support`} className="hover:text-primary hover:underline">{t('footer.support')}</Link></li>
            </ul>
          </div>

          {/* Column 3: Legal */}
          <div>
            <h4 className="font-semibold text-foreground mb-3">{t('footer.legal')}</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href={`/${locale}/privacy-policy`} className="hover:text-primary hover:underline">{t('footer.privacyPolicy')}</Link></li>
              <li><Link href={`/${locale}/terms-of-service`} className="hover:text-primary hover:underline">{t('footer.termsOfService')}</Link></li>
              <li><Link href={`/${locale}/disclaimer`} className="hover:text-primary hover:underline">{t('footer.disclaimer')}</Link></li>
            </ul>
          </div>

          {/* Column 4: Community & Subscribe */}
          <div>
             <h4 className="font-semibold text-foreground mb-3">{t('footer.community')}</h4>
             <div className="flex space-x-3 mb-6">
                 <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-muted-foreground hover:text-primary transition-colors">
                    <Linkedin className="h-5 w-5" />
                 </a>
                 <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="text-muted-foreground hover:text-primary transition-colors">
                     <Twitter className="h-5 w-5" />
                 </a>
             </div>

            <h4 className="font-semibold text-foreground mb-3">{t('footer.getCredits')}</h4>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <Input
                type="email"
                placeholder={t('footer.emailPlaceholder')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-grow bg-background text-sm"
                aria-label={t('footer.emailPlaceholder') || "Email for newsletter subscription"}
                disabled={isLoading}
              />
              <Button type="submit" size="icon" className="bg-primary text-primary-foreground hover:bg-primary/90" aria-label={t('footer.subscribe')} disabled={isLoading}>
                 {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </form>
            <p className="text-xs mt-2">{t('footer.joinMailingList')}</p>
          </div>
        </div>

        <div className="border-t border-border pt-6 text-center text-xs">
          {t('footer.copyright', { year: currentYear })}
        </div>
      </div>
    </footer>
  );
}
