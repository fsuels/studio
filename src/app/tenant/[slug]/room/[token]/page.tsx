import React from 'react';
import { headers } from 'next/headers';
import { getTenantFromHeaders } from '@/middleware/tenant';
import { TenantInviteRoom } from '@/components/tenant/TenantInviteRoom';
import { redirect } from 'next/navigation';
import { validateInviteToken } from '@/lib/tenant-invites';

export default async function TenantRoomPage({
  params,
}: {
  params: { slug: string; token: string };
}) {
  const { slug, token } = params;
  const headersList = headers();
  const tenant = await getTenantFromHeaders(headersList);

  if (!tenant) {
    redirect(`/tenant-not-found?slug=${slug}`);
  }

  // Validate the invite token
  const invitation = await validateInviteToken(token, tenant.id);

  if (!invitation) {
    redirect(`/tenant/${slug}/invite-invalid`);
  }

  if (invitation.status === 'expired') {
    redirect(`/tenant/${slug}/invite-expired`);
  }

  if (invitation.status === 'accepted') {
    redirect(`/tenant/${slug}/invite-already-used`);
  }

  return (
    <TenantInviteRoom
      tenant={tenant}
      invitation={invitation}
      token={token}
    />
  );
}

// Generate metadata for invite rooms
export async function generateMetadata({
  params,
}: {
  params: { slug: string; token: string };
}) {
  await params; // ensure compatibility with Next.js 15 types
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
