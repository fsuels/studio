import { redirect } from 'next/navigation';

export const dynamic = 'force-static';

export default async function LegacyDocStateRedirect({
  params,
}: {
  params: Promise<{ docId: string; state: string }>;
}) {
  const { docId, state } = await params;
  redirect(`/en/docs/${docId}/${state}`);
}
