'use client';

import React, { createContext, useContext, useEffect } from 'react';
import { TenantBranding } from '@/types/tenant';

interface TenantBrandingContextValue {
  branding: TenantBranding | null;
  isWhiteLabel: boolean;

  // Helper functions
  getPrimaryColor: () => string;
  getSecondaryColor: () => string;
  getAccentColor: () => string;
  getFontFamily: () => string;
  getCompanyName: () => string;
  getLogoUrl: () => string | undefined;
  getFaviconUrl: () => string | undefined;
}

const TenantBrandingContext = createContext<
  TenantBrandingContextValue | undefined
>(undefined);

interface TenantBrandingProviderProps {
  children: React.ReactNode;
  branding: TenantBranding | null;
}

export function TenantBrandingProvider({
  children,
  branding,
}: TenantBrandingProviderProps) {
  // Apply branding to document root
  useEffect(() => {
    if (!branding) return;

    const root = document.documentElement;

    // Apply CSS custom properties for theming
    root.style.setProperty('--tenant-primary', branding.primaryColor);
    root.style.setProperty('--tenant-secondary', branding.secondaryColor);
    root.style.setProperty(
      '--tenant-accent',
      branding.accentColor || branding.primaryColor,
    );

    if (branding.fontFamily) {
      root.style.setProperty('--tenant-font-family', branding.fontFamily);
    }

    // Update favicon if provided
    if (branding.faviconUrl) {
      updateFavicon(branding.faviconUrl);
    }

    // Apply custom CSS if provided
    if (branding.customCss) {
      injectCustomCSS(branding.customCss);
    }

    return () => {
      // Cleanup on unmount
      root.style.removeProperty('--tenant-primary');
      root.style.removeProperty('--tenant-secondary');
      root.style.removeProperty('--tenant-accent');
      root.style.removeProperty('--tenant-font-family');

      removeCustomCSS();
    };
  }, [branding, injectCustomCSS]);

  const updateFavicon = (faviconUrl: string) => {
    // Remove existing favicon
    const existingFavicon = document.querySelector('link[rel="icon"]');
    if (existingFavicon) {
      existingFavicon.remove();
    }

    // Add new favicon
    const link = document.createElement('link');
    link.rel = 'icon';
    link.href = faviconUrl;
    document.head.appendChild(link);
  };

  const injectCustomCSS = useCallback((css: string) => {
    // Remove existing custom CSS
    removeCustomCSS();

    // Add new custom CSS
    const style = document.createElement('style');
    style.id = 'tenant-custom-css';
    style.textContent = css;
    document.head.appendChild(style);
  }, []);

  const removeCustomCSS = () => {
    const existingStyle = document.getElementById('tenant-custom-css');
    if (existingStyle) {
      existingStyle.remove();
    }
  };

  // Helper functions
  const getPrimaryColor = () => branding?.primaryColor || '#2563eb';
  const getSecondaryColor = () => branding?.secondaryColor || '#64748b';
  const getAccentColor = () =>
    branding?.accentColor || branding?.primaryColor || '#0f172a';
  const getFontFamily = () => branding?.fontFamily || 'system-ui, sans-serif';
  const getCompanyName = () => branding?.companyName || 'Legal Document Portal';
  const getLogoUrl = () => branding?.logoUrl;
  const getFaviconUrl = () => branding?.faviconUrl;

  const value: TenantBrandingContextValue = {
    branding,
    isWhiteLabel: !!branding,
    getPrimaryColor,
    getSecondaryColor,
    getAccentColor,
    getFontFamily,
    getCompanyName,
    getLogoUrl,
    getFaviconUrl,
  };

  return (
    <TenantBrandingContext.Provider value={value}>
      {children}
    </TenantBrandingContext.Provider>
  );
}

export function useTenantBranding() {
  const context = useContext(TenantBrandingContext);
  if (context === undefined) {
    throw new Error(
      'useTenantBranding must be used within a TenantBrandingProvider',
    );
  }
  return context;
}

// Convenience hooks for specific branding elements
export function useBrandedButton() {
  const { getPrimaryColor } = useTenantBranding();

  return {
    primaryButtonStyle: {
      backgroundColor: getPrimaryColor(),
      borderColor: getPrimaryColor(),
    },
    secondaryButtonStyle: {
      color: getPrimaryColor(),
      borderColor: getPrimaryColor(),
    },
  };
}

export function useBrandedColors() {
  const { getPrimaryColor, getSecondaryColor, getAccentColor } =
    useTenantBranding();

  return {
    primary: getPrimaryColor(),
    secondary: getSecondaryColor(),
    accent: getAccentColor(),
  };
}

export function useBrandedTypography() {
  const { getFontFamily } = useTenantBranding();

  return {
    fontFamily: getFontFamily(),
    headingStyle: {
      fontFamily: getFontFamily(),
    },
    bodyStyle: {
      fontFamily: getFontFamily(),
    },
  };
}

export function useCompanyInfo() {
  const { branding, getCompanyName, getLogoUrl } = useTenantBranding();

  return {
    companyName: getCompanyName(),
    logoUrl: getLogoUrl(),
    tagline: branding?.tagline,
    footerText: branding?.footerText,
    supportEmail: branding?.supportEmail,
    termsUrl: branding?.termsUrl,
    privacyUrl: branding?.privacyUrl,
  };
}
