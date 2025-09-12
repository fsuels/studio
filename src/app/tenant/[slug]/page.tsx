import React from 'react';
import { headers } from 'next/headers';
import { getTenantFromHeaders } from '@/middleware/tenant';
import { TenantDashboardLazy } from '@/components/tenant/TenantDashboard.lazy';
import { redirect } from 'next/navigation';

interface TenantPageProps {
  params: Promise<{ slug: string }>;
}

export default async function TenantPage({ params }: TenantPageProps) {
  const { slug } = await params;
  const headersList = headers();
  const tenant = await getTenantFromHeaders(headersList);

  if (!tenant) {
    redirect(`/tenant-not-found?slug=${slug}`);
  }

  return <TenantDashboardLazy tenant={tenant} />;
}

// Generate static params for known tenants (optional optimization)
export async function generateStaticParams() {
  // In production, you would fetch tenant slugs from your database
  // For now, return empty array to generate pages on-demand
  return [];
}

// Generate metadata based on tenant
export async function generateMetadata({ params }: TenantPageProps) {
  await params; // ensure type compatibility with Next.js 15
  const headersList = headers();
  const tenant = await getTenantFromHeaders(headersList);

  if (!tenant) {
    return {
      title: 'Tenant Not Found',
      description: 'The requested tenant could not be found.',
    };
  }

  return {
    title: `${tenant.branding?.companyName || tenant.name} - Legal Documents`,
    description:
      tenant.branding?.tagline ||
      `Create professional legal documents with ${tenant.name}`,
    keywords: 'legal documents, contracts, forms, templates',
    robots: 'index, follow',

    // Open Graph
    openGraph: {
      title: `${tenant.branding?.companyName || tenant.name} - Legal Documents`,
      description:
        tenant.branding?.tagline ||
        `Create professional legal documents with ${tenant.name}`,
      type: 'website',
      ...(tenant.branding?.logoUrl && { images: [tenant.branding.logoUrl] }),
    },

    // Twitter Card
    twitter: {
      card: 'summary_large_image',
      title: `${tenant.branding?.companyName || tenant.name} - Legal Documents`,
      description:
        tenant.branding?.tagline ||
        `Create professional legal documents with ${tenant.name}`,
      ...(tenant.branding?.logoUrl && { images: [tenant.branding.logoUrl] }),
    },

    // Favicon
    ...(tenant.branding?.faviconUrl && {
      icons: {
        icon: tenant.branding.faviconUrl,
        shortcut: tenant.branding.faviconUrl,
        apple: tenant.branding.faviconUrl,
      },
    }),

    // Theme color
    themeColor: tenant.branding?.primaryColor || '#2563eb',
  };
}
