export interface RawHit {
  id: string;
  keywordsHit: Set<string>;
  source: 'keyword' | 'synonym';
}

export interface DiscoveryResult {
  id: string;
  score: number;
  keywordsHit: string[];
}

export function rank(rawHits: RawHit[]): DiscoveryResult[] {
  const grouped = new Map<string, { keywordHits: Set<string>; synonymHits: Set<string> }>();

  for (const hit of rawHits) {
    if (!grouped.has(hit.id)) {
      grouped.set(hit.id, { keywordHits: new Set(), synonymHits: new Set() });
    }
    const entry = grouped.get(hit.id)!;
    const targetSet = hit.source === 'keyword' ? entry.keywordHits : entry.synonymHits;
    hit.keywordsHit.forEach(k => targetSet.add(k));
  }

  const results: DiscoveryResult[] = [];

  for (const [id, { keywordHits, synonymHits }] of grouped) {
    const hitsFromOriginalTokens = keywordHits.size;
    const hitsFromSynonyms = synonymHits.size;
    const score = hitsFromOriginalTokens * 2 + hitsFromSynonyms;
    const allHits = new Set([...keywordHits, ...synonymHits]);
    results.push({ id, score, keywordsHit: Array.from(allHits) });
  }

  return results.sort((a, b) => b.score - a.score || a.id.localeCompare(b.id));
}
