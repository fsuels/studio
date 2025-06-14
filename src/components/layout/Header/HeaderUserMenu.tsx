// src/components/layout/Header/HeaderUserMenu.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  UserPlus,
  LogIn,
  LogOut,
  UserCircle,
} from 'lucide-react';
import { UserMenuSkeleton } from '@/components/ui/skeleton-variants';

interface HeaderUserMenuProps {
  clientLocale: 'en' | 'es';
  mounted: boolean;
}

export default function HeaderUserMenu({ 
  clientLocale, 
  mounted 
}: HeaderUserMenuProps) {
  const { t: tHeader } = useTranslation('header');
  const { isLoggedIn, isLoading: authIsLoading, user, logout } = useAuth();

  if (!mounted) {
    return (
      <div className="flex items-center gap-2" data-testid="header-user-skeleton">
        <UserMenuSkeleton />
        <UserMenuSkeleton />
      </div>
    );
  }

  if (authIsLoading) {
    return (
      <div className="flex items-center gap-2" data-testid="user-menu-loading">
        <UserMenuSkeleton />
      </div>
    );
  }

  if (isLoggedIn && user) {
    return (
      <div className="flex items-center gap-2">
        <Link href={`/${clientLocale}/dashboard`}>
          <Button
            variant="outline"
            size="sm"
            className="bg-primary/5 border-primary/20 text-primary hover:bg-primary/10"
          >
            {tHeader('nav.dashboard', { defaultValue: 'Dashboard' })}
          </Button>
        </Link>

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
            >
              <UserCircle className="h-4 w-4" />
              <span className="hidden sm:inline">
                {user.email?.split('@')[0] || 'User'}
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-2" align="end">
            <div className="space-y-1">
              <div className="px-2 py-1.5 text-sm text-muted-foreground border-b">
                {user.email}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="w-full justify-start gap-2"
              >
                <LogOut className="h-4 w-4" />
                {tHeader('nav.logout', { defaultValue: 'Logout' })}
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link href={`/${clientLocale}/signin`}>
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
        >
          <LogIn className="h-4 w-4" />
          {tHeader('nav.signin', { defaultValue: 'Sign In' })}
        </Button>
      </Link>
      <Link href={`/${clientLocale}/signup`}>
        <Button
          size="sm"
          className="gap-2 bg-primary hover:bg-primary/90"
        >
          <UserPlus className="h-4 w-4" />
          {tHeader('nav.signup', { defaultValue: 'Sign Up' })}
        </Button>
      </Link>
    </div>
  );
}