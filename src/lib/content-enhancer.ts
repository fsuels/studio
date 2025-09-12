// Content Enhancement Utilities for SEO Internal Linking
import { findRelevantDocuments, type LinkingSuggestion } from './internal-linking';
import { documentLibrary } from './document-library';

export interface ContentAnalysis {
  originalContent: string;
  enhancedContent: string;
  linksAdded: number;
  suggestions: LinkingSuggestion[];
  keywords: string[];
  readingTime: number;
}

export interface SEOMetrics {
  wordCount: number;
  internalLinks: number;
  externalLinks: number;
  headings: { level: number; text: string }[];
  keywordDensity: Record<string, number>;
}

/**
 * Analyze content for SEO metrics and enhancement opportunities
 */
export function analyzeContent(content: string): SEOMetrics {
  const wordCount = content.split(/\s+/).filter((word) => word.length > 0).length;

  // Count existing links
  const internalLinks = (content.match(/href="\/[^"]*"/g) || []).length;
  const externalLinks = (content.match(/href="https?:\/\/[^"]*"/g) || []).length;

  // Extract headings
  const headingMatches = content.match(/<h([1-6])[^>]*>([^<]+)<\/h[1-6]>/g) || [];
  const headings = headingMatches.map((match) => {
    const levelMatch = match.match(/<h([1-6])/);
    const textMatch = match.match(/>([^<]+)</);
    return {
      level: parseInt(levelMatch?.[1] || '1'),
      text: textMatch?.[1] || '',
    };
  });

  // Calculate keyword density for document keywords
  const keywordDensity: Record<string, number> = {};
  const contentLower = content.toLowerCase();

  documentLibrary.forEach((doc) => {
    const docName = doc.translations?.en?.name || doc.name;
    if (docName) {
      const keyword = docName.toLowerCase();
      const matches = (contentLower.match(new RegExp(keyword, 'g')) || []).length;
      if (matches > 0) {
        keywordDensity[keyword] = (matches / wordCount) * 100;
      }
    }
  });

  return {
    wordCount,
    internalLinks,
    externalLinks,
    headings,
    keywordDensity,
  };
}

/**
 * Enhanced content processor with intelligent link insertion
 */
export function enhanceContentWithLinks(
  content: string,
  locale: 'en' | 'es' = 'en',
  options: {
    maxLinksPerDocument?: number;
    preserveExistingLinks?: boolean;
    linkPriority?: 'high' | 'medium' | 'low';
  } = {},
): ContentAnalysis {
  const {
    maxLinksPerDocument = 8,
    preserveExistingLinks = true,
    linkPriority = 'medium',
  } = options;

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://123legaldoc.com';
  let enhancedContent = content;
  let linksAdded = 0;

  // Find relevant documents
  const suggestions = findRelevantDocuments(content, maxLinksPerDocument * 2);
  const filteredSuggestions = suggestions.filter((suggestion) => {
    if (linkPriority === 'high') return suggestion.priority === 'high';
    if (linkPriority === 'low') return true;
    return suggestion.priority !== 'low';
  });

  const usedDocuments = new Set<string>();
  const processedKeywords = new Set<string>();

  // Process suggestions in priority order
  filteredSuggestions.forEach((suggestion) => {
    if (linksAdded >= maxLinksPerDocument) return;

    const document = suggestion.documents[0];
    const keyword = suggestion.keyword;

    // Skip if already processed this document or keyword
    if (usedDocuments.has(document.id) || processedKeywords.has(keyword.toLowerCase())) {
      return;
    }

    // Check if keyword exists in content and isn't already linked
    const keywordRegex = new RegExp(`\\b${keyword}\\b(?![^<]*>|[^<]*</a>)`, 'i');

    if (keywordRegex.test(enhancedContent)) {
      const linkUrl = `${baseUrl}/${locale}/docs/${document.id}`;
      const linkTitle = document.translations?.[locale]?.name || document.name;
      const linkClass =
        'internal-doc-link text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline font-medium';

      // Create the link HTML with proper attributes
      const linkHtml = `<a href="${linkUrl}" title="${linkTitle} Template" class="${linkClass}" data-document-id="${document.id}">${keyword}</a>`;

      // Replace first occurrence only
      enhancedContent = enhancedContent.replace(keywordRegex, linkHtml);

      usedDocuments.add(document.id);
      processedKeywords.add(keyword.toLowerCase());
      linksAdded++;
    }
  });

  // Extract keywords that were actually used
  const keywords = Array.from(processedKeywords);

  // Calculate reading time (average 200 words per minute)
  const wordCount = content.split(/\s+/).filter((word) => word.length > 0).length;
  const readingTime = Math.ceil(wordCount / 200);

  return {
    originalContent: content,
    enhancedContent,
    linksAdded,
    suggestions: filteredSuggestions.slice(0, maxLinksPerDocument),
    keywords,
    readingTime,
  };
}

/**
 * Generate contextual call-to-action based on content
 */
export function generateContextualCTA(
  content: string,
  locale: 'en' | 'es' = 'en',
): {
  title: string;
  description: string;
  buttonText: string;
  linkUrl: string;
  priority: number;
} | null {
  const suggestions = findRelevantDocuments(content, 1);
  if (suggestions.length === 0) return null;

  const primaryDoc = suggestions[0].documents[0];
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://123legaldoc.com';

  const ctaTexts = {
    en: {
      title: `Ready to Create Your ${primaryDoc.translations?.en?.name || primaryDoc.name}?`,
      description:
        'Use our professionally drafted template to get started today. Fully customizable and legally compliant.',
      buttonText: `Get ${primaryDoc.translations?.en?.name || primaryDoc.name} Template`,
    },
    es: {
      title: `¿Listo para Crear tu ${primaryDoc.translations?.es?.name || primaryDoc.name}?`,
      description:
        'Usa nuestra plantilla redactada profesionalmente para comenzar hoy. Completamente personalizable y legalmente compatible.',
      buttonText: `Obtener Plantilla de ${primaryDoc.translations?.es?.name || primaryDoc.name}`,
    },
  };

  const texts = ctaTexts[locale];

  return {
    title: texts.title,
    description: texts.description,
    buttonText: texts.buttonText,
    linkUrl: `${baseUrl}/${locale}/docs/${primaryDoc.id}`,
    priority: suggestions[0].priority === 'high' ? 10 : suggestions[0].priority === 'medium' ? 7 : 5,
  };
}

/**
 * Batch process multiple content pieces for internal linking
 */
export function batchEnhanceContent(
  contentPieces: Array<{ id: string; content: string; category?: string }>,
  locale: 'en' | 'es' = 'en',
): Record<string, ContentAnalysis> {
  const results: Record<string, ContentAnalysis> = {};

  contentPieces.forEach((piece) => {
    const options = {
      maxLinksPerDocument: 5, // Conservative for batch processing
      linkPriority: 'medium' as const,
    };

    results[piece.id] = enhanceContentWithLinks(piece.content, locale, options);
  });

  return results;
}

/**
 * Generate internal linking report for content audit
 */
export function generateLinkingReport(content: string): {
  opportunities: number;
  implementedLinks: number;
  missedKeywords: string[];
  linkDensity: number;
  recommendations: string[];
} {
  const analysis = analyzeContent(content);
  const enhancement = enhanceContentWithLinks(content);

  const wordCount = analysis.wordCount;
  const linkDensity = (analysis.internalLinks / wordCount) * 100;
  const opportunities = enhancement.suggestions.length;
  const missedKeywords = enhancement.suggestions
    .filter((s) => !content.toLowerCase().includes(s.keyword.toLowerCase()))
    .map((s) => s.keyword);

  const recommendations: string[] = [];

  if (linkDensity < 1) {
    recommendations.push('Consider adding more internal links to improve SEO');
  }
  if (linkDensity > 5) {
    recommendations.push('Link density is high - ensure links add value for users');
  }
  if (opportunities > enhancement.linksAdded) {
    recommendations.push(`${opportunities - enhancement.linksAdded} more linking opportunities available`);
  }
  if (analysis.headings.length < 3) {
    recommendations.push('Add more headings to improve content structure');
  }

  return {
    opportunities,
    implementedLinks: enhancement.linksAdded,
    missedKeywords,
    linkDensity,
    recommendations,
  };
}

/**
 * Extract and categorize all document references in content
 */
export function extractDocumentReferences(content: string): {
  explicit: string[]; // Direct mentions like "lease agreement"
  implicit: string[]; // Related terms like "rental contract"
  categories: string[]; // Content categories
} {
  const contentLower = content.toLowerCase();
  const explicit: string[] = [];
  const implicit: string[] = [];
  const categories = new Set<string>();

  documentLibrary.forEach((doc) => {
    const docName = (doc.translations?.en?.name || doc.name).toLowerCase();

    // Check for exact matches
    if (contentLower.includes(docName)) {
      explicit.push(doc.id);
      if (doc.category) categories.add(doc.category);
    }

    // Check for related terms
    const keywords = [
      docName.split(' '),
      doc.translations?.en?.description?.toLowerCase().split(' ') || [],
      Object.keys(doc.schema?.shape || {}),
    ]
      .flat()
      .filter(Boolean) as string[];

    keywords.forEach((keyword) => {
      if (keyword.length > 3 && contentLower.includes(keyword)) {
        implicit.push(doc.id);
        if (doc.category) categories.add(doc.category);
      }
    });
  });

  return {
    explicit: [...new Set(explicit)],
    implicit: [...new Set(implicit)],
    categories: Array.from(categories),
  };
}

