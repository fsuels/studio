
// Auto-generated doc-meta index
import type { DocMeta } from '../types';

const cache: Record<string, Promise<Record<string, DocMeta>>> = {};

export async function getDocMetaByCategory(cat: string) {
  if (!cache[cat]) {
    cache[cat] = import(`./${cat}.json`).then(m => m.default as Record<string, DocMeta>);
  }
  return cache[cat];
}

export async function getDocMeta(slug: string): Promise<DocMeta | undefined> {
  const mapping: Record<string,string> = JSON.parse(process.env.NEXT_PUBLIC_SLUG_CAT_MAP ?? '{}');
  const cat = mapping[slug];
  if (!cat) return undefined;
  const chunk = await getDocMetaByCategory(cat);
  return chunk[slug];
}
