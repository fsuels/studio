// State code to slug conversion utility
export const STATE_CODE_TO_SLUG: Record<string, string> = {
  fl: 'florida',
  al: 'alabama',
  co: 'colorado',
  ga: 'georgia',
  id: 'idaho',
  ks: 'kansas',
  md: 'maryland',
  mt: 'montana',
  nd: 'north-dakota',
  wv: 'west-virginia',
  // Add more states as needed
  az: 'arizona',
  ar: 'arkansas',
  ca: 'california',
  ct: 'connecticut',
  de: 'delaware',
  hi: 'hawaii',
  il: 'illinois',
  in: 'indiana',
  ia: 'iowa',
  ky: 'kentucky',
  la: 'louisiana',
  me: 'maine',
  ma: 'massachusetts',
  mi: 'michigan',
  mn: 'minnesota',
  ms: 'mississippi',
  mo: 'missouri',
  ne: 'nebraska',
  nv: 'nevada',
  nh: 'new-hampshire',
  nj: 'new-jersey',
  nm: 'new-mexico',
  ny: 'new-york',
  nc: 'north-carolina',
  oh: 'ohio',
  ok: 'oklahoma',
  or: 'oregon',
  pa: 'pennsylvania',
  ri: 'rhode-island',
  sc: 'south-carolina',
  sd: 'south-dakota',
  tn: 'tennessee',
  tx: 'texas',
  ut: 'utah',
  vt: 'vermont',
  va: 'virginia',
  wa: 'washington',
  wi: 'wisconsin',
  wy: 'wyoming'
};

export function stateCodeToSlug(code?: string | null): string | undefined {
  if (!code) return;
  const k = code.toLowerCase();
  return STATE_CODE_TO_SLUG[k] ?? k; // falls back to code if unknown
}

// Inverse mapping for convenience
export const STATE_SLUG_TO_CODE: Record<string, string> = Object.fromEntries(
  Object.entries(STATE_CODE_TO_SLUG).map(([code, slug]) => [slug, code.toUpperCase()])
);

export function stateSlugToCode(slug?: string | null): string | undefined {
  if (!slug) return;
  const s = slug.toLowerCase();
  return STATE_SLUG_TO_CODE[s] ?? s.toUpperCase();
}