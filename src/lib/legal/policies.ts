import fs from 'node:fs/promises';
import path from 'node:path';

export type PolicySlug =
  | 'privacy-notice'
  | 'terms-of-service'
  | 'disclaimer'
  | 'refund-policy';

export type PolicyLocale = 'en' | 'es';

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

export async function loadPolicy(
  slug: PolicySlug,
  locale: PolicyLocale = 'en',
): Promise<PolicyDocument> {
  const fileName = POLICY_FILE_MAP[slug];
  if (!fileName) {
    throw new Error(`Unsupported policy slug: ${slug}`);
  }

  const baseDir = path.join(process.cwd(), 'docs', 'legal');
  const candidatePaths =
    locale === 'en'
      ? [path.join(baseDir, fileName)]
      : [path.join(baseDir, locale, fileName), path.join(baseDir, fileName)];

  let fileContents: string | null = null;
  for (const candidate of candidatePaths) {
    try {
      fileContents = await fs.readFile(candidate, 'utf8');
      break;
    } catch (error) {
      const err = error as NodeJS.ErrnoException;
      if (err.code !== 'ENOENT') {
        throw err;
      }
    }
  }

  if (!fileContents) {
    throw new Error(
      `Policy file not found for slug "${slug}" (locale "${locale}")`,
    );
  }

  const { title, lastUpdated, markdown } = extractMetadata(fileContents);

  return {
    slug,
    title,
    lastUpdated,
    markdown,
  };
}
