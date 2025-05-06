// src/components/layout/Footer.tsx
"use client";

import React, { useState, useEffect } from 'react'; // Import useEffect
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Linkedin, Twitter, Send, Loader2 } from 'lucide-react'; // Social and Send icons, added Loader2
import { useToast } from '@/hooks/use-toast';
import { Logo } from '@/components/layout/Logo'; // Import the Logo component
import { useTranslation } from 'react-i18next'; // Import useTranslation

export function Footer() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();
    const { t, i18n } = useTranslation(); // Get translation function and i18n instance
    const [isHydrated, setIsHydrated] = useState(false); // State for hydration

    useEffect(() => {
        setIsHydrated(true); // Set hydrated state on client
    }, []);

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.includes('@')) { // Simple validation
             toast({ title: t('footer.errorInvalidEmail'), description: t('footer.invalidEmailMessage', { defaultValue: "Please enter a valid email address."}), variant: "destructive" });
             return;
        }
        setIsLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log("Subscribing email:", email);
        toast({ title: t('toasts.subscribedTitle'), description: t('toasts.subscribedDescription') });
        setEmail('');
        setIsLoading(false);
    };

    const footerSections = [
        {
            titleKey: null, // Logo section, no explicit title needed from translations
            isLogo: true,
            links: [
                { href: "/#how-it-works", labelKey: "footer.howItWorks" },
                { href: "/pricing", labelKey: "footer.pricing" },
                { href: "/features", labelKey: "footer.features" },
            ]
        },
        {
            titleKey: "footer.resources",
            links: [
                { href: "/blog", labelKey: "footer.blog" },
                { href: "/faq", labelKey: "footer.faq" },
                { href: "/support", labelKey: "footer.support" },
            ]
        },
        {
            titleKey: "footer.legal",
            links: [
                { href: "/privacy-policy", labelKey: "footer.privacyPolicy" },
                { href: "/terms-of-service", labelKey: "footer.termsOfService" },
                { href: "/disclaimer", labelKey: "footer.disclaimer" },
            ]
        }
    ];

    const placeholderText = "...";
    const currentYear = new Date().getFullYear(); // Get current year for copyright

    // Show placeholder or nothing if not hydrated
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
             <Logo wrapperClassName="mb-1" /> {/* Use wrapperClassName for Link specific styling */}
             <h4 className="font-semibold text-foreground mb-3 sr-only">{isHydrated ? t('Product') : placeholderText}</h4>
             <ul className="space-y-2 text-sm">
              <li><Link href="/#workflow-start" className="hover:text-primary hover:underline">{isHydrated ? t('footer.howItWorks') : placeholderText}</Link></li>
              <li><Link href="/pricing" className="hover:text-primary hover:underline">{isHydrated ? t('footer.pricing') : placeholderText}</Link></li>
              <li><Link href="/features" className="hover:text-primary hover:underline">{isHydrated ? t('footer.features') : placeholderText}</Link></li>
            </ul>
          </div>

          {/* Column 2: Resources */}
          <div>
            <h4 className="font-semibold text-foreground mb-3">{isHydrated ? t('footer.resources') : placeholderText}</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/blog" className="hover:text-primary hover:underline">{isHydrated ? t('footer.blog') : placeholderText}</Link></li>
              <li><Link href="/faq" className="hover:text-primary hover:underline">{isHydrated ? t('footer.faq') : placeholderText}</Link></li>
              <li><Link href="/support" className="hover:text-primary hover:underline">{isHydrated ? t('footer.support') : placeholderText}</Link></li>
            </ul>
          </div>

          {/* Column 3: Legal */}
          <div>
            <h4 className="font-semibold text-foreground mb-3">{isHydrated ? t('footer.legal') : placeholderText}</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/privacy-policy" className="hover:text-primary hover:underline">{isHydrated ? t('footer.privacyPolicy') : placeholderText}</Link></li>
              <li><Link href="/terms-of-service" className="hover:text-primary hover:underline">{isHydrated ? t('footer.termsOfService') : placeholderText}</Link></li>
              <li><Link href="/disclaimer" className="hover:text-primary hover:underline">{isHydrated ? t('footer.disclaimer') : placeholderText}</Link></li>
            </ul>
          </div>

          {/* Column 4: Community & Subscribe */}
          <div>
             <h4 className="font-semibold text-foreground mb-3">{isHydrated ? t('footer.community') : placeholderText}</h4>
             <div className="flex space-x-3 mb-6">
                 <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-muted-foreground hover:text-primary transition-colors">
                    <Linkedin className="h-5 w-5" />
                 </a>
                 <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="text-muted-foreground hover:text-primary transition-colors">
                     <Twitter className="h-5 w-5" />
                 </a>
             </div>

            <h4 className="font-semibold text-foreground mb-3">{isHydrated ? t('footer.getCredits') : placeholderText}</h4>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <Input
                type="email"
                placeholder={isHydrated ? t('footer.emailPlaceholder') : placeholderText}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-grow bg-background text-sm"
                aria-label={isHydrated ? (t('footer.emailPlaceholder') || "Email for newsletter subscription") : "Email for newsletter subscription"}
                disabled={isLoading || !isHydrated}
              />
              <Button type="submit" size="icon" className="bg-primary text-primary-foreground hover:bg-primary/90" aria-label={isHydrated ? t('footer.subscribe') : "Subscribe"} disabled={isLoading || !isHydrated}>
                 {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </form>
            <p className="text-xs mt-2">{isHydrated ? t('footer.joinMailingList') : placeholderText}</p>
          </div>
        </div>

        <div className="border-t border-border pt-6 text-center text-xs">
          {isHydrated ? t('footer.copyright', { year: currentYear }) : placeholderText}
        </div>
      </div>
    </footer>
  );
}

