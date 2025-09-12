import { redirect } from 'next/navigation';

export const dynamic = 'force-static';

export default async function LegacyDocViewRedirect({
  params,
}: {
  params: Promise<{ docId: string }>;
}) {
  const { docId } = await params;
  redirect(`/en/docs/${docId}/view`);
}
