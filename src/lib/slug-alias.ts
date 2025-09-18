// src/lib/slug-alias.ts
// Central mapping for historical/canonical slug differences

const aliasToCanonical: Record<string, string> = {
  'bill-of-sale-vehicle': 'vehicle-bill-of-sale',
};

export function resolveDocSlug(slug: string): string {
  return aliasToCanonical[slug] || slug;
}

export function getSlugAliases(slug: string): string[] {
  const aliases: string[] = [];
  for (const [alias, canonical] of Object.entries(aliasToCanonical)) {
    if (canonical === slug) aliases.push(alias);
  }
  return aliases;
}

