// Auto-generated doc-meta index
import type { DocMeta } from '../types';

const cache: Record<string, Promise<Record<string, DocMeta>>> = {};

export async function getDocMetaByCategory(cat: string) {
  if (!cache[cat]) {
    cache[cat] = import(`./${cat}.json`).then(
      (m) => m.default as Record<string, DocMeta>,
    );
  }
  return cache[cat];
}

export async function getDocMeta(slug: string): Promise<DocMeta | undefined> {
  try {
    // Import the slug-category map directly
    const slugCategoryMap = await import('./slug-category-map.json');
    const mapping = slugCategoryMap.default as Record<string, string>;
    
    const cat = mapping[slug];
    if (!cat) return undefined;
    
    const chunk = await getDocMetaByCategory(cat);
    return chunk[slug];
  } catch (error) {
    console.error('Error loading doc meta for slug:', slug, error);
    return undefined;
  }
}
