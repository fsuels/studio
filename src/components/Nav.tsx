// components/Nav.tsx
'use client';

import React, { useState, useEffect } from 'react'; 
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';

export default function Nav() {
  const { t } = useTranslation();
  const pathname = usePathname(); 
  const [locale, setLocale] = useState<'en'|'es'>('en');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const segments = pathname.split('/');
    const pathLocale = segments[1] as 'en' | 'es' | undefined;
    if (pathLocale && ['en', 'es'].includes(pathLocale)) {
      setLocale(pathLocale);
    } else {
      setLocale('en'); 
    }
  }, [pathname]);

  if (!mounted) {
    return <nav className="flex items-center gap-3 md:gap-4 text-sm font-medium text-muted-foreground h-8"></nav>; 
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
          href={`/${locale}${link.href}`} 
          className="hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground transition-colors px-2 py-1.5 rounded-md" // Updated classes
        >
          {t(link.labelKey, { defaultValue: link.defaultLabel })}
        </Link>
      ))}
    </nav>
  );
}
