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

const Footer = React.memo(function Footer() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const { t, i18n } = useTranslation();
    const locale = i18n.language as 'en' | 'es'; 
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

    const footerLinks = [
      { sectionTitleKey: 'Product', links: [
          { path: '/#workflow-start', labelKey: 'footer.howItWorks', defaultLabel: 'How It Works' },
          { path: '/pricing', labelKey: 'footer.pricing', defaultLabel: 'Pricing' },
          { path: '/features', labelKey: 'footer.features', defaultLabel: 'Features' },
        ]
      },
      { sectionTitleKey: 'footer.resources', links: [
          { path: '/blog', labelKey: 'footer.blog', defaultLabel: 'Blog' },
          { path: '/faq', labelKey: 'footer.faq', defaultLabel: 'FAQ' },
          { path: '/support', labelKey: 'footer.support', defaultLabel: 'Support' },
        ]
      },
      { sectionTitleKey: 'footer.legal', links: [
          { path: '/privacy-policy', labelKey: 'footer.privacyPolicy', defaultLabel: 'Privacy Policy' },
          { path: '/terms-of-service', labelKey: 'footer.termsOfService', defaultLabel: 'Terms of Service' },
          { path: '/disclaimer', labelKey: 'footer.disclaimer', defaultLabel: 'Disclaimer' },
        ]
      }
    ];


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
          <div className="space-y-4">
             <Logo wrapperClassName="mb-1 items-start" svgClassName="h-8 w-8" textClassName="text-sm" />
             <p className="text-xs">
                {t('subhead', {defaultValue: 'Create, sign & share professional contracts in minutes—no lawyer required.'})}
             </p>
          </div>

          {footerLinks.map(section => (
            <div key={section.sectionTitleKey}>
                <h4 className="font-semibold text-foreground mb-3">{t(section.sectionTitleKey, section.sectionTitleKey.split('.').pop())}</h4>
                <ul className="space-y-2 text-sm">
                    {section.links.map(link => (
                         <li key={link.path}>
                            <Link href={`/${locale}${link.path}`} className="hover:text-primary hover:underline">
                                {t(link.labelKey, link.defaultLabel)}
                            </Link>
                         </li>
                    ))}
                </ul>
            </div>
          ))}
          

          <div>
             <h4 className="font-semibold text-foreground mb-3">{t('footer.community', 'Community')}</h4>
             <div className="flex space-x-3 mb-6">
                 <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-muted-foreground hover:text-primary transition-colors">
                    <Linkedin className="h-5 w-5" />
                 </a>
                 <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="text-muted-foreground hover:text-primary transition-colors">
                     <Twitter className="h-5 w-5" />
                 </a>
             </div>

            <h4 className="font-semibold text-foreground mb-3">{t('footer.getCredits', 'Get 3 Free Credits')}</h4>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <Input
                type="email"
                placeholder={t('footer.emailPlaceholder', 'Enter your email')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-grow bg-background text-sm"
                aria-label={t('footer.emailPlaceholder', 'Email for newsletter subscription')}
                disabled={isLoading}
              />
              <Button type="submit" size="icon" className="bg-primary text-primary-foreground hover:bg-primary/90" aria-label={t('footer.subscribe', 'Subscribe')} disabled={isLoading}>
                 {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </form>
            <p className="text-xs mt-2">{t('footer.joinMailingList', 'Join our mailing list for updates and offers.')}</p>
          </div>
        </div>

        <div className="border-t border-border pt-6 text-center text-xs">
          {t('footer.copyright', { year: currentYear, defaultValue: `© ${currentYear} 123LegalDoc. All rights reserved.` })}
        </div>
      </div>
    </footer>
  );
});
export { Footer };
