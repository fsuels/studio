// src/components/layout/Header/HeaderMobileMenu.tsx
'use client';

import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Menu as MenuIcon, X as CloseIcon } from 'lucide-react';
import { ProgressiveLoader } from '@/components/ui/ProgressiveLoader';
import {
  MobileNavigation,
  MobileNavigationSkeleton,
} from '@/components/ui/MobileNavigation';
import { ThemeToggleButton } from '@/components/ui/theme-toggle';
import LanguageSwitcher from '@/components/shared/navigation/LanguageSwitcher';
import { Logo } from '@/components/layout/Logo';
import { MOBILE_MENU_REOPEN_STORAGE_KEY } from './mobileMenu.constants';

interface HeaderMobileMenuProps {
  clientLocale: 'en' | 'es';
  mounted: boolean;
  isMobileMenuOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}

export default function HeaderMobileMenu({
  clientLocale,
  mounted,
  isMobileMenuOpen,
  onToggle,
  onClose,
}: HeaderMobileMenuProps) {
  const { t: tHeader } = useTranslation('header');

  return (
    <>
      {/* Mobile menu toggle */}
      <div className="md:hidden flex items-center">
        <Button
          variant="default"
          size="icon"
          className="p-2 bg-primary text-white shadow-md rounded-md focus-visible:ring-primary focus-visible:ring-2 focus-visible:ring-offset-2"
          onClick={onToggle}
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

      {/* Enhanced mobile navigation */}
      <MobileNavigation
        isOpen={isMobileMenuOpen}
        onClose={onClose}
        slideDirection="right"
        className="md:hidden"
      >
        <div className="h-full flex flex-col">
          <div className="flex items-center px-4 py-3 border-b border-border bg-background/95 gap-4">
            <div className="flex-shrink-0">
              <Logo
                wrapperClassName="flex-row items-center gap-2"
                svgClassName="h-7 w-7"
                textClassName="text-xs"
              />
            </div>
            <div className="flex-1 flex justify-center">
              <div className="flex items-center gap-3">
                <ThemeToggleButton />
                <LanguageSwitcher
                  size="sm"
                  hideCaret
                  onLocaleChangeStart={() => {
                    if (typeof window === 'undefined') {
                      return;
                    }

                    if (isMobileMenuOpen) {
                      sessionStorage.setItem(MOBILE_MENU_REOPEN_STORAGE_KEY, 'true');
                    }
                  }}
                />
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              aria-label={tHeader('nav.closeMenu', {
                defaultValue: 'Close menu',
              })}
              className="h-12 w-12 rounded-full border border-border/70 shadow-sm text-foreground/85 hover:text-foreground"
            >
              <CloseIcon className="h-6 w-6" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto">
            <ProgressiveLoader
              component={() => import('./MobileMenuContent')}
              fallback={<MobileNavigationSkeleton />}
              delay={50}
              props={{ locale: clientLocale, onLinkClick: onClose, mounted }}
            />
          </div>
        </div>
      </MobileNavigation>
    </>
  );
}
