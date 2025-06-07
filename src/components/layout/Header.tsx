// src/components/layout/Header.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { Logo } from '@/components/layout/Logo';
// Import navigation components statically so they are included in the main bundle
// instead of on-demand. This reduces the delay when navigating between
// pages.
import Nav from '@/components/Nav';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import dynamic from 'next/dynamic';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import {
  ChevronDown,
  UserPlus,
  LogIn,
  Search as SearchIcon,
  ExternalLink,
  FileText,
  Menu as MenuIcon,
  X as CloseIcon,
  LayoutGrid,
  ChevronUp,
  LogOut,
  UserCircle,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import type { LegalDocument } from '@/lib/document-library';
import { CATEGORY_LIST } from '@/components/Step1DocumentSelector';
// Load expensive menu components only when needed
const MegaMenuContent = dynamic(() => import('@/components/mega-menu/MegaMenuContent'));
const MobileDocsAccordion = dynamic(() => import('@/components/mobile/MobileDocsAccordion'));

import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { getDocTranslation } from '@/lib/i18nUtils';

const Header = React.memo(function Header() {
  // Scoped translations
  const { t: tHeader } = useTranslation('header');
  const router = useRouter();
  const params = (useParams<{ locale?: string }>() ?? {}) as {
    locale?: string;
  };
  const { isLoggedIn, logout, user } = useAuth(); // Added user from useAuth

  // Locale setup
  const [clientLocale, setClientLocale] = useState<'en' | 'es'>('en');
  useEffect(() => {
    const pathLocale = params.locale as 'en' | 'es' | undefined;
    const newLocale =
      pathLocale && ['en', 'es'].includes(pathLocale) ? pathLocale : 'en';
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
        const results = documentLibrary.filter((doc) => {
          if (doc.id === 'general-inquiry') return false; // Exclude general inquiry
          const translatedDoc = getDocTranslation(doc, clientLocale);

          const name = translatedDoc.name || ''; // Fallback to empty string
          const desc = translatedDoc.description || ''; // Fallback to empty string
          const aliases = translatedDoc.aliases || []; // Fallback to empty array

          return (
            name.toLowerCase().includes(lower) ||
            (desc && desc.toLowerCase().includes(lower)) || // Check if desc is not empty before toLowerCase
            aliases.some((a) => a.toLowerCase().includes(lower))
          );
        });
        setSearchResults(results.slice(0, 5));
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
      router.push(
        `/${clientLocale}/?search=${encodeURIComponent(searchQuery)}#workflow-start`,
      );
    }
    setSearchQuery('');
    setShowResults(false);
    setIsMobileMenuOpen(false);
    setIsMegaMenuOpen(false);
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
  const [scrolled, setScrolled] = useState(false);

  // Auto-expand "Make Documents" accordion on initial render for mobile screens
  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth <= 768) {
      setShowMobileCategories(true);
    }
  }, []);

  const placeholderSearch = mounted
    ? tHeader('nav.searchPlaceholder', { defaultValue: 'Search documents...' })
    : '...';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    handleScroll(); // Check on mount
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="sticky top-0 z-50">
      <header
        className={cn(
          'header w-full border-b border-border/40 overflow-visible transition-shadow duration-300 ease-in-out shadow-sm',
          scrolled
            ? 'bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-lg'
            : 'bg-background',
        )}
      >
        <div
          className={cn(
            'container relative flex items-center justify-between px-4 md:px-6 transition-all duration-200 ease-in-out',
            scrolled ? 'h-12 py-3' : 'h-14 py-3',
          )}
        >
        <div className="flex items-center flex-shrink-0">
          <Logo
            wrapperClassName={cn(
              'items-center self-center mr-2 md:mr-4 transition-all duration-200 ease-in-out',
            )}
            svgClassName={cn(
              'h-7 w-7 md:h-9 md:w-9 transition-all duration-200 ease-in-out',
              scrolled && 'h-6 w-6 md:h-8 md:w-8',
            )}
            textClassName={cn(
              'text-xs md:text-sm transition-all duration-200 ease-in-out',
              scrolled && 'text-[0.65rem] md:text-xs',
            )}
          />
        </div>

        {/* Mobile menu toggle */}
        <div className="md:hidden flex items-center">
          <Button
            variant="default"
            size="icon"
            className="p-2 bg-primary text-white shadow-md rounded-md focus-visible:ring-primary focus-visible:ring-2 focus-visible:ring-offset-2"
            onClick={() => setIsMobileMenuOpen((v) => !v)}
            disabled={!mounted}
            aria-label={
              isMobileMenuOpen
                ? tHeader('nav.closeMenu', { defaultValue: 'Close menu' })
                : tHeader('nav.openMenu', { defaultValue: 'Open menu' })
            }
          >
            {isMobileMenuOpen ? (
              <CloseIcon className="h-5 w-5" />
            ) : (
              <MenuIcon className="h-5 w-5" />
            )}
          </Button>
        </div>

        {/* Desktop Nav */}
        <div
          className={cn(
            'hidden md:flex flex-1 justify-center items-center transition-opacity duration-200 ease-in-out',
            scrolled && 'opacity-60',
          )}
        >
          <Nav />
        </div>

        <nav className="hidden md:flex items-center justify-end gap-3 md:gap-4 flex-shrink-0">
          {/* Mega-menu */}
          <Popover open={isMegaMenuOpen} onOpenChange={setIsMegaMenuOpen}>
            <PopoverTrigger asChild>
              <Button
                className={cn(
                  'bg-gradient-to-r from-[#006EFF] to-[#00C3A3] hover:from-[#0057CC] hover:to-[#00A38A] text-white px-3 py-1.5 rounded-md font-semibold text-sm flex items-center gap-1 drop-shadow-lg focus-visible:ring-2 focus-visible:ring-offset-2 whitespace-nowrap',
                  isMegaMenuOpen && 'from-[#0057CC] to-[#00A38A]',
                )}
                disabled={!mounted}
                aria-expanded={isMegaMenuOpen}
              >
                <LayoutGrid className="h-4 w-4" />
                {mounted
                  ? tHeader('nav.makeDocuments', {
                      defaultValue: 'Make Documents',
                    })
                  : '...'}
                {isMegaMenuOpen ? (
                  <ChevronUp className="h-4 w-4 opacity-70" />
                ) : (
                  <ChevronDown className="h-4 w-4 opacity-70" />
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              align="center"
              side="bottom"
              sideOffset={12}
              className="
                w-[calc(100vw-4rem)] md:w-[calc(100vw-8rem)] lg:w-[calc(100vw-12rem)] xl:w-[1280px]
                max-w-[90vw] md:max-w-7xl
                bg-popover
                p-0 
                rounded-lg
                shadow-xl
                z-[60]
                overflow-hidden
              "
            >
              <MegaMenuContent
                categories={CATEGORY_LIST}
                documents={documentLibrary}
                defaultOpenCategories={['Finance']}
                onLinkClick={() => {
                  setIsMegaMenuOpen(false);
                  setIsMobileMenuOpen(false);
                  setShowMobileCategories(false);
                }}
              />
            </PopoverContent>
          </Popover>

          {/* Search Form */}
          <form
            onSubmit={handleSearchSubmit}
            className="relative flex items-center"
          >
            <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
            <Input
              ref={searchInputRef}
              type="search"
              placeholder={placeholderSearch}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() =>
                searchQuery.trim().length > 1 &&
                searchResults.length > 0 &&
                setShowResults(true)
              }
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
                  {searchResults.map((doc) => {
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

          {/* Language switcher */}
          {mounted && <LanguageSwitcher />}

          {/* Auth buttons */}
          {mounted &&
            (isLoggedIn && user ? ( 
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-sm font-medium px-3 h-9 hover:bg-muted focus-visible:ring-primary focus-visible:ring-2 focus-visible:ring-offset-2 flex items-center"
                  asChild
                >
                  <Link href={`/${clientLocale}/dashboard`}>
                    <UserCircle className="h-4 w-4 mr-1 md:mr-2" />
                    {tHeader('My Account')}
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="text-sm font-medium px-3 h-9 hover:bg-muted focus-visible:ring-primary focus-visible:ring-2 focus-visible:ring-offset-2"
                >
                  <LogOut className="h-4 w-4 mr-1 md:mr-2" />
                  {tHeader('Logout')}
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="text-sm font-medium px-3 h-9 border-primary text-primary hover:bg-primary/10 hover:text-primary focus-visible:ring-primary"
                >
                  <Link href={`/${clientLocale}/signup`}>
                    <UserPlus className="h-4 w-4 mr-1 md:mr-2" />
                    {tHeader('Sign Up')}
                  </Link>
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  asChild
                  className="text-sm font-medium px-3 h-9 focus-visible:ring-primary"
                >
                  <Link href={`/${clientLocale}/signin`}>
                    <LogIn className="h-4 w-4 mr-1 md:mr-2" />
                    {tHeader('Sign In')}
                  </Link>
                </Button>
              </>
            ))}
        </nav>
      </div>

      {/* Mobile menu content */}
      {isMobileMenuOpen && mounted && (
        <React.Fragment>
          <div className="md:hidden absolute top-14 left-0 right-0 bg-background shadow-lg border-t border-border p-4 space-y-4 animate-fade-in z-[60] max-h-[calc(100vh-3.5rem)] overflow-y-auto">
            {/* Mobile search */}
            <form
              onSubmit={handleSearchSubmit}
              className="relative flex items-center w-full"
            >
              <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <Input
                ref={searchInputRef}
                type="search"
                placeholder={placeholderSearch}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() =>
                  searchQuery.trim().length > 1 &&
                  searchResults.length > 0 &&
                  setShowResults(true)
                }
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
                    {searchResults.map((doc) => {
                      const translatedDoc = getDocTranslation(
                        doc,
                        clientLocale,
                      );
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
              className="w-full justify-between text-base font-medium flex items-center px-4 py-3 hover:bg-muted focus-visible:ring-primary focus-visible:ring-2 focus-visible:ring-offset-2"
              onClick={() => setShowMobileCategories((v) => !v)}
              aria-expanded={showMobileCategories}
              disabled={!mounted}
            >
              {mounted
                ? tHeader('nav.makeDocuments', {
                    defaultValue: 'Make Documents',
                  })
                : '...'}
              {showMobileCategories ? (
                <ChevronUp className="h-5 w-5 opacity-70" />
              ) : (
                <ChevronDown className="h-5 w-5 opacity-70" />
              )}
            </Button>
            {showMobileCategories && (
              <MobileDocsAccordion
                categories={CATEGORY_LIST}
                documents={documentLibrary}
                onLinkClick={() => {
                  setIsMegaMenuOpen(false);
                  setIsMobileMenuOpen(false);
                  setShowMobileCategories(false);
                }}
              />
            )}

            {/* Mobile footer links */}
            <div className="border-t border-border pt-4 space-y-1">
              {[
                {
                  href: '/pricing',
                  labelKey: 'nav.pricing',
                  defaultLabel: 'Pricing',
                },
                {
                  href: '/features',
                  labelKey: 'nav.features',
                  defaultLabel: 'Features',
                },
                {
                  href: '/signwell',
                  labelKey: 'nav.sign',
                  defaultLabel: 'Sign',
                },
                {
                  href: '/online-notary',
                  labelKey: 'nav.onlineNotary',
                  defaultLabel: 'Online Notary',
                },
                { href: '/blog', labelKey: 'nav.blog', defaultLabel: 'Blog' },
                { href: '/faq', labelKey: 'nav.faq', defaultLabel: 'FAQ' },
                {
                  href: '/support',
                  labelKey: 'nav.support',
                  defaultLabel: 'Support',
                },
              ].map((link) => (
                <Button
                  key={link.href}
                  variant="ghost"
                  asChild
                  className="w-full justify-start text-base py-3 hover:bg-muted focus-visible:ring-primary focus-visible:ring-2 focus-visible:ring-offset-2"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Link href={`/${clientLocale}${link.href}`}>
                    {mounted
                      ? tHeader(link.labelKey, {
                          defaultValue: link.defaultLabel,
                        })
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
              {isLoggedIn && user ? ( 
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-start text-base py-3 hover:bg-muted focus-visible:ring-primary focus-visible:ring-2 focus-visible:ring-offset-2"
                    asChild
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Link href={`/${clientLocale}/dashboard`}>
                      <UserCircle className="h-5 w-5 mr-2" />
                      {tHeader('My Account')}
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleLogout}
                    className="w-full justify-start text-base py-3 hover:bg-muted focus-visible:ring-primary focus-visible:ring-2 focus-visible:ring-offset-2"
                  >
                    <LogOut className="h-5 w-5 mr-2" /> {tHeader('Logout')}
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
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
                    variant="default"
                    size="sm"
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

            {/* Sticky CTA Button */}
            <div className="fixed bottom-4 left-4 right-4 z-[70] md:hidden">
              <Link
                href={`/${clientLocale}/?search=#workflow-start`}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block w-full text-center bg-primary text-white font-semibold py-3 rounded-lg shadow-lg hover:bg-primary/90 transition"
              >
                Browse All Documents
              </Link>
            </div>
          </div>
        </React.Fragment>
      )}
    </header>
    </div>
  );
});

export default Header;

// Helper to get localized document name, description, and aliases
// Moved from SearchBar as it's more generic
export const getLocalizedDocStrings = (
  doc: LegalDocument,
  locale: 'en' | 'es',
) => {
  let name =
    doc.translations?.en?.name || doc.translations?.es?.name || doc.name || '';
  let description =
    doc.translations?.en?.description ||
    doc.translations?.es?.description ||
    doc.description ||
    '';
  let aliases: string[] =
    doc.translations?.en?.aliases ||
    doc.translations?.es?.aliases ||
    doc.aliases ||
    [];

  if (locale === 'es') {
    name = doc.translations?.es?.name || name;
    description = doc.translations?.es?.description || description;
    aliases = doc.translations?.es?.aliases || aliases;
  }
  return { name, description, aliases };
};
