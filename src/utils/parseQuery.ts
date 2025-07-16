// src/utils/parseQuery.ts
// Negative tokens & phrase parsing utility for advanced query processing

import { sanitize } from '../services/searchUtils';
// Simple escape function to avoid ESM import issues
function escapeStringRegexp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export interface ParsedQuery {
  positive: string[];
  negatives: string[];
  phrases: string[];
}

/**
 * Parse search query into positive terms, negative terms, and phrases
 * 
 * @param raw - Raw search query from user
 * @returns Parsed query components
 * 
 * @example
 * parseQuery('employment "non compete" -temporary')
 * // Returns: {
 * //   positive: ['employment'],
 * //   negatives: ['temporary'],
 * //   phrases: ['non compete']
 * // }
 */
export function parseQuery(raw: string): ParsedQuery {
  // Sanitize the input to handle Unicode, special characters, etc.
  const clean = sanitize(raw);
  
  if (!clean.trim()) {
    return {
      positive: [],
      negatives: [],
      phrases: [],
    };
  }

  const result: ParsedQuery = {
    positive: [],
    negatives: [],
    phrases: [],
  };

  // Track what we've already extracted to avoid duplicates in positive terms
  let remaining = clean;

  // 1. Extract phrases first (quoted text)
  const phraseRegex = /"([^"]+)"/g;
  let phraseMatch;
  
  while ((phraseMatch = phraseRegex.exec(clean)) !== null) {
    const phrase = phraseMatch[1].trim();
    if (phrase) {
      result.phrases.push(phrase);
      // Remove from remaining text (escape special regex characters)
      const escapedPhrase = escapeStringRegexp(phraseMatch[0]);
      remaining = remaining.replace(new RegExp(escapedPhrase, 'g'), ' ');
    }
  }

  // 2. Extract negative terms (prefixed with -)
  const negativeRegex = /-(\w+)/g;
  let negativeMatch;
  
  while ((negativeMatch = negativeRegex.exec(remaining)) !== null) {
    const negativeToken = negativeMatch[1].trim().toLowerCase();
    if (negativeToken) {
      result.negatives.push(negativeToken);
      // Remove from remaining text
      const escapedNegative = escapeStringRegexp(negativeMatch[0]);
      remaining = remaining.replace(new RegExp(escapedNegative, 'g'), ' ');
    }
  }

  // 3. Extract positive terms (everything else that's not whitespace)
  const positiveTokens = remaining
    .split(/\s+/)
    .map(token => token.trim().toLowerCase())
    .filter(token => token.length > 0);

  result.positive = positiveTokens;

  return result;
}

/**
 * Check if a document's keywords intersect with negative terms
 * 
 * @param keywords - Document keywords array
 * @param negatives - Negative terms to exclude
 * @returns true if document should be excluded
 */
export function hasNegativeMatch(keywords: string[], negatives: string[]): boolean {
  if (negatives.length === 0) {
    return false;
  }

  const keywordSet = new Set(keywords.map(k => k.toLowerCase()));
  
  return negatives.some(negative => keywordSet.has(negative.toLowerCase()));
}

/**
 * Check if a document contains all required phrases
 * 
 * @param keywords - Document keywords array
 * @param phrases - Required phrases
 * @returns true if all phrases are found
 */
export function hasAllPhrases(keywords: string[], phrases: string[]): boolean {
  if (phrases.length === 0) {
    return true;
  }

  const keywordText = keywords.join(' ').toLowerCase();
  
  return phrases.every(phrase => {
    const normalizedPhrase = phrase.toLowerCase();
    return keywordText.includes(normalizedPhrase);
  });
}

/**
 * Check if a document matches parsed query criteria
 * 
 * @param keywords - Document keywords array
 * @param parsedQuery - Parsed query from parseQuery()
 * @returns true if document matches all criteria
 */
export function matchesParsedQuery(keywords: string[], parsedQuery: ParsedQuery): boolean {
  // Exclude if any negative terms match
  if (hasNegativeMatch(keywords, parsedQuery.negatives)) {
    return false;
  }

  // Exclude if not all phrases are present
  if (!hasAllPhrases(keywords, parsedQuery.phrases)) {
    return false;
  }

  return true;
}

/**
 * Validate and sanitize parsed query for security
 * 
 * @param parsedQuery - Query to validate
 * @returns Sanitized query with limits applied
 */
export function validateParsedQuery(parsedQuery: ParsedQuery): ParsedQuery {
  const maxTerms = 50; // Prevent DoS with too many terms
  const maxPhraseLength = 100; // Prevent excessively long phrases

  return {
    positive: parsedQuery.positive
      .slice(0, maxTerms)
      .filter(term => term.length <= maxPhraseLength),
    negatives: parsedQuery.negatives
      .slice(0, maxTerms)
      .filter(term => term.length <= maxPhraseLength),
    phrases: parsedQuery.phrases
      .slice(0, maxTerms)
      .filter(phrase => phrase.length <= maxPhraseLength),
  };
}

export default parseQuery;