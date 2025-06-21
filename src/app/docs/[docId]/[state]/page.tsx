import { redirect } from 'next/navigation';

export const dynamic = 'force-static';

export default function LegacyDocStateRedirect({
  params,
}: {
  params: { docId: string; state: string };
}) {
  redirect(`/en/docs/${params.docId}/${params.state}`);
}
