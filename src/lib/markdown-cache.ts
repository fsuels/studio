import fs from 'node:fs/promises';
import path from 'node:path';

const cache = new Map<string, string | null>();

export async function getMarkdown(
  locale: string,
  docId: string,
): Promise<string | null> {
  const key = `${locale}/${docId}`;
  if (cache.has(key)) {
    return cache.get(key)!;
  }
  const filePath = path.join(
    process.cwd(),
    'public',
    'templates',
    locale,
    `${docId}.md`,
  );
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    cache.set(key, content);
    return content;
  } catch (error: unknown) {
    const err = error as NodeJS.ErrnoException;
    if (err.code === 'ENOENT') {
      console.warn(
        `Markdown template not found for ${docId} in locale ${locale}. Path: ${filePath}`,
      );
    } else {
      console.error(
        `Error reading markdown file for ${docId} in locale ${locale}. Path: ${filePath}`,
        err,
      );
    }
    cache.set(key, null);
    return null;
  }
}

export function clearMarkdownCache() {
  cache.clear();
}
