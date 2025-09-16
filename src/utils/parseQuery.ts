// src/utils/parseQuery.ts
// Negative tokens & phrase parsing utility for advanced query processing

import { sanitize } from '../services/searchUtils';

// Simple escape function to avoid ESM import issues
function escapeStringRegexp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const WORD_TOKEN_PATTERN = /^[\p{L}\p{N}][\p{L}\p{N}-]*$/u;
const NEGATIVE_TOKEN_PATTERN = /^-([\p{L}\p{N}][\p{L}\p{N}-]*)$/u;
const NON_WORD_SPLIT = /[^\p{L}\p{N}]+/u;

function stripDiacritics(value: string): string {
  if (typeof value.normalize === 'function') {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  }

  return value;
}

function normaliseToken(token: string): string {
  return stripDiacritics(token).toLowerCase();
}

function tokeniseKeywords(keywords: string[]): string[] {
  const tokens: string[] = [];
  keywords.forEach(keyword => {
    const cleaned = stripDiacritics(keyword).toLowerCase();
    cleaned
      .split(NON_WORD_SPLIT)
      .filter(Boolean)
      .forEach(token => tokens.push(token));
  });

  return tokens;
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
  const sanitised = sanitize(raw ?? '');

  if (!sanitised.trim()) {
    return { positive: [], negatives: [], phrases: [] };
  }

  const result: ParsedQuery = { positive: [], negatives: [], phrases: [] };

  const workingSegments: string[] = [];
  let working = stripDiacritics(sanitised)
    .replace(/[^\p{L}\p{N}\s-]/gu, ' ');

  const quotedRegex = /"([^\"]*)"/g;
  let match: RegExpExecArray | null;

  while ((match = quotedRegex.exec(raw)) !== null) {
    const phraseContent = match[1];
    if (phraseContent.trim().length === 0) {
      continue;
    }

    const normalisedPhrase = stripDiacritics(phraseContent);
    result.phrases.push(normalisedPhrase);

    const sanitisedPhrase = stripDiacritics(phraseContent).toLowerCase();
    if (sanitisedPhrase && /\s/.test(sanitisedPhrase)) {
      const escapedPhrase = escapeStringRegexp(sanitisedPhrase);
      working = working.replace(new RegExp(`\\b${escapedPhrase}\\b`, 'g'), ' ');
    }
  }

  // Handle unmatched trailing quote – remove everything except the last token
  const quoteCount = (raw.match(/"/g) || []).length;
  if (quoteCount % 2 === 1) {
    const lastQuoteIndex = raw.lastIndexOf('"');
    if (lastQuoteIndex !== -1 && lastQuoteIndex < raw.length - 1) {
      const unmatchedSegment = raw.slice(lastQuoteIndex + 1);
      const unmatchedTokens = sanitize(unmatchedSegment)
        .split(/\s+/)
        .filter(Boolean);

      if (unmatchedTokens.length > 1) {
        const tokensToRemove = unmatchedTokens.slice(0, -1);
        tokensToRemove.forEach(token => {
          const escaped = escapeStringRegexp(token);
          working = working.replace(new RegExp(`\\b${escaped}\\b`, 'g'), ' ');
        });
      }
    }
  }

  working = working.replace(/"/g, ' ');

  const rawTokens = working
    .split(/\s+/)
    .map(token => token.trim())
    .filter(Boolean);

  rawTokens.forEach(token => {
    if (token === '-') {
      return;
    }

    const negativeMatch = token.match(NEGATIVE_TOKEN_PATTERN);
    if (negativeMatch) {
      result.negatives.push(negativeMatch[1]);
      return;
    }

    if (WORD_TOKEN_PATTERN.test(token)) {
      result.positive.push(token);
    }
  });

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

  const tokens = tokeniseKeywords(keywords);
  if (tokens.length === 0) {
    return false;
  }

  return phrases.every(phrase => {
    const phraseTokens = stripDiacritics(phrase)
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean);

    if (phraseTokens.length === 0) {
      return true;
    }

    for (let i = 0; i <= tokens.length - phraseTokens.length; i++) {
      let matched = true;
      for (let j = 0; j < phraseTokens.length; j++) {
        if (tokens[i + j] !== phraseTokens[j]) {
          matched = false;
          break;
        }
      }

      if (matched) {
        return true;
      }
    }

    return false;
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

  if (parsedQuery.positive.length === 0) {
    return true;
  }

  const keywordTokens = new Set(tokeniseKeywords(keywords));

  return parsedQuery.positive.every(term => keywordTokens.has(term));
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
