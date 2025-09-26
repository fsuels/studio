// src/components/layout/Header/index.tsx
'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useParams, usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { Logo } from '@/components/layout/Logo';
import LanguageSwitcher from '@/components/shared/navigation/LanguageSwitcher';
import { cn } from '@/lib/utils';

import SmartHeaderSearch from './SmartHeaderSearch';
const HeaderUserMenu = dynamic(() => import('./HeaderUserMenu'), {
  ssr: false,
  loading: () => null,
});
import HeaderMobileMenu from './HeaderMobileMenu';
import DirectCategoryNav from './DirectCategoryNav';
import dynamic from 'next/dynamic';
const CategoryDropdown = dynamic(() => import('./CategoryDropdown'), {
  ssr: false,
});
import { ThemeToggleButton } from '@/components/ui/theme-toggle';
import { MOBILE_MENU_REOPEN_STORAGE_KEY } from './mobileMenu.constants';

const Header = React.memo(function Header() {
  const params = (useParams<{ locale?: string }>() ?? {}) as {
    locale?: 'en' | 'es';
  };
  const clientLocale = params.locale ?? 'en';
  const pathname = usePathname();
  const { t: tHeader } = useTranslation('header');

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
      const scrollPosition = window.scrollY;
      setScrolled(scrollPosition > 10);
    };

    // Initial check
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const shouldReopen = sessionStorage.getItem(MOBILE_MENU_REOPEN_STORAGE_KEY);
    if (shouldReopen === 'true') {
      setIsMobileMenuOpen(true);
      sessionStorage.removeItem(MOBILE_MENU_REOPEN_STORAGE_KEY);
    }
  }, [pathname]);

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
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50',
          'header-backdrop scroll-optimized',
          'bg-white/95 dark:bg-gray-900/95',
          'supports-[backdrop-filter]:bg-white/80 dark:supports-[backdrop-filter]:bg-gray-900/80',
          'border-b border-gray-200 dark:border-gray-700',
          'transition-all duration-300 ease-in-out',
          scrolled && [
            'shadow-lg',
            'bg-white/98 dark:bg-gray-900/98',
            'supports-[backdrop-filter]:bg-white/90 dark:supports-[backdrop-filter]:bg-gray-900/90',
            'border-gray-300 dark:border-gray-600',
          ]
        )}
        style={{ 
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          willChange: 'transform, opacity, box-shadow'
        }}
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

          {/* Mobile Actions */}
          <div className="md:hidden flex items-center gap-2">
            <HeaderMobileMenu
              clientLocale={clientLocale}
              mounted={mounted}
              isMobileMenuOpen={isMobileMenuOpen}
              onToggle={handleMobileMenuToggle}
              onClose={() => setIsMobileMenuOpen(false)}
            />
          </div>

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
            <Suspense fallback={null}>
              <LanguageSwitcher />
            </Suspense>
            <ThemeToggleButton />
            <HeaderUserMenu clientLocale={clientLocale} mounted={mounted} />
          </div>
        </div>
      </div>
      </header>

      {/* Header spacer to prevent content from going under fixed header */}
      <div className="h-16" aria-hidden="true" />

      {/* Category Dropdown (lazy-loaded to avoid bundling heavy doc library) */}
      {isMegaMenuOpen && (
        <CategoryDropdown
          locale={clientLocale}
          activeCategory={activeCategoryId}
          isOpen={isMegaMenuOpen}
          onLinkClick={() => {
            setIsMegaMenuOpen(false);
            setActiveCategoryId(null);
          }}
        />
      )}
    </>
  );
});

export default Header;
