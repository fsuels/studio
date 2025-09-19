import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import PolicyAuditLogger from '@/components/policy/PolicyAuditLogger';
import { loadPolicy } from '@/lib/legal/policies';

export const dynamic = 'force-static';
export const revalidate = 86_400;

export default async function RefundPolicyPage({
  params,
}: {
  params: Promise<{ locale?: 'en' | 'es' }>;
}) {
  const { locale = 'en' } = await params;
  const policy = await loadPolicy('refund-policy');

  const region = locale === 'es' ? 'es-ES' : 'en-US';
  const lastUpdatedDate = policy.lastUpdated
    ? new Date(policy.lastUpdated)
    : undefined;
  const lastUpdatedDisplay =
    lastUpdatedDate && !Number.isNaN(lastUpdatedDate.getTime())
      ? lastUpdatedDate.toLocaleDateString(region, {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      : policy.lastUpdated;

  return (
    <div className="container mx-auto px-4 py-8">
      <PolicyAuditLogger locale={locale} policyType="refund_policy" lastUpdated={policy.lastUpdated} />
      <h1 className="text-3xl font-bold mb-4">{policy.title}</h1>
      {lastUpdatedDisplay && (
        <p className="text-muted-foreground mb-6">
          Last updated: {lastUpdatedDisplay}
        </p>
      )}
      <div className="prose max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{policy.markdown}</ReactMarkdown>
      </div>
    </div>
  );
}
