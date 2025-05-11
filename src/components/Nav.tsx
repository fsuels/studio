// components/Nav.tsx
'use client';

import React, { useState, useEffect } from 'react'; 
import Link from 'next/link';
import { usePathname, useParams } from 'next/navigation'; // Added useParams
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

const Nav = React.memo(function Nav() {
  const { t, i18n } = useTranslation(); // Ensure i18n is destructured if used for language
  const pathname = usePathname(); 
  const params = useParams(); // Use useParams to get locale
  const [currentLocale, setCurrentLocale] = useState<'en'|'es'>('en'); // Explicitly type locale
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Locale is derived from params, not i18n.language directly for link construction
    const pathLocale = params.locale as 'en' | 'es' | undefined;
    if (pathLocale && ['en', 'es'].includes(pathLocale)) {
      setCurrentLocale(pathLocale);
    } else if (pathname === '/') { // Fallback for root path before redirect
        setCurrentLocale('en'); 
    }
    // i18n.language will be updated by ClientProviders or LocaleLayout
  }, [pathname, params.locale]);

  if (!mounted) {
    // Render a placeholder or null to avoid SSR/client mismatch for dynamic links
    return <nav className="flex items-center gap-3 md:gap-4 text-sm font-medium text-muted-foreground h-9 animate-pulse">
        {[...Array(5)].map((_,i) => <div key={i} className="h-5 w-16 bg-muted rounded-md"></div>)}
    </nav>; 
  }

  const navLinks = [
    { href: "/pricing", labelKey: "nav.pricing", defaultLabel: "Pricing" },
    { href: "/features", labelKey: "nav.features", defaultLabel: "Features" },
    { href: "/blog", labelKey: "nav.blog", defaultLabel: "Blog" },
    { href: "/faq", labelKey: "nav.faq", defaultLabel: "FAQ" },
    { href: "/support", labelKey: "nav.support", defaultLabel: "Support" },
  ];

  return (    
    <nav className="flex items-center gap-3 md:gap-4 text-sm font-medium text-muted-foreground">
      {navLinks.map(link => (
        <Link 
          key={link.href} 
          href={`/${currentLocale}${link.href}`} 
          className={cn(
            "hover:bg-primary/10 hover:text-primary focus-visible:bg-primary/10 focus-visible:text-primary transition-colors px-2 py-1.5 rounded-md",
            pathname === `/${currentLocale}${link.href}` && "bg-primary/10 text-primary font-semibold"
          )}
        >
          {t(link.labelKey, { defaultValue: link.defaultLabel })}
        </Link>
      ))}
    </nav>
  );
});
export default Nav;