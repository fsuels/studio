// src/components/layout/Footer.tsx
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Linkedin, Twitter, Send, Lock, Loader2, Phone, Clock, MessageSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Logo } from '@/components/layout/Logo';
import { useTranslation } from 'react-i18next';
import { useParams } from 'next/navigation';

const Footer = React.memo(function Footer() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { t, i18n } = useTranslation("common"); // Ensure "common" namespace
  const params = useParams();
  const locale = (params.locale as 'en' | 'es') || 'en';
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@')) {
      toast({
        title: t('footer.errorInvalidEmailTitle', { defaultValue: 'Invalid Email' }),
        description: t('footer.errorInvalidEmailDesc', { defaultValue: 'Please enter a valid email address.' }),
        variant: 'destructive',
      });
      return;
    }
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast({
      title: t('footer.subscribedSuccessTitle', { defaultValue: 'Subscribed!' }),
      description: t('footer.subscribedSuccessDesc', { defaultValue: 'Thanks for joining our mailing list.' }),
    });
    setEmail('');
    setIsLoading(false);
  };

  const currentYear = new Date().getFullYear();

  const footerLinkSections = [
    {
      sectionTitleKey: 'footer.sectionProductTitle',
      defaultSectionTitle: 'Product',
      links: [
        { path: '/#workflow-start', labelKey: 'footer.linkHowItWorks', defaultLabel: 'How It Works' },
        { path: '/pricing',       labelKey: 'footer.linkPricing',    defaultLabel: 'Pricing' },
        { path: '/features',      labelKey: 'footer.linkFeatures',   defaultLabel: 'Features' },
      ],
    },
    {
      sectionTitleKey: 'footer.sectionResourcesTitle',
      defaultSectionTitle: 'Resources',
      links: [
        { path: '/blog',    labelKey: 'footer.linkBlog',     defaultLabel: 'Blog' },
        { path: '/faq',     labelKey: 'footer.linkFaq',      defaultLabel: 'FAQ' },
        { path: '/support', labelKey: 'footer.linkSupport',  defaultLabel: 'Support' },
      ],
    },
    {
      sectionTitleKey: 'footer.sectionLegalTitle',
      defaultSectionTitle: 'Legal',
      links: [
        { path: '/privacy-policy',    labelKey: 'footer.linkPrivacyPolicy',  defaultLabel: 'Privacy Policy' },
        { path: '/terms-of-service',  labelKey: 'footer.linkTermsOfService', defaultLabel: 'Terms of Service' },
        { path: '/disclaimer',        labelKey: 'footer.linkDisclaimer',     defaultLabel: 'Disclaimer' },
      ],
    }
  ];

  if (!isHydrated) {
    return (
      <footer className="bg-muted text-muted-foreground py-12 mt-16 border-t border-border animate-pulse">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="h-6 bg-gray-300 rounded w-1/2"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
              </div>
            ))}
          </div>
          <div className="border-t border-border pt-6 text-center text-xs">
            <div className="h-4 bg-gray-300 rounded w-1/3 mx-auto"></div>
          </div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="bg-muted text-muted-foreground py-12 mt-16 border-t border-border">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">

          {/* Logo & Subhead */}
          <div className="space-y-4">
            <Logo wrapperClassName="mb-1 items-start" svgClassName="h-7 w-7" textClassName="text-sm" />
            <p className="text-xs">
              {t('footer.subhead', { defaultValue: 'AI-Powered Legal Document Generation. Fast, Affordable, Secure.'})}
            </p>
          </div>

          {/* Footer sections */}
          {footerLinkSections.map((section) => (
              <div key={section.sectionTitleKey}>
                <h4 className="font-semibold text-foreground mb-3">
                  {t(section.sectionTitleKey, { defaultValue: section.defaultSectionTitle })}
                </h4>
                <ul className="space-y-2 text-sm">
                  {section.links.map((link) => (
                    <li key={link.path}>
                      <Link href={`/${locale}${link.path}`} className="hover:text-primary hover:underline">
                        {t(link.labelKey, { defaultValue: link.defaultLabel })}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

          {/* Community & subscription */}
          <div>
            <h4 className="font-semibold text-foreground mb-3">
              {t('footer.sectionCommunityTitle', {defaultValue: "Community & Contact"})}
            </h4>
            <div className="flex space-x-3 mb-4">
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"
                 aria-label={t('footer.socialLinkedInAria', {defaultValue: "LinkedIn Page"})}
                 className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
                 aria-label={t('footer.socialTwitterAria', {defaultValue: "Twitter Profile"})}
                 className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
            <div className="text-xs space-y-1 mb-6">
              <p className="flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5 text-primary/80"/>
                <span>{t('footer.supportPhoneNumber', {defaultValue: "+1 (800) 555-0199 (Support)"})}</span>
              </p>
              <p className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-primary/80"/>
                <span>{t('footer.supportHours', {defaultValue: "Mon–Fri, 9am–6pm EST"})}</span>
              </p>
            </div>

            <h4 className="font-semibold text-foreground mb-3">
              {t('footer.getCreditsTitle', {defaultValue: "Get 3 Free Credits"})}
            </h4>
            <form onSubmit={handleSubscribe} className="flex gap-2 items-center">
              <div className="relative flex-grow">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  type="email"
                  placeholder={t('footer.emailPlaceholder', {defaultValue: "Enter your email"})}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 pr-2 py-2 h-12 text-base bg-background border-input"
                  aria-label={t('footer.emailPlaceholderAria', {defaultValue: "Email for newsletter"})}
                  disabled={isLoading}
                />
              </div>
              <Button type="submit" size="icon"
                      className="bg-primary text-primary-foreground hover:bg-primary/90 h-12 w-12 shrink-0"
                      aria-label={t('footer.subscribeButtonAria', {defaultValue: "Subscribe to newsletter"})}
                      disabled={isLoading}>
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
              </Button>
            </form>
            <p className="text-xs mt-2">
              {t('footer.joinMailingListDesc', {defaultValue: "Join our mailing list for exclusive offers."})}
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-border pt-6 text-center text-xs">
          {t('footer.copyright', { year: currentYear, defaultValue: `© ${currentYear} 123LegalDoc. All rights reserved.` })}
        </div>
      </div>

      {/* Chat widget button */}
      {isHydrated && (
        <div className="fixed bottom-4 right-4 z-50">
          <Button variant="outline" size="icon"
                  className="rounded-full shadow-lg bg-primary text-primary-foreground hover:bg-primary/90 w-12 h-12"
                  onClick={() => (window as any).Intercom && (window as any).Intercom('show')}
                  aria-label={t('footer.openChatAria', { defaultValue: "Open chat" })}>
            <MessageSquare className="h-6 w-6" />
          </Button>
        </div>
      )}
    </footer>
  );
});

export { Footer };
