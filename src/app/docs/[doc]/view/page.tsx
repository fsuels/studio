import { redirect } from 'next/navigation';

export const dynamic = 'force-static';

export default function LegacyDocViewRedirect({
  params,
}: {
  params: { doc: string };
}) {
  redirect(`/en/docs/${params.doc}/view`);
}

