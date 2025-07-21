'use client';

import React from 'react';
import { Button, ButtonProps } from '@/components/ui/button';
import { useTenantBranding } from '@/contexts/TenantBrandingContext';
import { cn } from '@/lib/utils';

interface BrandedButtonProps extends ButtonProps {
  brandVariant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link';
}

export function BrandedButton({
  brandVariant = 'primary',
  className,
  style,
  children,
  ...props
}: BrandedButtonProps) {
  const { branding, getPrimaryColor, getSecondaryColor } = useTenantBranding();

  // Generate branded styles
  const getBrandedStyles = () => {
    const primaryColor = getPrimaryColor();
    const secondaryColor = getSecondaryColor();

    switch (brandVariant) {
      case 'primary':
        return {
          backgroundColor: primaryColor,
          borderColor: primaryColor,
          color: 'white',
          '--hover-bg': `color-mix(in srgb, ${primaryColor} 80%, black)`,
          '--hover-border': `color-mix(in srgb, ${primaryColor} 80%, black)`,
        };

      case 'secondary':
        return {
          backgroundColor: secondaryColor,
          borderColor: secondaryColor,
          color: 'white',
          '--hover-bg': `color-mix(in srgb, ${secondaryColor} 80%, black)`,
          '--hover-border': `color-mix(in srgb, ${secondaryColor} 80%, black)`,
        };

      case 'outline':
        return {
          color: primaryColor,
          borderColor: primaryColor,
          backgroundColor: 'transparent',
          '--hover-bg': primaryColor,
          '--hover-color': 'white',
        };

      case 'ghost':
        return {
          color: primaryColor,
          backgroundColor: 'transparent',
          '--hover-bg': `color-mix(in srgb, ${primaryColor} 10%, transparent)`,
        };

      case 'link':
        return {
          color: primaryColor,
          textDecoration: 'underline',
          '--hover-color': `color-mix(in srgb, ${primaryColor} 80%, black)`,
        };

      default:
        return {};
    }
  };

  const brandedStyles = getBrandedStyles();

  // Custom CSS for hover states
  const customHoverCSS = `
    .branded-button:hover {
      ${brandedStyles['--hover-bg'] ? `background-color: ${brandedStyles['--hover-bg']} !important;` : ''}
      ${brandedStyles['--hover-border'] ? `border-color: ${brandedStyles['--hover-border']} !important;` : ''}
      ${brandedStyles['--hover-color'] ? `color: ${brandedStyles['--hover-color']} !important;` : ''}
    }
  `;

  return (
    <>
      {/* Inject custom hover styles */}
      <style dangerouslySetInnerHTML={{ __html: customHoverCSS }} />

      <Button
        {...props}
        className={cn(
          'branded-button transition-all duration-200',
          {
            border: brandVariant === 'outline',
            'underline-offset-4 hover:underline': brandVariant === 'link',
          },
          className,
        )}
        style={{
          ...brandedStyles,
          ...style,
        }}
      >
        {children}
      </Button>
    </>
  );
}

// Convenience components for specific button types
export function BrandedPrimaryButton(
  props: Omit<BrandedButtonProps, 'brandVariant'>,
) {
  return <BrandedButton {...props} brandVariant="primary" />;
}

export function BrandedSecondaryButton(
  props: Omit<BrandedButtonProps, 'brandVariant'>,
) {
  return <BrandedButton {...props} brandVariant="secondary" />;
}

export function BrandedOutlineButton(
  props: Omit<BrandedButtonProps, 'brandVariant'>,
) {
  return <BrandedButton {...props} brandVariant="outline" />;
}

export function BrandedGhostButton(
  props: Omit<BrandedButtonProps, 'brandVariant'>,
) {
  return <BrandedButton {...props} brandVariant="ghost" />;
}

export function BrandedLinkButton(
  props: Omit<BrandedButtonProps, 'brandVariant'>,
) {
  return <BrandedButton {...props} brandVariant="link" />;
}
