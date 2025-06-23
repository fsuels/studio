// src/components/layout/Header/index.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Logo } from '@/components/layout/Logo';
import LanguageSwitcher from '@/components/shared/navigation/LanguageSwitcher';
import { cn } from '@/lib/utils';

import SmartHeaderSearch from './SmartHeaderSearch';
import HeaderUserMenu from './HeaderUserMenu';
import HeaderMegaMenu from './HeaderMegaMenu';
import HeaderMobileMenu from './HeaderMobileMenu';
import DirectCategoryNav from './DirectCategoryNav';
import CategoryDropdown from './CategoryDropdown';
import { ThemeToggleButton } from '@/components/ui/theme-toggle';

const Header = React.memo(function Header() {
  const params = (useParams<{ locale?: string }>() ?? {}) as {
    locale?: 'en' | 'es';
  };
  const clientLocale = params.locale ?? 'en';

  // Component state
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);

  // Mount and scroll effects
  useEffect(() => {
    setMounted(true);

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when mega menu opens
  useEffect(() => {
    if (isMegaMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  }, [isMegaMenuOpen]);

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen((prev) => !prev);
    if (isMegaMenuOpen) {
      setIsMegaMenuOpen(false);
      setActiveCategoryId(null);
    }
  };

  const handleCategorySelect = (categoryId: string) => {
    if (activeCategoryId === categoryId && isMegaMenuOpen) {
      // Close if clicking the same category
      setIsMegaMenuOpen(false);
      setActiveCategoryId(null);
    } else {
      // Open new category
      setActiveCategoryId(categoryId);
      setIsMegaMenuOpen(true);
      if (isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    }
  };

  return (
    <div className="relative">
      <header
        className={cn(
          'sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border/40 transition-all duration-300',
          scrolled && 'shadow-sm border-border/60',
        )}
      >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Logo */}
          <div className="flex items-center gap-4">
            <Logo />
          </div>

          {/* Desktop Search */}
          <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
            <SmartHeaderSearch clientLocale={clientLocale} mounted={mounted} />
          </div>

          {/* Mobile menu toggle */}
          <HeaderMobileMenu
            clientLocale={clientLocale}
            mounted={mounted}
            isMobileMenuOpen={isMobileMenuOpen}
            onToggle={handleMobileMenuToggle}
            onClose={() => setIsMobileMenuOpen(false)}
          />

          {/* Direct Category Navigation */}
          <div className="hidden md:flex items-center flex-1 justify-center">
            <DirectCategoryNav
              clientLocale={clientLocale}
              mounted={mounted}
              onCategorySelect={handleCategorySelect}
              activeCategoryId={activeCategoryId}
            />
          </div>

          {/* Right side actions */}
          <div className="hidden md:flex items-center gap-3">
            <LanguageSwitcher />
            <ThemeToggleButton />
            <HeaderUserMenu clientLocale={clientLocale} mounted={mounted} />
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-3">
          <SmartHeaderSearch
            clientLocale={clientLocale}
            mounted={mounted}
            className="w-full"
          />
        </div>
      </div>
      </header>

      {/* Category Dropdown */}
      <CategoryDropdown
        locale={clientLocale}
        activeCategory={activeCategoryId}
        isOpen={isMegaMenuOpen}
        onLinkClick={() => {
          setIsMegaMenuOpen(false);
          setActiveCategoryId(null);
        }}
      />
    </div>
  );
});

export default Header;
