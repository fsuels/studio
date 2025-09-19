import fs from 'node:fs/promises';
import path from 'node:path';

export type PolicySlug =
  | 'privacy-notice'
  | 'terms-of-service'
  | 'disclaimer'
  | 'refund-policy';

const POLICY_FILE_MAP: Record<PolicySlug, string> = {
  'privacy-notice': 'privacy-notice.md',
  'terms-of-service': 'terms-of-service.md',
  disclaimer: 'disclaimer.md',
  'refund-policy': 'refund-policy.md',
};

export interface PolicyDocument {
  slug: PolicySlug;
  title: string;
  lastUpdated?: string;
  markdown: string;
}

function extractMetadata(raw: string): Omit<PolicyDocument, 'slug'> {
  const normalized = raw.replace(/\r\n/g, '\n').trim();
  const lines = normalized.split('\n');

  let title = '';
  if (lines[0]?.startsWith('# ')) {
    title = lines.shift()!.replace(/^#\s+/, '').trim();
  }

  let lastUpdated: string | undefined;
  const maybeLastUpdated = lines[0]?.match(/^_Last updated:\s*(.+)_$/i);
  if (maybeLastUpdated) {
    lastUpdated = maybeLastUpdated[1].trim();
    lines.shift();
  }

  const markdown = lines.join('\n').trim();

  return {
    title: title || 'Policy',
    lastUpdated,
    markdown,
  };
}

export async function loadPolicy(slug: PolicySlug): Promise<PolicyDocument> {
  const fileName = POLICY_FILE_MAP[slug];
  if (!fileName) {
    throw new Error(`Unsupported policy slug: ${slug}`);
  }

  const filePath = path.join(process.cwd(), 'docs', 'legal', fileName);
  const file = await fs.readFile(filePath, 'utf8');

  const { title, lastUpdated, markdown } = extractMetadata(file);

  return {
    slug,
    title,
    lastUpdated,
    markdown,
  };
}
