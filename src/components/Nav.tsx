// components/Nav.tsx
'use client'

import { useState, useEffect } from 'react'; // Import hooks
import Link from 'next/link'
import { useTranslation } from 'react-i18next'
import CartDrawer from '@/components/CartDrawer' // Keep CartDrawer import

export default function Nav() {
  const { t, i18n } = useTranslation(); // Add i18n instance
  const [isHydrated, setIsHydrated] = useState(false); // State for hydration

  useEffect(() => {
    setIsHydrated(true); // Set hydrated state on client
  }, []);

  // Placeholder text while hydrating
  const placeholderText = '...';

  // Navigation links data
  const navLinks = [
    { href: "/pricing", labelKey: "nav.pricing" },
    { href: "/features", labelKey: "nav.features" },
    // { href: "/resources", labelKey: "nav.resources" }, // Resources page doesn't exist yet
    // { href: "/blog", labelKey: "nav.blog" }, // Blog page doesn't exist yet
    { href: "/faq", labelKey: "nav.faq" },
    { href: "/support", labelKey: "nav.support" },
  ];

  return (    
    <nav className="flex items-center gap-4 md:gap-6 text-sm font-medium text-muted-foreground"> {/* Adjusted gap for responsiveness */}
        {navLinks.map(link => (
          <Link key={link.href} href={link.href} className="hover:text-primary transition-colors">
            {isHydrated ? t(link.labelKey) : placeholderText}
          </Link>
        ))}
        {/* Render CartDrawer only after hydration to ensure context is available */}
        {isHydrated && <CartDrawer />}
    </nav>
  )
}

