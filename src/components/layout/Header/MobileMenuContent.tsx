// src/components/layout/Header/MobileMenuContent.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { LogIn, UserPlus, LayoutDashboard, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DIRECT_CATEGORY_ITEMS } from './directCategoryConfig';
import { useAuth } from '@/hooks/useAuth';

interface MobileMenuContentProps {
  locale: 'en' | 'es';
  onLinkClick?: () => void;
}

export default function MobileMenuContent({
  locale,
  onLinkClick,
}: MobileMenuContentProps) {
  const { t: tHeader } = useTranslation('header');
  const { isLoggedIn, isLoading, logout } = useAuth();

  const handleLinkClick = () => {
    onLinkClick?.();
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('[MobileMenuContent] Failed to log out', error);
    } finally {
      onLinkClick?.();
    }
  };

  return (
    <div className="flex h-full flex-col">
      <div className="p-4 border-b border-border space-y-3">
        {isLoading ? (
          <div className="space-y-2" aria-label="Loading user menu">
            <div className="h-10 rounded-md bg-muted animate-pulse" />
            <div className="h-10 rounded-md bg-muted animate-pulse" />
          </div>
        ) : isLoggedIn ? (
          <div className="space-y-2">
            <Button asChild variant="outline" className="justify-start gap-2">
              <Link href={`/${locale}/dashboard`} prefetch onClick={handleLinkClick}>
                <LayoutDashboard className="h-4 w-4" />
                {tHeader('nav.dashboard', { defaultValue: 'Dashboard' })}
              </Link>
            </Button>
            <Button
              variant="ghost"
              className="justify-start gap-2 text-destructive hover:text-destructive"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" />
              {tHeader('nav.logout', { defaultValue: 'Logout' })}
            </Button>
          </div>
        ) : (
          <div className="space-y-2">
            <Button asChild variant="default" className="justify-start gap-2">
              <Link href={`/${locale}/signin`} prefetch onClick={handleLinkClick}>
                <LogIn className="h-4 w-4" />
                {tHeader('nav.signin', { defaultValue: 'Sign In' })}
              </Link>
            </Button>
            <Button asChild variant="outline" className="justify-start gap-2">
              <Link href={`/${locale}/signup`} prefetch onClick={handleLinkClick}>
                <UserPlus className="h-4 w-4" />
                {tHeader('nav.signup', { defaultValue: 'Sign Up' })}
              </Link>
            </Button>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {tHeader('nav.documents', { defaultValue: 'Documents' })}
        </p>
        <nav className="space-y-2" aria-label={tHeader('nav.documents', { defaultValue: 'Documents' })}>
          {DIRECT_CATEGORY_ITEMS.map((category) => {
            const IconComponent = category.icon;
            return (
              <Button
                asChild
                key={category.id}
                variant="ghost"
                className="w-full justify-start gap-3 px-3 py-2 text-base font-medium"
              >
                <Link
                  href={`/${locale}/marketplace?category=${encodeURIComponent(category.id)}`}
                  prefetch
                  onClick={handleLinkClick}
                >
                  <IconComponent className="h-5 w-5 text-primary" />
                  <span>
                    {tHeader(`directCategories.${category.labelKey}`, {
                      defaultValue: category.labelKey,
                    })}
                  </span>
                </Link>
              </Button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
