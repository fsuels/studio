// src/components/layout/Footer.tsx
"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Linkedin, Twitter, Send, Lock, Loader2, Phone, MessageSquare, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Logo } from '@/components/layout/Logo';
import { useTranslation } from 'react-i18next';
import { useParams } from 'next/navigation';

const Footer = React.memo(function Footer() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // use separate hooks for footer and common namespaces
  const { t: tFooter } = useTranslation("common");
  const { t: tCommon } = useTranslation("common");

  const params = useParams();
  const locale = (params.locale as 'en' | 'es') || (tCommon('') && undefined) || 'en';
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes('@')) {
      toast({
        title: tFooter('errorInvalidEmail'),
        description: tFooter('invalidEmailMessage'),
        variant: 'destructive',
      });
      return;
    }
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    toast({
      title: tCommon('toasts.subscribedTitle'),
      description: tCommon('toasts.subscribedDescription'),
    });
    setEmail('');
    setIsLoading(false);
  };

  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      sectionTitleKey: 'Product',
      defaultSectionTitle: 'Product',
      links: [
        { path: '/#workflow-start', labelKey: 'howItWorks', defaultLabel: 'How It Works' },
        { path: '/pricing',       labelKey: 'pricing',       defaultLabel: 'Pricing' },
        { path: '/features',      labelKey: 'features',      defaultLabel: 'Features' },
      ],
      ns: 'footer' as const
    },
    {
      sectionTitleKey: 'resources',
      defaultSectionTitle: 'Resources',
      links: [
        { path: '/blog',    labelKey: 'blog',    defaultLabel: 'Blog' },
        { path: '/faq',     labelKey: 'faq',     defaultLabel: 'FAQ' },
        { path: '/support', labelKey: 'support', defaultLabel: 'Support' },
      ],
      ns: 'footer' as const
    },
    {
      sectionTitleKey: 'legal',
      defaultSectionTitle: 'Legal',
      links: [
        { path: '/privacy-policy',    labelKey: 'privacyPolicy',    defaultLabel: 'Privacy Policy' },
        { path: '/terms-of-service',  labelKey: 'termsOfService',   defaultLabel: 'Terms of Service' },
        { path: '/disclaimer',        labelKey: 'disclaimer',       defaultLabel: 'Disclaimer' },
      ],
      ns: 'footer' as const
    }
  ];

  if (!isHydrated) {
    return (
      <footer className="bg-muted text-muted-foreground py-12 mt-16 border-t border-border animate-pulse">
        {/* ...skeleton loading UI... */}
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
              {tCommon('subhead')}
            </p>
          </div>

          {/* Footer sections */}
          {footerLinks.map((section) => {
            const SecT = section.ns === 'footer' ? tFooter : tCommon;
            return (
              <div key={section.sectionTitleKey}>
                <h4 className="font-semibold text-foreground mb-3">
                  {SecT(section.sectionTitleKey, { defaultValue: section.defaultSectionTitle })}
                </h4>
                <ul className="space-y-2 text-sm">
                  {section.links.map((link) => (
                    <li key={link.path}>
                      <Link href={`/${locale}${link.path}`} className="hover:text-primary hover:underline">
                        {tFooter(link.labelKey, { defaultValue: link.defaultLabel })}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}

          {/* Community & subscription */}
          <div>
            <h4 className="font-semibold text-foreground mb-3">
              {tFooter('community')}
            </h4>
            <div className="flex space-x-3 mb-4">
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"
                 aria-label={tCommon('LinkedIn')}
                 className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
                 aria-label={tCommon('Twitter')}
                 className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
            <div className="text-xs space-y-1 mb-6">
              <p className="flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5 text-primary/80"/>
                <span>+1 (800) 555-0199 (Support)</span>
              </p>
              <p className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-primary/80"/>
                <span>{tCommon('support.contact.hours')}</span>
              </p>
            </div>

            <h4 className="font-semibold text-foreground mb-3">
              {tFooter('getCredits')}
            </h4>
            <form onSubmit={handleSubscribe} className="flex gap-2 items-center">
              <div className="relative flex-grow">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  type="email"
                  placeholder={tFooter('emailPlaceholder')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 pr-2 py-2 h-12 text-base bg-background border-input"
                  aria-label={tFooter('emailPlaceholder')}
                  disabled={isLoading}
                />
              </div>
              <Button type="submit" size="icon"
                      className="bg-primary text-primary-foreground hover:bg-primary/90 h-12 w-12 shrink-0"
                      aria-label={tFooter('subscribe')}
                      disabled={isLoading}>
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
              </Button>
            </form>
            <p className="text-xs mt-2">
              {tFooter('joinMailingList')}
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-border pt-6 text-center text-xs">
          {tFooter('copyright', { year: currentYear })}
        </div>
      </div>

      {/* Chat widget button */}
      {isHydrated && (
        <div className="fixed bottom-4 right-4 z-50">
          <Button variant="outline" size="icon"
                  className="rounded-full shadow-lg bg-primary text-primary-foreground hover:bg-primary/90 w-12 h-12"
                  aria-label={tCommon('Open chat')}>
            <MessageSquare className="h-6 w-6" />
          </Button>
        </div>
      )}
    </footer>
  );
});

export { Footer };
