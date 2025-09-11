import fs from 'node:fs/promises';
import path from 'node:path';
import { getSlugAliases } from './slug-alias';

const cache = new Map<string, string | null>();

export async function getMarkdown(
  locale: string,
  docId: string,
): Promise<string | null> {
  const key = `${locale}/${docId}`;
  if (cache.has(key)) {
    return cache.get(key)!;
  }
  const baseDir = path.join(process.cwd(), 'public', 'templates', locale);

  async function tryRead(file: string): Promise<string | null> {
    try {
      return await fs.readFile(file, 'utf-8');
    } catch (e: any) {
      if (e?.code !== 'ENOENT') throw e;
      return null;
    }
  }

  // 1) Try canonical path first
  const filePath = path.join(baseDir, `${docId}.md`);
  try {
    const direct = await tryRead(filePath);
    if (direct != null) {
      cache.set(key, direct);
      return direct;
    }

    // 2) Try any known aliases
    for (const alias of getSlugAliases(docId)) {
      const aliasPath = path.join(baseDir, `${alias}.md`);
      const content = await tryRead(aliasPath);
      if (content != null) {
        cache.set(key, content);
        return content;
      }
    }

    // Not found
    console.warn(
      `Markdown template not found for ${docId} in locale ${locale}. Tried: ${filePath} and aliases ${getSlugAliases(
        docId,
      )}`,
    );
    cache.set(key, content);
    return content;
  } catch (error: unknown) {
    const err = error as NodeJS.ErrnoException;
    if (err.code === 'ENOENT') {
      console.warn(`Markdown template not found (ENOENT) for ${docId} in ${locale}`);
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
