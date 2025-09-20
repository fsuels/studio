import { redirect } from 'next/navigation';

export const dynamic = 'force-static';

export default async function LegacyDocViewRedirect({
  params,
}: {
  params: { docId: string };
}) {
  const { docId } = params;
  redirect(`/en/docs/${docId}/view`);
}
