// src/components/layout/Footer.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Linkedin,
  Twitter,
  Send,
  Lock,
  Loader2,
  Phone,
  Clock,
} from 'lucide-react';
import AutoImage from '@/components/AutoImage';
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
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast({
      title: t('subscribedSuccessTitle', { defaultValue: 'Subscribed!' }),
      description: t('subscribedSuccessDesc', {
        defaultValue: 'Thanks for joining our mailing list.',
      }),
    });
    setEmail('');
    setIsLoading(false);
  };

  const currentYear = new Date().getFullYear();

  const footerLinkSections = [
    {
      sectionTitleKey: 'sectionProductTitle',
      defaultSectionTitle: 'Product',
      links: [
        {
          path: '/#workflow-start',
          labelKey: 'linkHowItWorks',
          defaultLabel: 'How It Works',
        },
        { path: '/pricing', labelKey: 'linkPricing', defaultLabel: 'Pricing' },
        {
          path: '/features',
          labelKey: 'linkFeatures',
          defaultLabel: 'Features',
        },
      ],
    },
    {
      sectionTitleKey: 'sectionResourcesTitle',
      defaultSectionTitle: 'Resources',
      links: [
        { path: '/blog', labelKey: 'linkBlog', defaultLabel: 'Blog' },
        { path: '/docs', labelKey: 'linkDocs', defaultLabel: 'Docs' },
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
          defaultLabel: 'Terms',
        },
        {
          path: '/disclaimer',
          labelKey: 'linkDisclaimer',
          defaultLabel: 'Disclaimer',
        },
      ],
    },
  ];

  if (!isHydrated) {
    return <FooterSkeleton />;
  }

  return (
    <footer className="bg-[#1F2937] text-gray-300 py-12 mt-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Logo & Subhead */}
          <div className="space-y-4">
            <Logo
              wrapperClassName="mb-1 items-start [--primary:0_0%_100%] [--primary-foreground:0_0%_100%]"
              svgClassName="h-7 w-7"
              textClassName="text-sm"
            />
            <p className="text-xs">
              {t('subhead', {
                defaultValue:
                  'AI-Powered Legal Document Generation. Fast, Affordable, Secure.',
              })}
            </p>
          </div>

          {/* Footer sections */}
          {footerLinkSections.map((section) => (
            <div key={section.sectionTitleKey}>
              <h3 className="font-semibold text-white mb-3">
                {t(section.sectionTitleKey, {
                  defaultValue: section.defaultSectionTitle,
                })}
              </h3>
              <ul className="space-y-2 text-sm">
                {section.links.map((link) => (
                  <li key={link.path}>
                    <Link
                      href={`/${locale}${link.path}`}
                      className="hover:text-white hover:underline"
                    >
                      {t(link.labelKey, { defaultValue: link.defaultLabel })}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Community & subscription */}
          <div>
            <h3 className="font-semibold text-white mb-3">
              {t('sectionCommunityTitle', {
                defaultValue: 'Community & Contact',
              })}
            </h3>

            <h3 className="font-semibold text-white mb-3">
              {t('getCreditsTitle', { defaultValue: 'Get 3 Free Templates' })}
            </h3>
            <form onSubmit={handleSubscribe} className="flex items-center gap-2">
              <div className="relative flex-grow rounded-full bg-[#F3F4F6] focus-within:ring-2 focus-within:ring-[#00C3A3] focus-within:ring-offset-2">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 pointer-events-none" />
                <Input
                  type="email"
                  placeholder={t('emailPlaceholder', {
                    defaultValue: 'Enter your email',
                  })}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 pr-2 py-2 h-12 text-base bg-transparent border-0 placeholder:text-gray-500 focus-visible:ring-0"
                  aria-label={t('emailPlaceholderAria', {
                    defaultValue: 'Email for newsletter',
                  })}
                  disabled={isLoading}
                />
              </div>
              <Button
                type="submit"
                size="icon"
                className="relative ml-1 h-12 w-12 shrink-0 rounded-full bg-brand-green text-white hover:bg-brand-green/90 overflow-hidden before:absolute before:inset-0 before:rounded-full before:bg-[#00C3A3]/30 before:content-[''] before:scale-0 before:transition-transform before:duration-300 hover:before:scale-125"
                aria-label={t('subscribeButtonAria', {
                  defaultValue: 'Subscribe to newsletter',
                })}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </Button>
            </form>
            <p className="text-xs mt-2">
              {t('joinMailingListDesc', {
                defaultValue: 'We respect your inbox. Unsubscribe anytime.',
              })}
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center space-y-4">
          <div className="flex space-x-3">
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t('socialLinkedInAria', {
                defaultValue: 'LinkedIn Page',
              })}
              className="text-gray-300 hover:text-white transition-colors"
            >
              <Linkedin className="h-5 w-5" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t('socialTwitterAria', {
                defaultValue: 'Twitter Profile',
              })}
              className="text-gray-300 hover:text-white transition-colors"
            >
              <Twitter className="h-5 w-5" />
            </a>
          </div>
          <div className="text-xs space-y-1 text-gray-300 text-center">
            <p className="flex items-center justify-center gap-1.5">
              <Phone className="h-3.5 w-3.5 text-brand-green" />
              <span>
                {t('supportPhoneNumber', {
                  defaultValue: '+1 (800) 555-0199 (Support)',
                })}
              </span>
            </p>
            <p className="flex items-center justify-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-brand-green" />
              <span>
                {t('supportHours', { defaultValue: 'Mon–Fri, 9am–6pm EST' })}
              </span>
            </p>
          </div>
        </div>

        <div className="flex justify-center gap-6 mt-8" aria-hidden="true">
          <AutoImage
            src="https://cdn.simpleicons.org/stripe/635bff"
            alt="Stripe logo"
            width={80}
            height={24}
            className="h-6 w-auto"
          />
          <AutoImage
            src="https://cdn.simpleicons.org/firebase/ffca28"
            alt="Firebase logo"
            width={80}
            height={24}
            className="h-6 w-auto"
          />
          <AutoImage
            src="https://cdn.simpleicons.org/paypal/003087"
            alt="PayPal logo"
            width={80}
            height={24}
            className="h-6 w-auto"
          />
        </div>

        {/* Copyright */}
        <div className="border-t border-border pt-6 text-center text-xs">
          {t('copyright', {
            year: currentYear,
            defaultValue: `© ${currentYear} 123LegalDoc. All rights reserved.`,
          })}
        </div>
      </div>
    </footer>
  );
});
