import { redirect } from 'next/navigation';

export const dynamic = 'force-static';

export default function LegacyDocViewRedirect({
  params,
}: {
  params: { docId: string };
}) {
  redirect(`/en/docs/${params.docId}/view`);
}
