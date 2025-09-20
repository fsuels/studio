import React from 'react';
import { headers } from 'next/headers';
import { getTenantFromHeaders } from '@/middleware/tenant';
import { TenantProvider } from '@/contexts/TenantContext';
import { TenantBrandingProvider } from '@/contexts/TenantBrandingContext';
import { redirect } from 'next/navigation';
import { TenantHeader } from '@/components/tenant/TenantHeader';
import { TenantFooter } from '@/components/tenant/TenantFooter';

interface TenantLayoutProps {
  children: React.ReactNode;
  params: { slug: string };
}

export default async function TenantLayout({
  children,
  params,
}: TenantLayoutProps) {
  const { slug } = params;
  const headersList = headers();
  const tenant = await getTenantFromHeaders(headersList);

  if (!tenant) {
    redirect(`/tenant-not-found?slug=${slug}`);
  }

  // Apply tenant-specific styling
  const brandingStyles = {
    '--primary-color': tenant.branding?.primaryColor || '#2563eb',
    '--secondary-color': tenant.branding?.secondaryColor || '#64748b',
    '--accent-color': tenant.branding?.accentColor || '#0f172a',
    '--font-family': tenant.branding?.fontFamily || 'system-ui, sans-serif',
  } as React.CSSProperties;

  return (
    <TenantProvider tenant={tenant}>
      <TenantBrandingProvider branding={tenant.branding}>
        <div className="min-h-screen bg-background" style={brandingStyles}>
          {/* Inject custom CSS if provided */}
          {tenant.branding?.customCss && (
            <style
              dangerouslySetInnerHTML={{ __html: tenant.branding.customCss }}
            />
          )}

          {/* Tenant-specific header */}
          <TenantHeader />

          {/* Main content */}
          <main className="flex-1">{children}</main>

          {/* Tenant-specific footer */}
          <TenantFooter />
        </div>
      </TenantBrandingProvider>
    </TenantProvider>
  );
}
