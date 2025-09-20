import { redirect } from 'next/navigation';

export const dynamic = 'force-static';

export default async function LegacyDocStateRedirect({
  params,
}: {
  params: { docId: string; state: string };
}) {
  const { docId, state } = params;
  redirect(`/en/docs/${docId}/${state}`);
}
