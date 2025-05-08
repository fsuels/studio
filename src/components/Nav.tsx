// components/Nav.tsx
'use client'

import React, { useState, useEffect } from 'react'; // Import React, useState, useEffect
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

export default function Nav() {
  const { t, i18n } = useTranslation();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const placeholderText = '...';

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
        <Link key={link.href} href={`/${i18n.language}${link.href}`} className="hover:text-primary transition-colors px-1 py-1.5 sm:px-2">
          {isHydrated ? t(link.labelKey, { defaultValue: link.defaultLabel }) : placeholderText}
        </Link>
      ))}
    </nav>
  )
}
