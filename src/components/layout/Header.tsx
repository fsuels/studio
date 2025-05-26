// src/components/layout/Header.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { Logo } from '@/components/layout/Logo';
// Import navigation components statically so they are loaded with the initial
// bundle instead of on-demand. This reduces the delay when navigating between
// pages.
import Nav from '@/components/Nav';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { ChevronDown, UserPlus, LogIn, Search as SearchIcon, ExternalLink, FileText, Menu as MenuIcon, X as CloseIcon, LayoutGrid, ChevronUp, LogOut, UserCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import type { LegalDocument } from '@/lib/document-library';
import { CATEGORY_LIST } from '@/components/Step1DocumentSelector';
import MegaMenuContent from '@/components/mega-menu/MegaMenuContent';

import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { getDocTranslation } from '@/lib/i18nUtils';

const Header = React.memo(function Header() {
  // Scoped translations
  const { t: tHeader } = useTranslation("header");
  const router = useRouter();
  const params = (useParams<{ locale?: string }>() ?? {}) as { locale?: string };
  const { isLoggedIn, logout, user } = useAuth(); // Added user from useAuth

  // Locale setup
  const [clientLocale, setClientLocale] = useState<'en' | 'es'>('en');
  useEffect(() => {
    const pathLocale = params.locale as 'en' | 'es' | undefined;
    const newLocale = pathLocale && ['en','es'].includes(pathLocale) ? pathLocale : 'en';
    setClientLocale(newLocale);
    // i18n.changeLanguage is handled in LanguageSwitcher and I18nClientProvider
  }, [params.locale]);

  // Search state
  const [mounted, setMounted] = useState(false);
  const [documentLibrary, setDocumentLibrary] = useState<LegalDocument[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<LegalDocument[]>([]);
  const [showResults, setShowResults] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchResultsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    import('@/lib/document-library').then((mod) => {
      setDocumentLibrary(mod.documentLibrary);
    });
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const performSearch = () => {
      if (searchQuery.trim().length > 1) {
        const lower = searchQuery.toLowerCase();
        const results = documentLibrary.filter(doc => {
          if (doc.id === 'general-inquiry') return false; // Exclude general inquiry
          const translatedDoc = getDocTranslation(doc, clientLocale);
          
          const name = translatedDoc.name || ''; // Fallback to empty string
          const desc = translatedDoc.description || ''; // Fallback to empty string
          const aliases = translatedDoc.aliases || []; // Fallback to empty array

          return (
            name.toLowerCase().includes(lower) ||
            (desc && desc.toLowerCase().includes(lower)) || // Check if desc is not empty before toLowerCase
            aliases.some(a => a.toLowerCase().includes(lower))
          );
        });
        setSearchResults(results.slice(0,5));
        setShowResults(true);
      } else {
        setSearchResults([]);
        setShowResults(false);
      }
    };
    const id = setTimeout(performSearch, 300);
    return () => clearTimeout(id);
  }, [searchQuery, clientLocale, mounted, documentLibrary]);

  // Click outside to close search results
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (
        searchResultsRef.current &&
        !searchResultsRef.current.contains(e.target as Node) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(e.target as Node)
      ) {
        setShowResults(false);
      }
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  // Handlers
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/${clientLocale}/?search=${encodeURIComponent(searchQuery)}#workflow-start`);
    }
    setSearchQuery(''); setShowResults(false);
    setIsMobileMenuOpen(false); setIsMegaMenuOpen(false);
  };
  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
    router.push(`/${clientLocale}/`);
  };

  // UI toggles
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false);
  const [showMobileCategories, setShowMobileCategories] = useState(false);

  const placeholderSearch = mounted
    ? tHeader('nav.searchPlaceholder', { defaultValue: 'Search documents...' })
    : '...';

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 overflow-visible">
      <div className="container flex h-14 items-center px-4 md:px-6">
        <div className="mr-auto md:mr-4 flex items-center">
          <Logo wrapperClassName="items-center self-center mr-2 md:mr-4" svgClassName="h-6 w-6 md:h-7 md:w-7" textClassName="text-xs md:text-sm" />
        </div>

        {/* Desktop Nav */}
        <div className="hidden md:flex flex-1 items-center justify-start">
          <Nav />
        </div>

        <nav className="hidden md:flex items-center gap-2 ml-auto">
          {/* Mega-menu */}
          <Popover open={isMegaMenuOpen} onOpenChange={setIsMegaMenuOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="default" size="sm"
                className={cn(
                  'text-sm font-medium flex items-center gap-1 px-3 h-9 bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-primary focus-visible:ring-2 focus-visible:ring-offset-2',
                  isMegaMenuOpen && 'bg-primary/80'
                )}
                disabled={!mounted}
                aria-expanded={isMegaMenuOpen}
              >
                <LayoutGrid className="h-4 w-4" />
                {mounted ? tHeader('nav.makeDocuments', { defaultValue: 'Make Documents' }) : '...'}
                {isMegaMenuOpen ? <ChevronUp className="h-4 w-4 opacity-70" /> : <ChevronDown className="h-4 w-4 opacity-70" />}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              align="center"
              side="bottom"
              sideOffset={12} // Slight offset from the trigger
              className="
                w-[calc(100vw-4rem)] md:w-[calc(100vw-8rem)] lg:w-[calc(100vw-12rem)] xl:w-[1280px] // Responsive width
                max-w-[90vw] md:max-w-7xl // Ensure it doesn't exceed viewport greatly
                bg-popover
                p-0 // Remove padding, content will handle it
                rounded-lg
                shadow-xl
                z-[60]
                overflow-hidden
              "
            >
              <MegaMenuContent
                categories={CATEGORY_LIST}
                documents={documentLibrary}
                onLinkClick={() => {
                  setIsMegaMenuOpen(false);
                  setIsMobileMenuOpen(false);
                  setShowMobileCategories(false);
                }}
              />
            </PopoverContent>
          </Popover>

          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <Input
              ref={searchInputRef}
              type="search"
              placeholder={placeholderSearch}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onFocus={() => searchQuery.trim().length > 1 && searchResults.length > 0 && setShowResults(true)}
              className="h-9 pl-10 text-sm rounded-md w-40 md:w-56 bg-background border-input focus:border-primary focus-visible:ring-primary focus-visible:ring-2 focus-visible:ring-offset-2"
              disabled={!mounted}
              aria-label={placeholderSearch}
            />
            {showResults && searchResults.length > 0 && (
              <div
                ref={searchResultsRef}
                className="absolute top-full mt-2 w-full md:w-72 max-h-80 overflow-y-auto bg-popover border border-border rounded-md shadow-lg z-[70]"
              >
                <ul>
                  {searchResults.map(doc => {
                    const translatedDoc = getDocTranslation(doc, clientLocale);
                    const docName = translatedDoc.name;
                    return (
                      <li key={doc.id}>
                        <Link
                          href={`/${clientLocale}/docs/${doc.id}`}
                          className="flex items-center gap-2 px-3 py-2.5 text-sm text-popover-foreground hover:bg-accent hover:text-accent-foreground transition-colors w-full text-left"
                          prefetch
                        >
                          <FileText className="h-4 w-4 shrink-0 text-muted-foreground"/>
                          <span className="truncate">
                            {docName}
                          </span>
                          <ExternalLink className="h-3 w-3 ml-auto text-muted-foreground/70"/>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </form>

          {/* Language switcher */}
          {mounted && <LanguageSwitcher />}

          {/* Auth buttons */}
          {mounted && (isLoggedIn && user ? ( // Check if user object exists
            <>
              <Button
                variant="ghost" size="sm"
                className="text-xs font-medium px-2 py-1.5 md:px-3 h-9 md:h-8 hover:bg-muted focus-visible:ring-primary focus-visible:ring-2 focus-visible:ring-offset-2 flex items-center"
                asChild
              >
                <Link href={`/${clientLocale}/dashboard`}>
                  <UserCircle className="h-4 w-4 mr-1 md:mr-2" /> {tHeader('My Account')}
                </Link>
              </Button>
              <Button
                variant="outline" size="sm"
                onClick={handleLogout}
                className="text-xs font-medium px-2 py-1.5 md:px-3 h-9 md:h-8 hover:bg-muted focus-visible:ring-primary focus-visible:ring-2 focus-visible:ring-offset-2"
              >
                <LogOut className="h-4 w-4 mr-1 md:mr-2" /> {tHeader('Logout')}
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="ghost" size="sm"
                className="text-xs font-medium text-foreground/80 hover:bg-muted px-2 py-1.5 md:px-3 h-9 md:h-8 flex items-center focus-visible:ring-primary focus-visible:ring-2 focus-visible:ring-offset-2"
                asChild
              >
                <Link href={`/${clientLocale}/signup`}>
                  <UserPlus className="h-4 w-4 mr-1 md:mr-2" />
                  <span className="hidden sm:inline">{tHeader('Sign Up')}</span>
                </Link>
              </Button>
              <Button
                variant="default" size="sm"
                className="text-xs font-medium px-2 py-1.5 md:px-3 h-9 md:h-8 shadow-sm bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-primary focus-visible:ring-2 focus-visible:ring-offset-2"
                asChild
              >
                <Link href={`/${clientLocale}/signin`}>
                  <LogIn className="h-4 w-4 mr-1 md:mr-2" />
                  <span className="hidden sm:inline">{tHeader('Sign In')}</span>
                </Link>
              </Button>
            </>
          ))}
        </nav>

        {/* Mobile menu toggle */}
        <div className="md:hidden ml-auto flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 focus-visible:ring-primary focus-visible:ring-2 focus-visible:ring-offset-2"
            onClick={() => setIsMobileMenuOpen(v => !v)}
            disabled={!mounted}
            aria-label={isMobileMenuOpen ? tHeader('nav.closeMenu', { defaultValue: 'Close menu' }) : tHeader('nav.openMenu', { defaultValue: 'Open menu' })}
          >
            {isMobileMenuOpen ? <CloseIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu content */}
      {isMobileMenuOpen && mounted && (
        <div className="md:hidden absolute top-14 left-0 right-0 bg-background shadow-lg border-t border-border p-4 space-y-4 animate-fade-in z-[60] max-h-[calc(100vh-3.5rem)] overflow-y-auto">
          {/* Mobile search */}
          <form onSubmit={handleSearchSubmit} className="relative flex items-center w-full">
            <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <Input
              ref={searchInputRef}
              type="search"
              placeholder={placeholderSearch}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onFocus={() => searchQuery.trim().length > 1 && searchResults.length > 0 && setShowResults(true)}
              className="h-10 pl-10 text-sm rounded-md w-full bg-muted border-input focus:border-primary focus-visible:ring-primary focus-visible:ring-2 focus-visible:ring-offset-2"
              disabled={!mounted}
              aria-label={placeholderSearch}
            />
            {showResults && searchResults.length > 0 && (
              <div
                ref={searchResultsRef}
                className="absolute top-full mt-1 w-full max-h-60 overflow-y-auto bg-popover border border-border rounded-md shadow-lg z-[70]"
              >
                <ul>
                  {searchResults.map(doc => {
                    const translatedDoc = getDocTranslation(doc, clientLocale);
                    const docName = translatedDoc.name;
                    return (
                      <li key={doc.id}>
                        <Link
                          href={`/${clientLocale}/docs/${doc.id}`}
                          className="flex items-center gap-2 px-3 py-2.5 text-sm text-popover-foreground hover:bg-accent hover:text-accent-foreground transition-colors w-full text-left"
                          prefetch
                        >
                          <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                          <span className="truncate">{docName}</span>
                          <ExternalLink className="h-3 w-3 ml-auto text-muted-foreground/70" />
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </form>

          {/* Mobile categories toggle */}
          <Button
            variant="ghost"
            className="w-full justify-between text-base font-medium flex items-center gap-2 px-2 py-3 hover:bg-muted group focus-visible:ring-primary focus-visible:ring-2 focus-visible:ring-offset-2"
            onClick={() => setShowMobileCategories(v => !v)}
            aria-expanded={showMobileCategories}
            data-state={showMobileCategories ? 'open' : 'closed'}
            disabled={!mounted}
          >
            <div className="flex items-center gap-2">
              <LayoutGrid className="h-5 w-5 text-muted-foreground group-data-[state=open]:text-primary" />
              {mounted ? tHeader('nav.makeDocuments', { defaultValue: 'Make Documents' }) : '...'}
            </div>
            {showMobileCategories ? <ChevronUp className="h-5 w-5 opacity-70" /> : <ChevronDown className="h-5 w-5 opacity-70" />}
          </Button>
          {showMobileCategories && (
            <div className="pl-4 mt-0 border-l-2 border-muted/70">
              <MegaMenuContent
                categories={CATEGORY_LIST}
                documents={documentLibrary}
                onLinkClick={() => {
                  setIsMegaMenuOpen(false);
                  setIsMobileMenuOpen(false);
                  setShowMobileCategories(false);
                }}
              />
            </div>
          )}

          {/* Mobile footer links */}
          <div className="border-t border-border pt-4 space-y-1">
            {[
              { href: '/pricing', labelKey: 'nav.pricing', defaultLabel: 'Pricing' },
              { href: '/features', labelKey: 'nav.features', defaultLabel: 'Features' },
              { href: '/signwell', labelKey: 'nav.sign', defaultLabel: 'Sign' },
              { href: '/online-notary', labelKey: 'nav.onlineNotary', defaultLabel: 'Online Notary' },
              { href: '/blog', labelKey: 'nav.blog', defaultLabel: 'Blog' },
              { href: '/faq', labelKey: 'nav.faq', defaultLabel: 'FAQ' },
              { href: '/support', labelKey: 'nav.support', defaultLabel: 'Support' },
            ].map(link => (
              <Button
                key={link.href}
                variant="ghost" asChild
                className="w-full justify-start text-base py-3 hover:bg-muted focus-visible:ring-primary focus-visible:ring-2 focus-visible:ring-offset-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Link href={`/${clientLocale}${link.href}`}>
                  {mounted
                    ? tHeader(link.labelKey, { defaultValue: link.defaultLabel })
                    : '...'}
                </Link>
              </Button>
            ))}
          </div>

          {/* Language */}
          <div className="border-t pt-4 flex items-center gap-2">
            {mounted && <LanguageSwitcher />}
          </div>

          {/* Mobile auth */}
          <div className="border-t border-border pt-4 space-y-2">
            {isLoggedIn && user ? ( // Check if user object exists
              <>
                <Button
                  variant="ghost" size="sm"
                  className="w-full justify-start text-base py-3 hover:bg-muted focus-visible:ring-primary focus-visible:ring-2 focus-visible:ring-offset-2"
                  asChild
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                <Link href={`/${clientLocale}/dashboard`}>
                    <UserCircle className="h-5 w-5 mr-2" /> {tHeader('My Account')}
                  </Link>
                </Button>
                <Button
                  variant="outline" size="sm"
                  onClick={handleLogout}
                  className="w-full justify-start text-base py-3 hover:bg-muted focus-visible:ring-primary focus-visible:ring-2 focus-visible:ring-offset-2"
                >
                  <LogOut className="h-5 w-5 mr-2" /> {tHeader('Logout')}
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost" size="sm"
                  className="w-full justify-start text-base py-3 hover:bg-muted focus-visible:ring-primary focus-visible:ring-2 focus-visible:ring-offset-2"
                  asChild
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Link href={`/${clientLocale}/signup`}>
                    <UserPlus className="h-5 w-5 mr-2" />
                    {mounted ? tHeader('Sign Up') : '...'}
                  </Link>
                </Button>
                <Button
                  variant="default" size="sm"
                  className="w-full justify-start text-base py-3 bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:ring-primary focus-visible:ring-2 focus-visible:ring-offset-2"
                  asChild
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Link href={`/${clientLocale}/signin`}>
                    <LogIn className="h-5 w-5 mr-2" />
                    {mounted ? tHeader('Sign In') : '...'}
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      )}

    </header>
  );
});

export default Header;

// Helper to get localized document name, description, and aliases
// Moved from SearchBar as it's more generic
export const getLocalizedDocStrings = (doc: LegalDocument, locale: 'en' | 'es') => {
  let name = doc.name;
  let description = doc.description;
  let aliases: string[] = doc.aliases || [];

  if (locale === 'es') {
    name = doc.name_es || doc.name;
    description = doc.description_es || doc.description;
    aliases = doc.aliases_es || doc.aliases || [];
  }
  return { name, description, aliases };
};
