// components/Nav.tsx
'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from '@/components/ui/button';
import { ChevronDown, FileText } from 'lucide-react'; // Added ChevronDown for dropdown
import { CATEGORY_LIST } from '@/components/Step1DocumentSelector'; // Assuming CATEGORY_LIST is exported from here or a shared location

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
    { href: "/blog", labelKey: "nav.blog" },
    { href: "/faq", labelKey: "nav.faq" },
    { href: "/support", labelKey: "nav.support" },
  ];

  // Sort categories by translated label for the dropdown
  const sortedCategories = [...CATEGORY_LIST].sort((a, b) =>
    isHydrated ? t(a.labelKey, a.key).localeCompare(t(b.labelKey, b.key), i18n.language) : 0
  );

  return (    
    <nav className="flex items-center gap-3 md:gap-4 text-sm font-medium text-muted-foreground">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="text-sm font-medium flex items-center gap-1 px-2 hover:text-primary" disabled={!isHydrated}>
            {isHydrated ? t('nav.documentCategories', 'Document Categories') : placeholderText}
            <ChevronDown className="h-4 w-4 opacity-70" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56 max-h-80 overflow-y-auto">
          <DropdownMenuLabel className="text-xs px-2 py-1.5 text-muted-foreground">{isHydrated ? t('nav.documentCategories', 'Document Categories') : placeholderText}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {isHydrated && sortedCategories.map(cat => (
            <DropdownMenuItem key={cat.key} asChild className="cursor-pointer">
              <Link href={`/?category=${encodeURIComponent(cat.key)}#workflow-start`} className="flex items-center gap-2 w-full">
                {React.createElement(cat.icon || FileText, { className: "h-4 w-4 text-muted-foreground" })}
                <span>{t(cat.labelKey, cat.key)}</span>
              </Link>
            </DropdownMenuItem>
          ))}
          {!isHydrated && <DropdownMenuItem disabled>{placeholderText}</DropdownMenuItem>}
        </DropdownMenuContent>
      </DropdownMenu>

      {navLinks.map(link => (
        <Link key={link.href} href={link.href} className="hover:text-primary transition-colors px-1 py-1.5 sm:px-2">
          {isHydrated ? t(link.labelKey) : placeholderText}
        </Link>
      ))}
    </nav>
  )
}