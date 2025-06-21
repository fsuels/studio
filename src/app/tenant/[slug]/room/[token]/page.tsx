import React from 'react';
import { headers } from 'next/headers';
import { getTenantFromHeaders } from '@/middleware/tenant';
import { TenantInviteRoom } from '@/components/tenant/TenantInviteRoom';
import { redirect } from 'next/navigation';
import { validateInviteToken } from '@/lib/tenant-invites';

interface TenantRoomPageProps {
  params: {
    slug: string;
    token: string;
  };
}

export default async function TenantRoomPage({ params }: TenantRoomPageProps) {
  const headersList = headers();
  const tenant = await getTenantFromHeaders(headersList);

  if (!tenant) {
    redirect(`/tenant-not-found?slug=${params.slug}`);
  }

  // Validate the invite token
  const invitation = await validateInviteToken(params.token, tenant.id);

  if (!invitation) {
    redirect(`/tenant/${params.slug}/invite-invalid`);
  }

  if (invitation.status === 'expired') {
    redirect(`/tenant/${params.slug}/invite-expired`);
  }

  if (invitation.status === 'accepted') {
    redirect(`/tenant/${params.slug}/invite-already-used`);
  }

  return (
    <TenantInviteRoom
      tenant={tenant}
      invitation={invitation}
      token={params.token}
    />
  );
}

// Generate metadata for invite rooms
export async function generateMetadata({ params }: TenantRoomPageProps) {
  const headersList = headers();
  const tenant = await getTenantFromHeaders(headersList);

  const companyName =
    tenant?.branding?.companyName || tenant?.name || 'Legal Document Portal';

  return {
    title: `Join ${companyName} - Document Collaboration`,
    description: `You've been invited to collaborate on legal documents with ${companyName}`,
    robots: 'noindex, nofollow', // Don't index invite pages

    openGraph: {
      title: `Join ${companyName}`,
      description: `You've been invited to collaborate on legal documents with ${companyName}`,
      type: 'website',
    },
  };
}
