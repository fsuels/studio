// components/Nav.tsx
'use client';

import React, { useState, useEffect } from 'react'; // Import React, useState, useEffect
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';

export default function Nav() {
  const { t } = useTranslation();
  const pathname = usePathname(); // e.g. "/en/pricing", "/es/docs/…"
  const [locale, setLocale] = useState<'en'|'es'>('en');
  const [mounted, setMounted] = useState(false);

  // Only run on client once
  useEffect(() => {
    setMounted(true);
    const segments = pathname.split('/');
    const pathLocale = segments[1];
    if (pathLocale === 'es') {
      setLocale('es');
    } else {
      setLocale('en'); // Default to 'en' if not 'es' or if segment is missing/different
    }
  }, [pathname]);

  if (!mounted) {
    // Render a placeholder or null to prevent SSR/client mismatch
    // For a nav, rendering null is often acceptable as it won't cause major layout shifts if CSS is handled well.
    return <nav className="flex items-center gap-3 md:gap-4 text-sm font-medium text-muted-foreground h-8"></nav>; // Placeholder with height
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
        <Link key={link.href} href={`/${locale}${link.href}`} className="hover:text-primary transition-colors px-1 py-1.5 sm:px-2">
          {t(link.labelKey, { defaultValue: link.defaultLabel })}
        </Link>
      ))}
    </nav>
  );
}
