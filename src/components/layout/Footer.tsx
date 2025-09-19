// src/components/layout/Footer.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { track } from '@/lib/analytics';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Linkedin, Twitter, ArrowRight, Lock, Loader2, Phone, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Logo } from '@/components/layout/Logo';
import { useTranslation } from 'react-i18next';
import { useParams } from 'next/navigation';

export const FooterSkeleton = () => (
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

export const Footer = React.memo(function Footer() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslation('footer');
  const params = (useParams<{ locale?: string }>() ?? {}) as {
    locale?: string;
  };
  const locale = (params.locale as 'en' | 'es') || 'en';
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@')) {
      track('footer_subscribe_attempt', { locale, status: 'invalid_email' });
      toast({
        title: t('errorInvalidEmailTitle', { defaultValue: 'Invalid Email' }),
        description: t('errorInvalidEmailDesc', {
          defaultValue: 'Please enter a valid email address.',
        }),
        variant: 'destructive',
      });
      return;
    }
    setIsLoading(true);
      track('footer_subscribe_attempt', { locale, status: 'submitted' });
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast({
      title: t('subscribedSuccessTitle', { defaultValue: 'Subscribed!' }),
      description: t('subscribedSuccessDesc', {
        defaultValue: 'Thanks for joining our mailing list.',
      }),
    });
      track('footer_subscribe_result', { locale, status: 'success' });
    setEmail('');
    setIsLoading(false);
  };

  const currentYear = new Date().getFullYear();

  const footerLinkSections = [
    {
      sectionTitleKey: 'sectionProductTitle',
      defaultSectionTitle: 'Product',
      links: [
        { path: '/documents', labelKey: 'linkTemplates', defaultLabel: 'Templates' },
        { path: '/pricing', labelKey: 'linkPricing', defaultLabel: 'Pricing' },
        { path: '/partners', labelKey: 'linkPartners', defaultLabel: 'Partners' },
      ],
    },
    {
      sectionTitleKey: 'sectionResourcesTitle',
      defaultSectionTitle: 'Resources',
      links: [
        { path: '/blog', labelKey: 'linkBlog', defaultLabel: 'Blog' },
        { path: '/faq', labelKey: 'linkFaq', defaultLabel: 'FAQ' },
        { path: '/support', labelKey: 'linkSupport', defaultLabel: 'Support' },
      ],
    },
    {
      sectionTitleKey: 'sectionLegalTitle',
      defaultSectionTitle: 'Legal',
      links: [
        {
          path: '/privacy-policy',
          labelKey: 'linkPrivacyPolicy',
          defaultLabel: 'Privacy Policy',
        },
        {
          path: '/terms-of-service',
          labelKey: 'linkTermsOfService',
          defaultLabel: 'Terms of Service',
        },
        {
          path: '/disclaimer',
          labelKey: 'linkDisclaimer',
          defaultLabel: 'Disclaimer',
        },
        {
          path: '/refund-policy',
          labelKey: 'linkRefundPolicy',
          defaultLabel: 'Refund Policy',
        },
        { path: '/sitemap', labelKey: 'linkSitemap', defaultLabel: 'Sitemap' },
      ],
    },
  ];

  if (!isHydrated) {
    return <FooterSkeleton />;
  }

  return (
    <footer className="mt-16 bg-[#0f172a] text-slate-300">
      <div className="container mx-auto px-4 py-12">
        {/* Top grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="space-y-3">
            <Logo
              wrapperClassName="mb-1 items-start [--primary:217_92%_60%] [--primary-foreground:0_0%_100%]"
              svgClassName="h-7 w-7"
              textClassName="text-sm"
            />
            <p className="text-xs leading-6 max-w-xs">
              {t('subhead', {
                defaultValue:
                  'Empowering your legal document generation. Fast, affordable, secure.',
              })}
            </p>
          </div>

          {/* Link columns */}
          {footerLinkSections.map((section) => (
            <div key={section.sectionTitleKey}>
              <h3 className="font-semibold text-white mb-3">
                {t(section.sectionTitleKey, { defaultValue: section.defaultSectionTitle })}
              </h3>
              <ul className="space-y-2 text-sm">
                {section.links.map((link) => (
                  <li key={link.path}>
                    <Link href={`/${locale}${link.path}`} className="hover:text-white hover:underline">
                      {t(link.labelKey, { defaultValue: link.defaultLabel })}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <hr className="my-8 border-slate-700" />

        {/* Community & contact row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          <div className="col-span-2">
            <h4 className="text-white font-semibold mb-2">{t('sectionCommunityTitle', { defaultValue: 'Community & Contact' })}</h4>
            <p className="text-xs mb-3">{t('joinMailingListTitle', { defaultValue: 'Get our latest legal updates and templates.' })}</p>
            <form onSubmit={handleSubscribe} className="flex items-center gap-2 max-w-md">
              <div className="relative flex-grow rounded-md bg-slate-800 focus-within:ring-2 focus-within:ring-sky-500">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                <Input
                  id="newsletter-email"
                  name="email"
                  type="email"
                  placeholder={t('emailPlaceholder', { defaultValue: 'Enter your email address' })}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 pr-2 py-2 h-11 text-sm bg-transparent border-0 placeholder:text-slate-400 focus-visible:ring-0 text-slate-200"
                  aria-label={t('emailPlaceholderAria', { defaultValue: 'Email for newsletter' })}
                  disabled={isLoading}
                />
              </div>
              <Button
                type="submit"
                size="icon"
                className="h-11 w-11 shrink-0 rounded-md bg-sky-600 hover:bg-sky-500 text-white"
                aria-label={t('subscribeButtonAria', { defaultValue: 'Subscribe to newsletter' })}
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <ArrowRight className="h-5 w-5" />}
              </Button>
            </form>
          </div>
          <div className="text-xs space-y-2 md:text-right">
            <p className="flex md:justify-end items-center gap-2">
              <Phone className="h-4 w-4 text-sky-400" />
              <span>{t('supportPhoneNumber', { defaultValue: '(888) 123-4567 (toll-free)' })}</span>
            </p>
            <p className="flex md:justify-end items-center gap-2">
              <Clock className="h-4 w-4 text-sky-400" />
              <span>{t('supportHours', { defaultValue: 'Mon–Fri, 9am–6pm EST' })}</span>
            </p>
            <div className="mt-3 flex gap-3 md:justify-end">
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label={t('socialLinkedInAria', { defaultValue: 'LinkedIn Page' })} className="text-slate-300 hover:text-white transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label={t('socialTwitterAria', { defaultValue: 'Twitter Profile' })} className="text-slate-300 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
      {/* Bottom bar */}
      <div className="bg-[#0b1220] text-slate-400 text-xs py-4">
        <div className="container mx-auto px-4 text-center">
          {t('copyright', { year: currentYear, defaultValue: `© ${currentYear} 123LegalDoc. All rights reserved.` })}
        </div>
      </div>
    </footer>
  );
});
