// src/lib/enhanced-search.ts
import { taxonomy } from '@/config/taxonomy';
import { getDocMeta } from '@/config/doc-meta';
import slugMap from '@/config/doc-meta/slug-category-map.json';
import type { LegalDocument } from '@/types/documents';
import { getDocumentTitle } from '@/lib/format-utils';

interface SearchResult {
  slug: string;
  title: string;
  description: string;
  complexity: string;
  popular: boolean;
  category: string;
  relevanceScore: number;
  matchType: 'exact' | 'synonym' | 'fuzzy' | 'category';
}

interface EnhancedSearchOptions {
  includePopular?: boolean;
  maxResults?: number;
  roleFilter?: string;
  situationFilter?: string;
  complexityFilter?: 'easy' | 'medium' | 'advanced';
}

/**
 * Enhanced search function that incorporates taxonomy synonyms and metadata
 */
export async function enhancedSearch(
  query: string,
  locale: 'en' | 'es' = 'en',
  options: EnhancedSearchOptions = {},
): Promise<SearchResult[]> {
  const {
    includePopular = false,
    maxResults = 10,
    roleFilter,
    situationFilter,
    complexityFilter,
  } = options;

  if (!query.trim() && !includePopular) {
    return [];
  }

  const results: SearchResult[] = [];
  const processedSlugs = new Set<string>();

  try {
    // 1. Expand query with synonyms
    const expandedQueries = expandQueryWithSynonyms(query.toLowerCase().trim());

    // 2. Search through document slugs and metadata
    const allSlugs = Object.keys(slugMap);
    console.log('Enhanced search - total slugs:', allSlugs.length);

    for (const slug of allSlugs) {
      if (processedSlugs.has(slug)) continue;

      try {
        const meta = await getDocMeta(slug);
        if (!meta) continue;

      let relevanceScore = 0;
      let matchType: SearchResult['matchType'] = 'fuzzy';

      // Check if document matches filters
      if (complexityFilter && meta.complexity !== complexityFilter) continue;

      if (roleFilter && !isDocumentRelevantToRole(slug, roleFilter)) continue;

      if (
        situationFilter &&
        !isDocumentRelevantToSituation(slug, situationFilter)
      )
        continue;

      // Calculate relevance score
      const titleLower = meta.title.toLowerCase();
      const descLower = meta.description.toLowerCase();

      // Exact title match
      if (titleLower.includes(query.toLowerCase())) {
        relevanceScore += 100;
        matchType = 'exact';
      }

      // Synonym matches
      for (const expandedQuery of expandedQueries) {
        if (
          titleLower.includes(expandedQuery) ||
          descLower.includes(expandedQuery)
        ) {
          relevanceScore += 75;
          if (matchType === 'fuzzy') matchType = 'synonym';
        }
      }

      // Category name match
      const categoryName =
        taxonomy.categories[meta.category as keyof typeof taxonomy.categories]
          ?.name || '';
      if (categoryName.toLowerCase().includes(query.toLowerCase())) {
        relevanceScore += 50;
        if (matchType === 'fuzzy') matchType = 'category';
      }

      // Fuzzy description match
      if (descLower.includes(query.toLowerCase())) {
        relevanceScore += 30;
      }

      // Boost popular documents
      if (meta.popular) {
        relevanceScore += 25;
      }

      // Boost simpler documents for basic queries
      if (meta.complexity === 'easy') {
        relevanceScore += 10;
      }

      // Only include if we have some relevance or it's a popular document request
      if (relevanceScore > 0 || (includePopular && meta.popular)) {
        results.push({
          slug,
          title: meta.title,
          description: meta.description,
          complexity: meta.complexity,
          popular: meta.popular,
          category: slugMap[slug as keyof typeof slugMap] || 'misc',
          relevanceScore:
            includePopular && meta.popular
              ? Math.max(relevanceScore, 50)
              : relevanceScore,
          matchType,
        });

        processedSlugs.add(slug);
      }
    } catch (error) {
      // Skip documents that fail to load
      console.warn(`Failed to load metadata for ${slug}:`, error);
    }
  }

    // Sort by relevance score and return top results
    return results
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, maxResults);
  } catch (error) {
    console.error('Enhanced search error:', error);
    // Fallback to legacy search if enhanced search fails (dynamic import)
    const legacyResults = await legacySearch(query, locale);
    return legacyResults
      .slice(0, maxResults)
      .map((doc) => ({
        slug: doc.id,
        title: getDocumentTitle(doc, locale),
        description: doc.translations?.[locale]?.description || doc.description || '',
        complexity: 'medium',
        popular: false,
        category: doc.category,
        relevanceScore: 50,
        matchType: 'fuzzy' as const,
      }));
  }
}

/**
 * Expand query terms using taxonomy synonyms
 */
function expandQueryWithSynonyms(query: string): string[] {
  const expanded = new Set([query]);

  // Split query into words for multi-word synonym matching
  // Split query into words for potential future use (kept for clarity)
  const _queryWords = query.split(/\s+/);

  // Check if synonyms exist in taxonomy
  if (!taxonomy.synonyms) {
    return Array.from(expanded);
  }

  // Check each synonym entry
  Object.entries(taxonomy.synonyms).forEach(([synonym, targets]) => {
    // Check if the query contains this synonym
    if (query.includes(synonym.toLowerCase())) {
      targets.forEach((target) => {
        if (typeof target === 'string') {
          expanded.add(target.toLowerCase());
        }
      });
    }

    // Check if any target matches our query
    targets.forEach((target) => {
      if (typeof target === 'string' && query.includes(target.toLowerCase())) {
        expanded.add(synonym.toLowerCase());
      }
    });
  });

  return Array.from(expanded);
}

/**
 * Check if a document is relevant to a specific role
 */
function isDocumentRelevantToRole(slug: string, roleKey: string): boolean {
  const role = taxonomy.roles[roleKey];
  if (!role) return true;

  // Check if document is in role's quick docs
  if (role.quickDocs && role.quickDocs[slug]) {
    return true;
  }

  // Check if document category matches role's common categories
  const docCategory = slugMap[slug as keyof typeof slugMap];
  if (!docCategory) return true;

  // This could be enhanced with more sophisticated role-to-category mapping
  return true;
}

/**
 * Check if a document is relevant to a specific situation
 */
function isDocumentRelevantToSituation(
  slug: string,
  situationKey: string,
): boolean {
  const situation = taxonomy.situations[situationKey];
  if (!situation?.domains) return true;

  const docCategory = slugMap[slug as keyof typeof slugMap];
  if (!docCategory) return true;

  // Check if document's category domain matches situation domains
  const categoryData =
    taxonomy.categories[docCategory as keyof typeof taxonomy.categories];
  if (!categoryData) return true;

  return situation.domains.includes(categoryData.name);
}

/**
 * Fallback to original search for backward compatibility
 */
export async function legacySearch(
  query: string,
  locale: 'en' | 'es',
  state?: string,
): Promise<LegalDocument[]> {
  const mod = await import('@/lib/document-library.ts');
  return mod.search(query, locale, state);
}

/**
 * Get popular documents for a specific role
 */
export async function getPopularDocumentsForRole(
  roleKey: string,
  maxResults: number = 5,
): Promise<SearchResult[]> {
  const role = taxonomy.roles[roleKey];
  if (!role?.quickDocs) return [];

  const results: SearchResult[] = [];

  for (const [slug, weight] of Object.entries(role.quickDocs)) {
    try {
      const meta = await getDocMeta(slug);
      if (meta) {
        results.push({
          slug,
          title: meta.title,
          description: meta.description,
          complexity: meta.complexity,
          popular: meta.popular,
          category: slugMap[slug as keyof typeof slugMap] || 'misc',
          relevanceScore: weight,
          matchType: 'exact',
        });
      }
    } catch (error) {
      console.warn(`Failed to load metadata for ${slug}:`, error);
    }
  }

  return results
    .sort((a, b) => b.relevanceScore - a.relevanceScore)
    .slice(0, maxResults);
}

/**
 * Get suggestions for empty search (popular documents)
 */
export async function getSearchSuggestions(
  locale: 'en' | 'es' = 'en',
): Promise<SearchResult[]> {
  return enhancedSearch('', locale, { includePopular: true, maxResults: 6 });
}

export default enhancedSearch;
