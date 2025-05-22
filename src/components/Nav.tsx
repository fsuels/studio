// src/components/Nav.tsx
'use client';

import React, { useState, useEffect } from 'react'; 
import Link from 'next/link';
import { usePathname, useParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

const Nav = React.memo(function Nav() {
  // switch to the 'header' namespace
  const { t: tHeader, i18n } = useTranslation("common");
  const pathname = usePathname(); 
  const params = useParams();
  const [currentLocale, setCurrentLocale] = useState<'en' | 'es'>('en');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const pathLocale = params.locale as 'en' | 'es' | undefined;
    if (pathLocale && ['en', 'es'].includes(pathLocale)) {
      setCurrentLocale(pathLocale);
    } else if (pathname === '/') {
      setCurrentLocale('en');
    }
    // language change is handled elsewhere (layout)
  }, [pathname, params.locale]);

  if (!mounted) {
    return (
      <nav className="flex items-center gap-3 md:gap-4 text-sm font-medium text-muted-foreground h-9 animate-pulse">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-5 w-16 bg-muted rounded-md" />
        ))}
      </nav>
    );
  }

  const navLinks = [
    { href: "/pricing", labelKey: "nav.pricing", defaultLabel: "Pricing" },
    { href: "/features", labelKey: "nav.features", defaultLabel: "Features" },
    { href: "/blog", labelKey: "nav.blog", defaultLabel: "Blog" },
    { href: "/faq", labelKey: "nav.faq", defaultLabel: "FAQ" },
    { href: "/support", labelKey: "nav.support", defaultLabel: "Support" },
    { href: "/signwell", labelKey: "nav.sign", hoverLabelKey: "nav.esign", defaultLabel: "Sign" },
  ];

  return (
    <nav className="flex items-center gap-3 md:gap-4 text-sm font-medium text-muted-foreground">
      {navLinks.map(link => (
        <Link
          key={link.href}
          href={`/${currentLocale}${link.href}`}
          className={cn(
            "group hover:bg-primary/10 hover:text-primary focus-visible:bg-primary/10 focus-visible:text-primary transition-colors px-2 py-1.5 rounded-md",
            pathname === `/${currentLocale}${link.href}` && "bg-primary/10 text-primary font-semibold"
          )}
        >
          {link.hoverLabelKey ? (
            <>
              <span className="group-hover:hidden">
                {tHeader(link.labelKey, { defaultValue: link.defaultLabel })}
              </span>
              <span className="hidden group-hover:inline">
                {tHeader(link.hoverLabelKey, { defaultValue: link.defaultLabel })}
              </span>
            </>
          ) : (
            tHeader(link.labelKey, { defaultValue: link.defaultLabel })
          )}
        </Link>
      ))}
    </nav>
  );
});

export default Nav;
