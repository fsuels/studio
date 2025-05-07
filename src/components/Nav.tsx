// components/Nav.tsx
'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
// Removed DropdownMenu related imports as they are no longer used here

export default function Nav() {
  const { t, i18n } = useTranslation();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const placeholderText = '...';

  const navLinks = [
    { href: "/pricing", labelKey: "nav.pricing" },
    { href: "/features", labelKey: "nav.features" },
    // { href: "/resources", labelKey: "nav.resources" }, // Resources page doesn't exist yet
    { href: "/blog", labelKey: "nav.blog" },
    { href: "/faq", labelKey: "nav.faq" },
    { href: "/support", labelKey: "nav.support" },
  ];

  return (    
    <nav className="flex items-center gap-3 md:gap-4 text-sm font-medium text-muted-foreground">
      {/* Removed the DropdownMenu for "Make Documents" as it's handled by the MegaMenu Popover in Header.tsx */}
      
      {navLinks.map(link => (
        <Link key={link.href} href={link.href} className="hover:text-primary transition-colors px-1 py-1.5 sm:px-2">
          {isHydrated ? t(link.labelKey) : placeholderText}
        </Link>
      ))}
    </nav>
  )
}
