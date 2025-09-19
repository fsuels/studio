// src/components/layout/Header/index.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { Logo } from '@/components/layout/Logo';
import LanguageSwitcher from '@/components/shared/navigation/LanguageSwitcher';
import { cn } from '@/lib/utils';

import SmartHeaderSearch from './SmartHeaderSearch';
const HeaderUserMenu = dynamic(() => import('./HeaderUserMenu'), {
  ssr: false,
  loading: () => null,
});
import HeaderMegaMenu from './HeaderMegaMenu';
import HeaderMobileMenu from './HeaderMobileMenu';
import DirectCategoryNav from './DirectCategoryNav';
import dynamic from 'next/dynamic';
const CategoryDropdown = dynamic(() => import('./CategoryDropdown'), {
  ssr: false,
});
import { ThemeToggleButton } from '@/components/ui/theme-toggle';

const Header = React.memo(function Header() {
  const params = (useParams<{ locale?: string }>() ?? {}) as {
    locale?: 'en' | 'es';
  };
  const clientLocale = params.locale ?? 'en';
  const router = useRouter();
  const { t: tHeader } = useTranslation('header');
  const aiFinderDestination = `/${clientLocale}/marketplace`;

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

  // Close mobile menu when mega menu opens
  useEffect(() => {
    if (isMegaMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  }, [isMegaMenuOpen]);

  useEffect(() => {
    router.prefetch(aiFinderDestination);
  }, [aiFinderDestination, router]);

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
            {/* Mobile AI Document Finder Button */}
            <button
              onClick={() => router.push(aiFinderDestination)}
              className="inline-flex items-center gap-1 px-2 py-1.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-medium rounded-md shadow-sm hover:shadow-md hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
              title="🤖 AI Document Finder"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <span>AI</span>
            </button>
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
            {/* AI Document Finder Button */}
            <button
              onClick={() => router.push(aiFinderDestination)}
              className="ai-finder-btn group relative inline-flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium rounded-lg shadow-sm hover:shadow-md hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
              title="🤖 AI Document Finder - Describe what you need and let AI find the perfect document!"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              <span className="hidden lg:inline">
                {tHeader('aiFinder', { defaultValue: 'AI Finder' })}
              </span>
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
            </button>
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
