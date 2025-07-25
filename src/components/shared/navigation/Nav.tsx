// src/components/Nav.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useParams } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';
import { ChevronDown } from 'lucide-react';

const Nav = React.memo(function Nav() {
  const { t: tHeader } = useTranslation('header');
  const pathname = usePathname() ?? '';
  const params = (useParams<{ locale?: string }>() ?? {}) as {
    locale?: string;
  };
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
    { href: '/pricing', labelKey: 'nav.pricing', defaultLabel: 'Pricing' },
    { href: '/features', labelKey: 'nav.features', defaultLabel: 'Features' },
  ];

  return (
    <nav className="flex items-center gap-3 md:gap-4 text-sm font-medium text-muted-foreground">
      {navLinks.map((link) => (
        <Link
          key={link.href}
          href={`/${currentLocale}${link.href}`}
          className={cn(
            'group border-b-2 border-transparent hover:bg-primary/10 hover:text-primary focus-visible:bg-primary/10 focus-visible:text-primary group-hover:border-[#006EFF] transition-colors px-2 py-1.5 rounded-md',
            pathname === `/${currentLocale}${link.href}` &&
              'bg-primary/10 text-primary font-semibold',
          )}
        >
          {tHeader(link.labelKey, { defaultValue: link.defaultLabel })}
        </Link>
      ))}

      <DropdownMenu>
        <DropdownMenuTrigger
          className={cn(
            'group hover:bg-primary/10 hover:text-primary focus-visible:bg-primary/10 focus-visible:text-primary transition-colors px-2 py-1.5 rounded-md text-sm font-medium text-muted-foreground flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 whitespace-nowrap',
            (pathname === `/${currentLocale}/signwell` ||
              pathname === `/${currentLocale}/online-notary`) &&
              'bg-primary/10 text-primary font-semibold',
          )}
        >
          {tHeader('nav.sign', { defaultValue: 'Sign' })}
          <ChevronDown className="ml-1 h-4 w-4 opacity-70 shrink-0 transition-transform duration-200 group-data-[state=open]:rotate-180" />
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="start"
          className="bg-popover border-border shadow-lg rounded-md"
        >
          <DropdownMenuItem
            asChild
            className="cursor-pointer hover:bg-accent focus:bg-accent"
          >
            <Link
              href={`/${currentLocale}/signwell`}
              className="w-full px-2 py-1.5 text-sm"
            >
              {tHeader('nav.eSign', { defaultValue: 'eSign' })}
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            asChild
            className="cursor-pointer hover:bg-accent focus:bg-accent"
          >
            <Link
              href={`/${currentLocale}/online-notary`}
              className="w-full px-2 py-1.5 text-sm"
            >
              {tHeader('nav.onlineNotary', { defaultValue: 'Online Notary' })}
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  );
});

export default Nav;
