'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';
import { useTenant } from '@/contexts/TenantContext';
import {
  useTenantBranding,
  useCompanyInfo,
} from '@/contexts/TenantBrandingContext';
import {
  Menu,
  X,
  User,
  Settings,
  LogOut,
  FileText,
  Users,
  BarChart3,
  HelpCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function TenantHeader() {
  const { tenant, tenantUser, hasPermission } = useTenant();
  const { isWhiteLabel } = useTenantBranding();
  const { companyName, logoUrl } = useCompanyInfo();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (!tenant) {
    return null;
  }

  const navigation = [
    {
      name: 'Documents',
      href: `/tenant/${tenant.slug}/documents`,
      icon: FileText,
    },
    {
      name: 'Templates',
      href: `/tenant/${tenant.slug}/templates`,
      icon: FileText,
    },
    ...(hasPermission('tenant.manage_users')
      ? [{ name: 'Team', href: `/tenant/${tenant.slug}/team`, icon: Users }]
      : []),
    ...(hasPermission('tenant.view_analytics')
      ? [
          {
            name: 'Analytics',
            href: `/tenant/${tenant.slug}/analytics`,
            icon: BarChart3,
          },
        ]
      : []),
  ];

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo / Company Name */}
          <div className="flex items-center">
            <Link href={`/tenant/${tenant.slug}`} className="flex items-center">
              {logoUrl ? (
                <Image
                  src={logoUrl}
                  alt={companyName}
                  width={120}
                  height={40}
                  className="h-8 w-auto"
                />
              ) : (
                <span className="text-xl font-bold text-gray-900">
                  {companyName}
                </span>
              )}
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-500 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium flex items-center"
              >
                <item.icon className="h-4 w-4 mr-2" />
                {item.name}
              </Link>
            ))}
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            {tenantUser ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="flex items-center space-x-2"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={`https://avatar.vercel.sh/${tenantUser.userId}`}
                      />
                      <AvatarFallback>
                        {tenantUser.userId.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden md:inline-block text-sm font-medium">
                      {tenantUser.role}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem asChild>
                    <Link href={`/tenant/${tenant.slug}/profile`}>
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  {hasPermission('tenant.manage_settings') && (
                    <DropdownMenuItem asChild>
                      <Link href={`/tenant/${tenant.slug}/settings`}>
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild>
                    <Link href={`/tenant/${tenant.slug}/help`}>
                      <HelpCircle className="mr-2 h-4 w-4" />
                      Help & Support
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
                <Button size="sm">Get Started</Button>
              </div>
            )}

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-gray-200">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-500 hover:text-gray-900 block px-3 py-2 rounded-md text-base font-medium flex items-center"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <item.icon className="h-4 w-4 mr-2" />
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Branding indicator for non-white-label */}
      {!isWhiteLabel && (
        <div className="bg-gray-50 border-t border-gray-200 px-4 py-2">
          <div className="max-w-7xl mx-auto">
            <p className="text-xs text-gray-500 text-center">
              Powered by{' '}
              <Link href="/" className="text-blue-600 hover:text-blue-800">
                123LegalDoc
              </Link>
            </p>
          </div>
        </div>
      )}
    </header>
  );
}
